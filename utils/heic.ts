"use client";

import { MAX_UPLOAD_BYTES } from "@/lib/design-tokens";

/** Convert HEIC/HEIF (iPhone) to PNG via heic2any. */
export async function convertHeicToPng(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/png",
    quality: 1,
  });
  const blob = Array.isArray(result) ? result[0]! : result;
  const name = file.name.replace(/\.(heic|heif)$/i, ".png");
  return new File([blob], name, { type: "image/png" });
}

export function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

export function validateImageFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "File must be under 20 MB.";
  }
  const okType =
    file.type.startsWith("image/") ||
    isHeic(file) ||
    /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  if (!okType) {
    return "Use JPG, PNG, WEBP, or HEIC.";
  }
  return null;
}

/** Normalize any accepted upload into a browser-friendly image File. */
export async function normalizeUpload(file: File): Promise<File> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);
  if (isHeic(file)) {
    return convertHeicToPng(file);
  }
  return file;
}
