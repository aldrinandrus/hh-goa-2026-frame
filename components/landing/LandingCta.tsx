"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EVENT_META } from "@/lib/design-tokens";

export function LandingCta() {
  return (
    <section className="relative overflow-hidden border-t-2 border-black bg-[#fee101] px-4 py-20 text-center sm:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-[family-name:var(--font-imbue)] text-[clamp(2.8rem,10vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-black"
      >
        Ready to
        <br />
        frame in Goa?
      </motion.h2>
      <p className="mx-auto mt-4 max-w-md font-mono text-sm text-black/70">
        {EVENT_META.place} · {EVENT_META.dates} · No login required
      </p>
      <div className="mt-8">
        <Button asChild size="xl" variant="green" className="min-w-[220px]">
          <Link href="/create">
            Create Mine
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
        © 2026 HH-Goa ·{" "}
        <a
          href="https://hhgoa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          hhgoa.com
        </a>
      </p>
    </section>
  );
}
