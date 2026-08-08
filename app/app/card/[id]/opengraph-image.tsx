import { ImageResponse } from "next/og";
import { getCard } from "@/server/store-card";

export const runtime = "nodejs";
export const alt = "HH Goa 2026 Builder Card";
export const size = { width: 1200, height: 1680 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Open Graph image MUST be the generated card when available.
 * Falls back to a branded summary matching hhgoa.com colors.
 */
export default async function Image({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  // Prefer the exact generated asset for X / OG unfurls
  if (card?.imageDataUrl?.startsWith("http")) {
    const res = await fetch(card.imageDataUrl);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      return new Response(buf, {
        headers: {
          "Content-Type": res.headers.get("Content-Type") ?? "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }

  if (card?.imageDataUrl?.startsWith("data:image")) {
    const match = /^data:(image\/\w+);base64,(.+)$/.exec(card.imageDataUrl);
    if (match) {
      const buffer = Buffer.from(match[2]!, "base64");
      return new Response(buffer, {
        headers: {
          "Content-Type": match[1]!,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }

  const name = card?.name ?? "HH Goa Builder";
  const title = card?.builderTitle ?? "Builder";
  const role = card?.role ?? "Hacker House Goa 2026";
  const builderId = card?.id ?? id;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b6839 0%, #064528 50%, #0a3d28 100%)",
          padding: 56,
          fontFamily: "monospace",
          color: "#fffbe8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, #fee10166, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: "#fee101", lineHeight: 1 }}>
              HH GOA
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase" as const,
                color: "#fffbe8cc",
                marginTop: 8,
              }}
            >
              Builder Pass · 2026
            </div>
          </div>
          <div
            style={{
              background: "#fee101",
              color: "#000",
              fontSize: 20,
              fontWeight: 700,
              padding: "10px 18px",
              border: "2px solid #000",
            }}
          >
            OFFICIAL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            {name}
          </div>
          <div style={{ fontSize: 28, color: "#fee101", marginTop: 16 }}>
            {role}
          </div>
          <div
            style={{
              marginTop: 24,
              alignSelf: "flex-start",
              background: "#fee101",
              color: "#000",
              fontSize: 24,
              fontWeight: 700,
              padding: "10px 20px",
              border: "2px solid #000",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 16, letterSpacing: 4, color: "#fffbe866" }}>
              BUILDER ID
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#fee101" }}>
              {builderId}
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#fffbe8aa" }}>
            28–31 OCT · GOA · #FrameInGoa
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 28,
            background: "#e40014",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 28,
            height: 4,
            background: "#fee101",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
