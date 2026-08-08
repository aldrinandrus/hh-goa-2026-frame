import { NextResponse } from "next/server";
import { saveCard } from "@/server/store-card";
import { isValidBuilderId } from "@/lib/builder-id";
import { getServerAppUrl } from "@/lib/site";
import type { FormatMode, StoredCard } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

async function blobToDataUrl(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const mime = blob.type || "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let card: StoredCard;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const id = String(form.get("id") || "");
      if (!isValidBuilderId(id)) {
        return NextResponse.json({ error: "Invalid builder ID" }, { status: 400 });
      }
      const image = form.get("image");
      if (!(image instanceof Blob)) {
        return NextResponse.json({ error: "Missing image" }, { status: 400 });
      }
      if (image.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large" }, { status: 413 });
      }
      const photo = form.get("photo");
      card = {
        id,
        name: String(form.get("name") || "Builder").slice(0, 80),
        role: String(form.get("role") || "HH Goa Builder").slice(0, 80),
        twitter: String(form.get("twitter") || "")
          .replace(/^@/, "")
          .slice(0, 40) || undefined,
        builderTitle: String(form.get("builderTitle") || "Builder").slice(0, 60),
        format: (String(form.get("format")) === "frame" ? "frame" : "card") as FormatMode,
        imageDataUrl: await blobToDataUrl(image),
        photoDataUrl:
          photo instanceof Blob ? await blobToDataUrl(photo) : undefined,
        createdAt: new Date().toISOString(),
      };
    } else {
      const body = (await req.json()) as Partial<StoredCard>;
      if (!body.id || !isValidBuilderId(body.id)) {
        return NextResponse.json({ error: "Invalid builder ID" }, { status: 400 });
      }
      if (!body.imageDataUrl) {
        return NextResponse.json({ error: "Missing image" }, { status: 400 });
      }
      if (body.imageDataUrl.length > 12_000_000) {
        return NextResponse.json({ error: "Image too large" }, { status: 413 });
      }
      card = {
        id: body.id,
        name: (body.name || "Builder").slice(0, 80),
        role: (body.role || "HH Goa Builder").slice(0, 80),
        twitter: body.twitter?.replace(/^@/, "").slice(0, 40),
        builderTitle: (body.builderTitle || "Builder").slice(0, 60),
        format: body.format === "frame" ? "frame" : "card",
        imageDataUrl: body.imageDataUrl,
        photoDataUrl: body.photoDataUrl,
        createdAt: new Date().toISOString(),
      };
    }

    const saved = await saveCard(card);
    const site = getServerAppUrl();
    const pagePath = `/builder/${saved.id}`;
    const imageIsHttp = saved.imageDataUrl.startsWith("http");
    const imageUrl = imageIsHttp
      ? saved.imageDataUrl
      : site
        ? `${site}/api/cards/${saved.id}/image`
        : `/api/cards/${saved.id}/image`;

    return NextResponse.json({
      ok: true,
      id: saved.id,
      url: site ? `${site}${pagePath}` : pagePath,
      imageUrl,
      /** True when PNG is on a public HTTP host (needed for X image cards) */
      publicImage: imageIsHttp,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save card" }, { status: 500 });
  }
}
