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

async function warmPublicUrls(...urls: (string | undefined)[]) {
  await Promise.all(
    urls
      .filter((u): u is string => Boolean(u && u.startsWith("http")))
      .map((u) =>
        fetch(u, { mode: "no-cors", cache: "no-store" }).catch(() => undefined)
      )
  );
}

/**
 * Share passport/frame to X with the created image under the post.
 * X web intent cannot upload media bytes, so we:
 * 1) native share sheet with the PNG file when possible (real media attach),
 * 2) else open compose with tweet text + public page URL so X can unfurl
 *    the `summary_large_image` OG card (requires Blob + working /builder/[id]).
 */
export async function sharePassportToX(opts: {
  dataUrl: string;
  filename: string;
  text: string;
  /** Public builder page — used for X large-image card unfurl */
  pageUrl?: string;
  /** Absolute PNG URL — warmed so crawlers can fetch it */
  imageUrl?: string;
  /** Pre-opened tab to avoid popup blockers after await */
  shareTab?: Window | null;
}): Promise<"native" | "intent"> {
  const blob = dataUrlToBlob(opts.dataUrl);
  const file = new File([blob], opts.filename, {
    type: "image/png",
    lastModified: Date.now(),
  });

  const text = opts.text.trim();
  const filePayload = { files: [file], text, title: "HH Goa 2026" };

  // Prefer OS share with the PNG attached (image appears under the tweet on X)
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const canFiles =
        typeof navigator.canShare !== "function" ||
        navigator.canShare(filePayload);
      if (canFiles) {
        await navigator.share(filePayload);
        if (opts.shareTab && !opts.shareTab.closed) opts.shareTab.close();
        return "native";
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        if (opts.shareTab && !opts.shareTab.closed) opts.shareTab.close();
        return "native";
      }
      /* fall through to intent + OG page URL */
    }
  }

  // Warm public URLs so the first X scrape is more likely to succeed
  await warmPublicUrls(opts.pageUrl, opts.imageUrl);

  // Compose intent: page URL drives summary_large_image card under the tweet
  const intent = buildTweetIntent({
    text,
    url:
      opts.pageUrl && !text.includes(opts.pageUrl) ? opts.pageUrl : undefined,
  });
  if (opts.shareTab && !opts.shareTab.closed) {
    opts.shareTab.location.href = intent;
  } else {
    const link = document.createElement("a");
    link.href = intent;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
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
