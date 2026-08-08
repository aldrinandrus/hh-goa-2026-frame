"use client";

import { motion } from "framer-motion";
import { BUILDER_TITLES } from "@/lib/design-tokens";

const PALETTE = [
  { bg: "#fee101", fg: "#000", shadow: "#0b6839" },
  { bg: "#0b6839", fg: "#fee101", shadow: "#ff0080" },
  { bg: "#ffcaca", fg: "#000", shadow: "#0b6839" },
  { bg: "#fffbe8", fg: "#0b6839", shadow: "#fee101" },
  { bg: "#ff0080", fg: "#fffbe8", shadow: "#000" },
  { bg: "#fee101", fg: "#000", shadow: "#ff0080" },
  { bg: "#0b6839", fg: "#fffbe8", shadow: "#fee101" },
  { bg: "#fffbe8", fg: "#000", shadow: "#0b6839" },
] as const;

const ROTATIONS = [-6, 4, -3, 7, -8, 5, -2, 6];

export function BuilderTypesSection() {
  return (
    <section className="relative overflow-hidden border-t-2 border-black bg-[#fffbe8] px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0b6839]">
          Builder Classes
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-imbue)] text-[clamp(2.6rem,8vw,5rem)] font-extrabold leading-[0.9] tracking-tight text-black">
          Pick your
          <br />
          <span className="bg-[#fee101] px-1">chaos class.</span>
        </h2>
        <p className="mt-4 max-w-md font-mono text-sm text-black/60">
          Your passport rolls a title at random — festival stickers for people
          who ship.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {BUILDER_TITLES.slice(0, 8).map((title, i) => {
            const p = PALETTE[i % PALETTE.length]!;
            const rot = ROTATIONS[i % ROTATIONS.length]!;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16, rotate: rot }}
                whileInView={{ opacity: 1, y: 0, rotate: rot }}
                viewport={{ once: true }}
                whileHover={{ y: -6, rotate: rot * 0.4, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="border-2 border-black px-4 py-3 font-[family-name:var(--font-imbue)] text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
                style={{
                  background: p.bg,
                  color: p.fg,
                  boxShadow: `4px 4px 0 ${p.shadow}`,
                }}
              >
                {title}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
