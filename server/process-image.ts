import sharp from "sharp";

/**
 * Server-side image normalize: rotate via EXIF, resize long edge, PNG out.
 * Never stretches — fit inside bounds preserving aspect.
 */
export async function processUploadBuffer(
  input: Buffer,
  maxEdge = 2048
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? maxEdge;
  const height = meta.height ?? maxEdge;

  const longest = Math.max(width, height);
  const pipeline =
    longest > maxEdge
      ? image.resize({
          width: width >= height ? maxEdge : undefined,
          height: height > width ? maxEdge : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
      : image;

  const buffer = await pipeline.png({ quality: 100, compressionLevel: 6 }).toBuffer();
  const outMeta = await sharp(buffer).metadata();

  return {
    buffer,
    width: outMeta.width ?? width,
    height: outMeta.height ?? height,
  };
}
