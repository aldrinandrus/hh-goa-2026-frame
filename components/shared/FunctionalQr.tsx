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

  return (
    <div
      style={{
        width: size,
        height: size,
        background: light,
        border: `1.5px solid ${dark}`,
        flexShrink: 0,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`QR code linking to ${url}`}
          width={size}
          height={size}
          decoding="async"
          style={{
            width: size,
            height: size,
            display: "block",
            imageRendering: "pixelated",
          }}
        />
      ) : null}
    </div>
  );
});
