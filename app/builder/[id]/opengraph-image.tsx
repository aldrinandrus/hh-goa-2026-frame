import { ImageResponse } from "next/og";
import { getCard } from "@/server/store-card";

export const runtime = "nodejs";
export const alt = "HH Goa 2026 Builder Passport";
export const size = { width: 1600, height: 1792 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

/** OG image = generated passport when available. */
export default async function Image({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  if (card?.imageDataUrl?.startsWith("http")) {
    const res = await fetch(card.imageDataUrl);
    if (res.ok) {
      return new Response(await res.arrayBuffer(), {
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
      return new Response(Buffer.from(match[2]!, "base64"), {
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
          background: "#fffbe8",
          border: "16px solid #0b6839",
          padding: 64,
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 120, fontWeight: 800, color: "#0b6839", lineHeight: 0.85 }}>
              HH
            </div>
            <div style={{ fontSize: 28, letterSpacing: 8, color: "#000", marginTop: 8 }}>
              GOA 2026
            </div>
          </div>
          <div
            style={{
              background: "#fee101",
              border: "3px solid #000",
              padding: "12px 20px",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "6px 6px 0 #ff0080",
            }}
          >
            OFFICIAL BUILDER
          </div>
        </div>

        <div style={{ marginTop: 80, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#000", lineHeight: 1, textTransform: "uppercase" }}>
            {name}
          </div>
          <div style={{ fontSize: 36, color: "#0b6839", marginTop: 24, letterSpacing: 4 }}>
            {role}
          </div>
          <div style={{ fontSize: 48, color: "#ff0080", marginTop: 32, fontWeight: 700 }}>
            {title}
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 6, color: "#00000066" }}>BUILDER NO.</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#0b6839" }}>{builderId}</div>
          </div>
          <div style={{ fontSize: 24, color: "#00000088" }}>GOA, INDIA · 28–31 OCT 2026</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
