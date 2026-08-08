"use client";

import { toPng } from "html-to-image";

/** High-DPI PNG export from an HTML template node. */
export async function exportNodeToPng(
  node: HTMLElement,
  options?: { pixelRatio?: number; cacheBust?: boolean }
): Promise<string> {
  const pixelRatio = options?.pixelRatio ?? 2;

  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );

  await toPng(node, {
    cacheBust: options?.cacheBust ?? true,
    pixelRatio: 1,
    quality: 1,
  });

  return toPng(node, {
    cacheBust: options?.cacheBust ?? true,
    pixelRatio,
    quality: 1,
    style: {
      transform: "none",
    },
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
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
  return `https://twitter.com/intent/tweet?${params.toString()}`;
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
