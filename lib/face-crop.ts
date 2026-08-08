import type { CropArea } from "@/types";

/**
 * Smart center crop for square outputs.
 * Prefers upper-center for portraits (faces usually sit higher).
 */
export function smartCenterCrop(
  width: number,
  height: number,
  aspect = 1
): CropArea {
  const targetRatio = aspect;
  const imageRatio = width / height;

  let cropWidth: number;
  let cropHeight: number;

  if (imageRatio > targetRatio) {
    cropHeight = height;
    cropWidth = height * targetRatio;
  } else {
    cropWidth = width;
    cropHeight = width / targetRatio;
  }

  // Bias slightly upward for portraits (likely face position)
  const isPortrait = height > width;
  const yBias = isPortrait ? 0.35 : 0.5;

  const x = Math.max(0, (width - cropWidth) / 2);
  const y = Math.max(0, Math.min(height - cropHeight, height * yBias - cropHeight / 2));

  return { x, y, width: cropWidth, height: cropHeight };
}

/**
 * Prefer native FaceDetector API when available; otherwise smart crop.
 */
export async function detectFaceCrop(
  image: HTMLImageElement | ImageBitmap,
  aspect = 1
): Promise<CropArea> {
  const width = "naturalWidth" in image ? image.naturalWidth || image.width : image.width;
  const height =
    "naturalHeight" in image ? image.naturalHeight || image.height : image.height;

  try {
    // @ts-expect-error FaceDetector is experimental
    if (typeof FaceDetector === "undefined") {
      return smartCenterCrop(width, height, aspect);
    }

    // @ts-expect-error FaceDetector is experimental
    const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(image);

    if (!faces?.length) {
      return smartCenterCrop(width, height, aspect);
    }

    const box = faces[0].boundingBox as DOMRectReadOnly;
    const faceCx = box.x + box.width / 2;
    const faceCy = box.y + box.height / 2;

    const targetRatio = aspect;
    const imageRatio = width / height;

    let cropWidth: number;
    let cropHeight: number;

    if (imageRatio > targetRatio) {
      cropHeight = height;
      cropWidth = height * targetRatio;
    } else {
      cropWidth = width;
      cropHeight = width / targetRatio;
    }

    // Expand around face for a natural framing
    const pad = Math.max(box.width, box.height) * 1.6;
    cropWidth = Math.min(width, Math.max(cropWidth, pad));
    cropHeight = cropWidth / targetRatio;
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = height * targetRatio;
    }

    let x = faceCx - cropWidth / 2;
    let y = faceCy - cropHeight * 0.42;
    x = Math.max(0, Math.min(width - cropWidth, x));
    y = Math.max(0, Math.min(height - cropHeight, y));

    return { x, y, width: cropWidth, height: cropHeight };
  } catch {
    return smartCenterCrop(width, height, aspect);
  }
}

/** Crop an image to a square blob via canvas — never stretches. */
export async function cropToBlob(
  imageSrc: string,
  crop: CropArea,
  outputSize: number,
  mime = "image/png"
): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      mime,
      1
    );
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export function getCroppedImageDataUrl(
  imageSrc: string,
  crop: CropArea,
  outputSize: number
): Promise<string> {
  return cropToBlob(imageSrc, crop, outputSize).then(
    (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
  );
}
