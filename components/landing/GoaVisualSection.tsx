"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EVENT_META } from "@/lib/design-tokens";
import { WaveLine, PalmSilhouette, SurfboardIcon } from "@/components/shared/Decorations";

/**
 * Full-bleed Goa atmosphere using approved HH Goa brand assets + SVG accents.
 */
export function GoaVisualSection() {
  return (
    <section className="relative overflow-hidden bg-[#fffbe8]">
      <div className="relative mx-auto grid max-w-7xl items-center gap-0 lg:grid-cols-2">
        <div className="relative order-2 min-h-[320px] sm:min-h-[420px] lg:order-1 lg:min-h-[560px]">
          <Image
            src="/brand/Sun rise.png"
            alt="HH Goa tropical sunrise illustration"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffbe8] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#fffbe8]/80" />
        </div>

        <div className="relative order-1 z-10 px-4 py-16 sm:px-10 sm:py-20 lg:order-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0b6839]">
            {EVENT_META.place}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 font-[family-name:var(--font-imbue)] text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[0.9] tracking-tight text-black"
          >
            Ocean at
            <br />
            the door.
            <br />
            <span className="text-[#0b6839]">Terminals open.</span>
          </motion.h2>

          <div className="mt-4 w-36 opacity-40">
            <WaveLine className="h-4 w-full" />
          </div>

          <p className="mt-5 max-w-sm font-mono text-sm leading-relaxed text-black/65">
            Four days in Goa. Five hundred builders. One rhythm. Your passport
            is how you show up before you land.
          </p>

          <div className="mt-8 flex items-end gap-4">
            <PalmSilhouette className="h-16 w-8 text-[#0b6839]" />
            <SurfboardIcon className="h-16 w-6" />
            <div className="border-2 border-black bg-[#ffcaca] px-3 py-2 font-mono text-[10px] font-bold tracking-wider shadow-[3px_3px_#0b6839]">
              28–31 OCT
              <br />
              2026
            </div>
          </div>
        </div>
      </div>

      {/* Secondary strip with hackers art */}
      <div className="relative h-40 overflow-hidden border-y-2 border-black sm:h-52">
        <Image
          src="/brand/hackers.png"
          alt="HH Goa builders illustration"
          fill
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0b6839]/35 mix-blend-multiply" />
        <p className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-imbue)] text-4xl font-extrabold tracking-tight text-[#fee101] sm:text-6xl">
          LESS NOISE. MORE SIGNAL.
        </p>
      </div>
    </section>
  );
}
