import { promises as fs } from "fs";
import path from "path";
import type { StoredCard } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data", "cards");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function cardPath(id: string) {
  return path.join(DATA_DIR, `${id}.json`);
}

export async function saveCard(card: StoredCard): Promise<StoredCard> {
  await ensureDir();

  // Prefer Vercel Blob when configured
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`cards/${card.id}.json`, JSON.stringify(card), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      // Optionally store PNG separately for faster OG
      if (card.imageDataUrl.startsWith("data:")) {
        const base64 = card.imageDataUrl.split(",")[1];
        if (base64) {
          const buffer = Buffer.from(base64, "base64");
          const img = await put(`cards/${card.id}.png`, buffer, {
            access: "public",
            contentType: "image/png",
            addRandomSuffix: false,
            allowOverwrite: true,
          });
          card = { ...card, imageDataUrl: img.url };
        }
      }
      void blob;
      return card;
    } catch (err) {
      console.warn("Blob save failed, falling back to filesystem", err);
    }
  }

  await fs.writeFile(cardPath(card.id), JSON.stringify(card, null, 2), "utf8");
  return card;
}

export async function getCard(id: string): Promise<StoredCard | null> {
  // Try filesystem first (local / persistent disk)
  try {
    const raw = await fs.readFile(cardPath(id), "utf8");
    return JSON.parse(raw) as StoredCard;
  } catch {
    // continue
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const url = `https://blob.vercel-storage.com/cards/${id}.json`;
      // List/fetch via public URL pattern is unreliable; try data dir mirror
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/cards/${id}`,
        { cache: "no-store" }
      ).catch(() => null);
      void url;
      void res;
    } catch {
      // ignore
    }
  }

  return null;
}

export async function listCards(limit = 50): Promise<StoredCard[]> {
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const cards: StoredCard[] = [];
    for (const file of files.filter((f) => f.endsWith(".json")).slice(0, limit)) {
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
      cards.push(JSON.parse(raw) as StoredCard);
    }
    return cards.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  } catch {
    return [];
  }
}
