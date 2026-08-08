import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCard } from "@/server/store-card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { FloatingBackground } from "@/components/landing/FloatingBackground";
import { EVENT_META } from "@/lib/design-tokens";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) {
    return { title: "Builder Passport Not Found" };
  }

  const title = `${card.name} · ${card.builderTitle} · HH Goa 2026`;
  const description = `${card.name} — ${card.role} · Builder No. ${card.id} · ${EVENT_META.place}`;
  // Absolute URLs so X can unfurl the passport image under the tweet
  const site = (
    process.env.NEXT_PUBLIC_APP_URL ?? "https://hhgoa-frame.vercel.app"
  ).replace(/\/$/, "");
  const imageUrl = card.imageDataUrl.startsWith("http")
    ? card.imageDataUrl
    : `${site}/api/cards/${card.id}/image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${site}/builder/${card.id}`,
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 2000,
          alt: `${card.name} HH Goa Builder Passport`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BuilderPage({ params }: PageProps) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  const imageSrc = card.imageDataUrl.startsWith("http")
    ? card.imageDataUrl
    : `/api/cards/${card.id}/image`;

  return (
    <div className="relative min-h-[100dvh] bg-[#fffbe8]">
      <FloatingBackground />
      <Navbar />
      <main className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-6">
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0b6839]">
          {EVENT_META.place} · {EVENT_META.dates}
        </p>
        <h1 className="text-center font-[family-name:var(--font-imbue)] text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
          {card.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-[#ff0080]">
          {card.builderTitle}
        </p>
        <p className="mt-1 font-mono text-xs text-black/50">
          Builder No. {card.id}
        </p>

        <div className="mt-8 w-full max-w-md border-2 border-black bg-white/40 p-3 shadow-[6px_6px_#ff0080] backdrop-blur-[12px] sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`${card.name} HH Goa 2026 ${card.format === "frame" ? "Frame" : "Builder Passport"}`}
            className="mx-auto w-full"
          />
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex-1 min-h-14">
            <a href={imageSrc} download={`HH-Goa-${card.id}.png`}>
              Download PNG
            </a>
          </Button>
          <Button asChild size="lg" variant="green" className="flex-1 min-h-14">
            <Link href="/create">Create Mine</Link>
          </Button>
        </div>

        <p className="mt-8 text-center font-mono text-xs text-black/45">
          Hacker House Goa ·{" "}
          <a
            href="https://hhgoa.com"
            className="underline underline-offset-2 hover:text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            hhgoa.com
          </a>
        </p>
      </main>
    </div>
  );
}
