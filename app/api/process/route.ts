import { NextResponse } from "next/server";
import { processUploadBuffer } from "@/server/process-image";

export const runtime = "nodejs";

/** Optional server-side normalize via sharp (EXIF rotate + resize). */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Max 20 MB" }, { status: 413 });
    }

    const input = Buffer.from(await file.arrayBuffer());
    const { buffer, width, height } = await processUploadBuffer(input);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "X-Image-Width": String(width),
        "X-Image-Height": String(height),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
