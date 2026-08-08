"use client";

/** Convert a data URL to a Blob for multipart upload. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(header || "")?.[1] || "image/png";
  const binary = atob(data || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Persist card via multipart (Vercel-friendly vs huge JSON). */
export async function persistCard(payload: {
  id: string;
  name: string;
  role: string;
  twitter?: string;
  builderTitle: string;
  format: "frame" | "card";
  imageDataUrl: string;
  photoDataUrl?: string;
}) {
  const form = new FormData();
  form.set("id", payload.id);
  form.set("name", payload.name);
  form.set("role", payload.role);
  form.set("builderTitle", payload.builderTitle);
  form.set("format", payload.format);
  if (payload.twitter) form.set("twitter", payload.twitter);
  form.set("image", dataUrlToBlob(payload.imageDataUrl), `${payload.id}.png`);
  if (payload.photoDataUrl) {
    form.set("photo", dataUrlToBlob(payload.photoDataUrl), `photo-${payload.id}.png`);
  }

  const res = await fetch("/api/cards", { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Save failed");
  }
  return res.json() as Promise<{
    ok: boolean;
    id: string;
    url: string;
    imageUrl: string;
    publicImage: boolean;
  }>;
}
