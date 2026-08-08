import { NextResponse } from "next/server";
import { getCard } from "@/server/store-card";

export const runtime = "nodejs";

/** Serve the stored PNG for OG / direct linking. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const card = await getCard(id);
  if (!card?.imageDataUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (card.imageDataUrl.startsWith("http")) {
    return NextResponse.redirect(card.imageDataUrl);
  }

  const match = /^data:(image\/\w+);base64,(.+)$/.exec(card.imageDataUrl);
  if (!match) {
    return NextResponse.json({ error: "Invalid image" }, { status: 500 });
  }

  const contentType = match[1]!;
  const buffer = Buffer.from(match[2]!, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
