import { NextResponse } from "next/server";
import { getCard } from "@/server/store-card";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const card = await getCard(id);
  if (!card) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(card);
}
