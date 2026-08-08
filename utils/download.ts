"use client";

import { toPng } from "html-to-image";

/** High-DPI PNG export from an HTML template node. */
export async function exportNodeToPng(
  node: HTMLElement,
  options?: { pixelRatio?: number; cacheBust?: boolean }
): Promise<string> {
  const pixelRatio = options?.pixelRatio ?? 2;

  // Ensure fonts are ready (prevents blank/broken typography in exports)
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      try {
        await img.decode();
      } catch {
        /* ignore */
      }
    })
  );

  const filter = (domNode: HTMLElement) => {
    // Skip invisible noise that can break html-to-image
    if (domNode.tagName === "SCRIPT") return false;
    return true;
  };

  await toPng(node, {
    cacheBust: options?.cacheBust ?? true,
    pixelRatio: 1,
    quality: 1,
    filter,
  });

  return toPng(node, {
    cacheBust: options?.cacheBust ?? true,
    pixelRatio,
    quality: 1,
    filter,
    style: {
      transform: "none",
    },
  });
}

/** Reliable PNG download via Blob (data-URL length limits break <a download>). */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const blob = dataUrlToBlob(dataUrl);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Delay revoke so the browser can start the download
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(header || "")?.[1] || "image/png";
  const binary = atob(data || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function buildTweetIntent(opts: {
  text: string;
  url?: string;
  hashtags?: string[];
}): string {
  const params = new URLSearchParams();
  params.set("text", opts.text);
  if (opts.url) params.set("url", opts.url);
  if (opts.hashtags?.length) params.set("hashtags", opts.hashtags.join(","));
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** Open X compose without popup-blocker issues after async work. */
export function openTweetComposer(text: string) {
  const intent = buildTweetIntent({ text });
  // Prefer same-tab navigation fallback via <a> click (still allowed after await)
  const link = document.createElement("a");
  link.href = intent;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const PASSPORT_TWEET = (url: string) =>
  `Just got my HH Goa 2026 Builder Passport 🌴

See you in Goa.

Build. Ship. Repeat.

#FrameInGoa
${url}`;

export const FRAME_TWEET = (url: string) =>
  `Just framed myself for HH Goa 2026 🌴

Build. Ship. Repeat.

#FrameInGoa
${url}`;

export const DEFAULT_TWEET = `Just got my HH Goa 2026 Builder Passport 🌴

See you in Goa.

#FrameInGoa`;
