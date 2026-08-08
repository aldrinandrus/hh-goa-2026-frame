"use client";

import { toPng } from "html-to-image";

/** High-DPI PNG export from an HTML template node. */
export async function exportNodeToPng(
  node: HTMLElement,
  options?: { pixelRatio?: number; cacheBust?: boolean }
): Promise<string> {
  const pixelRatio = options?.pixelRatio ?? 2;
  const cacheBust = options?.cacheBust ?? false;

  // Only wait on fonts if they are still loading
  if (
    typeof document !== "undefined" &&
    "fonts" in document &&
    document.fonts.status !== "loaded"
  ) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((r) => setTimeout(r, 400)),
      ]);
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

  // Single capture — warm-up double-render was ~2× slower
  return toPng(node, {
    cacheBust,
    pixelRatio,
    quality: 1,
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
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(header || "")?.[1] || "image/png";
  const binary = atob(data || "");
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], filename, {
    type: blob.type || "image/png",
    lastModified: Date.now(),
  });
}

/**
 * Share passport/frame to X with the image attached when the OS allows it.
 * X web intent cannot attach media — so we:
 * 1) use native share sheet with the PNG file (mobile / supporting browsers), or
 * 2) download the PNG + open X compose with the public page URL (desktop fallback).
 */
export async function sharePassportToX(opts: {
  dataUrl: string;
  filename: string;
  text: string;
  /** Pre-opened tab to avoid popup blockers after await */
  shareTab?: Window | null;
}): Promise<"native" | "intent"> {
  const file = dataUrlToFile(opts.dataUrl, opts.filename);
  const payload = { files: [file], text: opts.text, title: "HH Goa 2026" };

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare(payload)
  ) {
    try {
      await navigator.share(payload);
      if (opts.shareTab && !opts.shareTab.closed) opts.shareTab.close();
      return "native";
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        if (opts.shareTab && !opts.shareTab.closed) opts.shareTab.close();
        return "native";
      }
      /* fall through to intent */
    }
  }

  // Desktop: give them the PNG to attach, open compose with link preview URL
  downloadDataUrl(opts.dataUrl, opts.filename);
  const intent = buildTweetIntent({ text: opts.text });
  if (opts.shareTab && !opts.shareTab.closed) {
    opts.shareTab.location.href = intent;
  } else {
    openTweetComposer(opts.text);
  }
  return "intent";
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
