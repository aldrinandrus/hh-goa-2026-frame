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

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Load card JSON from Vercel Blob by pathname prefix. */
async function getCardFromBlob(id: string): Promise<StoredCard | null> {
  if (!hasBlobToken()) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `cards/${id}`, limit: 20 });
    const jsonBlob = blobs.find(
      (b) =>
        b.pathname === `cards/${id}.json` ||
        b.pathname.endsWith(`/${id}.json`)
    );
    if (!jsonBlob) return null;
    const res = await fetch(jsonBlob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as StoredCard;
  } catch (err) {
    console.warn("Blob getCard failed", err);
    return null;
  }
}

export async function saveCard(card: StoredCard): Promise<StoredCard> {
  // Prefer Vercel Blob — required for X OG/image unfurl on serverless
  if (hasBlobToken()) {
    try {
      const { put } = await import("@vercel/blob");

      // Upload PNG first so we can store a public HTTP image URL on the card
      let imageUrl = card.imageDataUrl;
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
          imageUrl = img.url;
        }
      }

      const toStore: StoredCard = { ...card, imageDataUrl: imageUrl };

      await put(`cards/${card.id}.json`, JSON.stringify(toStore), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      return toStore;
    } catch (err) {
      console.warn("Blob save failed, falling back to filesystem", err);
    }
  }

  await ensureDir();
  await fs.writeFile(cardPath(card.id), JSON.stringify(card, null, 2), "utf8");
  return card;
}

export async function getCard(id: string): Promise<StoredCard | null> {
  // Blob first on Vercel (filesystem is ephemeral there)
  const fromBlob = await getCardFromBlob(id);
  if (fromBlob) return fromBlob;

  try {
    const raw = await fs.readFile(cardPath(id), "utf8");
    return JSON.parse(raw) as StoredCard;
  } catch {
    return null;
  }
}

export async function listCards(limit = 50): Promise<StoredCard[]> {
  const cards: StoredCard[] = [];

  if (hasBlobToken()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "cards/", limit: 200 });
      const jsonBlobs = blobs
        .filter((b) => b.pathname.endsWith(".json"))
        .slice(0, limit);
      for (const b of jsonBlobs) {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          if (res.ok) cards.push((await res.json()) as StoredCard);
        } catch {
          /* skip */
        }
      }
      if (cards.length) {
        return cards.sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
      }
    } catch (err) {
      console.warn("Blob listCards failed", err);
    }
  }

  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
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
