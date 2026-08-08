"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCards } from "@/components/landing/PreviewCards";
import { FloatingBackground } from "@/components/landing/FloatingBackground";
import { Navbar } from "@/components/shared/Navbar";
import {
  PalmSilhouette,
  SunRays,
  WaveLine,
} from "@/components/shared/Decorations";
import { EVENT_META } from "@/lib/design-tokens";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#fffbe8]">
      <FloatingBackground />
      <Navbar />

      <div
        className="pointer-events-none absolute left-3 top-24 z-20 hidden rotate-[-12deg] hh-fade-in sm:block md:left-8"
        aria-hidden
      >
        <div className="border-2 border-black bg-[#fee101] px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest shadow-[3px_3px_#ff0080]">
          #FrameInGoa
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-4 top-28 z-20 hidden rotate-[8deg] hh-fade-in sm:block md:right-10"
        aria-hidden
      >
        <div className="rounded-full border-2 border-[#0b6839] bg-[#fffbe8] px-3 py-3 text-center font-mono text-[9px] font-bold leading-tight text-[#0b6839] shadow-[3px_3px_#fee101]">
          BUILD
          <br />
          SHIP
          <br />
          REPEAT
        </div>
      </div>

      <PalmSilhouette className="pointer-events-none absolute -left-4 bottom-24 h-40 w-16 opacity-20 sm:h-56 sm:w-24" />
      <PalmSilhouette className="pointer-events-none absolute -right-2 bottom-32 h-32 w-12 opacity-15 sm:h-48 sm:w-20" />

      <div
        className="pointer-events-none absolute right-[8%] top-[18%] w-28 opacity-40 hh-float-y sm:w-40"
        aria-hidden
      >
        <SunRays />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-24 pt-6 text-center sm:pt-12">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0b6839] sm:text-[11px]">
          <span>{EVENT_META.place}</span>
          <span className="hidden text-black/25 sm:inline" aria-hidden>
            /
          </span>
          <span>{EVENT_META.dates}</span>
          <span className="hidden text-black/25 sm:inline" aria-hidden>
            /
          </span>
          <span className="text-black/50">{EVENT_META.site}</span>
        </div>

        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
          Official · Builder Passport + Frame
        </p>

        <h1 className="max-w-4xl font-[family-name:var(--font-imbue)] text-[clamp(3.2rem,12vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight text-black">
          Become Part of{" "}
          <span className="relative inline-block text-[#0b6839]">
            HH Goa
            <motion.span
              className="absolute -inset-x-2 -bottom-1 -top-1 -z-10 rounded-sm bg-[#fee101]/70 motion-reduce:hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
            />
            <span className="absolute -inset-x-2 -bottom-1 -top-1 -z-10 hidden rounded-sm bg-[#fee101]/70 motion-reduce:block" />
          </span>{" "}
          2026
        </h1>

        <div className="mt-4 w-40 opacity-50 sm:w-56" aria-hidden>
          <WaveLine className="h-4 w-full" />
        </div>

        <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-black/70 sm:text-base">
          Create your official HH Goa Builder Frame or Builder Passport in
          seconds.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="xl"
            className="min-w-[200px] shadow-[0_0_18px_4px_#fee1014d,4px_4px_#000]"
          >
            <Link href="/create">
              Create Mine
              <ArrowRight className="ml-1" aria-hidden />
            </Link>
          </Button>
          <a
            href="#experience"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-black/50 underline-offset-4 hover:text-[#0b6839] hover:underline"
          >
            How it works
          </a>
        </div>

        <PreviewCards />

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
          No login · Upload → Generate → Download · #FrameInGoa
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fee101]" />
      <div className="absolute bottom-2 left-0 right-0 h-1 bg-[#0b6839]" />
    </section>
  );
}
