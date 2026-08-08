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

function isMobileShareDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS desktop UA — still has touch share sheet
  if (
    navigator.platform === "MacIntel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  return false;
}

/** Copy PNG bytes so X compose can attach them via Ctrl/⌘+V. */
export async function copyPngToClipboard(dataUrl: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write) {
    return false;
  }
  if (typeof ClipboardItem === "undefined") return false;

  const blob = dataUrlToBlob(dataUrl);
  const pngBlob =
    blob.type === "image/png"
      ? blob
      : new Blob([blob], { type: "image/png" });

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
    return true;
  } catch {
    /* try promise form — required by Chromium in some versions */
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": Promise.resolve(pngBlob) }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export type ShareToXResult =
  | { method: "native" }
  | { method: "clipboard"; intentUrl: string }
  | { method: "download"; intentUrl: string };

/**
 * Share passport/frame to X with the created image under the post.
 *
 * X web intent cannot upload media. Working paths:
 * 1) Mobile: OS share sheet with the PNG file
 * 2) Desktop: copy PNG to clipboard → open compose → user pastes (Ctrl/⌘+V)
 * 3) Fallback: download PNG + open compose for manual attach
 */
export async function sharePassportToX(opts: {
  dataUrl: string;
  filename: string;
  text: string;
  /** Public builder page — appended for OG unfurl when available */
  pageUrl?: string;
  imageUrl?: string;
}): Promise<ShareToXResult> {
  const blob = dataUrlToBlob(opts.dataUrl);
  const file = new File([blob], opts.filename, {
    type: "image/png",
    lastModified: Date.now(),
  });

  const text = opts.text.trim();
  const filePayload = { files: [file], text, title: "HH Goa 2026" };

  // Mobile only — desktop Windows share often drops the file when targeting X
  if (
    isMobileShareDevice() &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      const canFiles =
        typeof navigator.canShare !== "function" ||
        navigator.canShare(filePayload);
      if (canFiles) {
        await navigator.share(filePayload);
        return { method: "native" };
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        return { method: "native" };
      }
      /* fall through */
    }
  }

  const intentUrl = buildTweetIntent({
    text,
    url:
      opts.pageUrl && !text.includes(opts.pageUrl) ? opts.pageUrl : undefined,
  });

  // Copy BEFORE opening X — must stay in the user-gesture chain as much as possible
  const copied = await copyPngToClipboard(opts.dataUrl);
  if (copied) {
    return { method: "clipboard", intentUrl };
  }

  downloadDataUrl(opts.dataUrl, opts.filename);
  return { method: "download", intentUrl };
}

export function openTweetIntent(intentUrl: string, target?: Window | null) {
  if (target && !target.closed) {
    target.location.href = intentUrl;
    return;
  }
  const link = document.createElement("a");
  link.href = intentUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
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
  // x.com intent is more reliable for the current compose UI
  return `https://x.com/intent/post?${params.toString()}`;
}

/** Open X compose without popup-blocker issues after async work. */
export function openTweetComposer(text: string) {
  openTweetIntent(buildTweetIntent({ text }));
}

/** Well-presented X post copy (matches HH Goa share style). */
export function buildShareTweet(opts: {
  mode: "frame" | "card";
  name: string;
  builderId: string;
  url: string;
  twitter?: string;
}): string {
  const name = (opts.name || "Builder").trim() || "Builder";
  const id = opts.builderId.startsWith("#")
    ? opts.builderId
    : `#${opts.builderId}`;
  const handle = (opts.twitter || "").trim().replace(/^@/, "");
  const headline =
    opts.mode === "frame"
      ? "🌴 Built my HH Goa 2026 Builder Frame!"
      : "🌴 Built my HH Goa 2026 Builder Passport!";
  const cta =
    opts.mode === "frame"
      ? "Create your own Builder Frame:"
      : "Create your own Builder Passport:";

  const lines = [
    headline,
    "",
    `👤 ${name}`,
    `🪪 Builder ID: ${id}`,
  ];
  if (handle) lines.push(`𝕏 @${handle}`);
  lines.push(
    "",
    "Excited to build, ship, and connect with amazing builders in Goa. 🚀",
    "",
    `${cta} ${opts.url}`,
    "",
    "#FrameInGoa #HHGoa2026"
  );
  return lines.join("\n");
}

export const PASSPORT_TWEET = (url: string) =>
  buildShareTweet({
    mode: "card",
    name: "Builder",
    builderId: "HHG26",
    url,
  });

export const FRAME_TWEET = (url: string) =>
  buildShareTweet({
    mode: "frame",
    name: "Builder",
    builderId: "HHG26",
    url,
  });

export const DEFAULT_TWEET = buildShareTweet({
  mode: "card",
  name: "Builder",
  builderId: "HHG26",
  url: "https://hhgoa.com",
});
