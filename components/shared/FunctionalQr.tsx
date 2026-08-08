"use client";

import { memo, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface FunctionalQrProps {
  url: string;
  size?: number;
  dark?: string;
  light?: string;
}

/** Real scannable QR — keeps previous bitmap while regenerating (no flash). */
export const FunctionalQr = memo(function FunctionalQr({
  url,
  size = 88,
  dark = "#0b6839",
  light = "#fffbe8",
}: FunctionalQrProps) {
  const [src, setSrc] = useState<string | null>(null);
  const lastUrl = useRef(url);

  useEffect(() => {
    let cancelled = false;
    lastUrl.current = url;
    QRCode.toDataURL(url, {
      width: Math.max(128, size * 2),
      margin: 1,
      color: { dark, light },
      errorCorrectionLevel: "M",
    }).then((data) => {
      if (!cancelled && lastUrl.current === url) setSrc(data);
    });
    return () => {
      cancelled = true;
    };
  }, [url, size, dark, light]);

  // Border sits inside the box so the QR never grows past `size` and clips.
  const border = Math.max(1, Math.round(size * 0.03));

  return (
    <div
      style={{
        width: size,
        height: size,
        boxSizing: "border-box",
        background: light,
        border: `${border}px solid ${dark}`,
        flexShrink: 0,
        overflow: "hidden",
        padding: Math.max(2, Math.round(size * 0.04)),
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`QR code linking to ${url}`}
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "contain",
            imageRendering: "pixelated",
          }}
        />
      ) : null}
    </div>
  );
});
