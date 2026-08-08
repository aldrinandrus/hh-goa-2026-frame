"use client";

import { motion } from "framer-motion";
import { EVENT_META } from "@/lib/design-tokens";

const STEPS = [
  {
    n: "01",
    title: "UPLOAD",
    body: "Drop your photo. HEIC, JPG, PNG — we handle the rest.",
  },
  {
    n: "02",
    title: "BUILD",
    body: "Create your Builder Frame or Passport. Instant preview.",
  },
  {
    n: "03",
    title: "SHARE",
    body: "Download PNG and post it to X with #FrameInGoa.",
  },
] as const;

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t-2 border-black bg-[#0b6839] px-4 py-20 text-[#fffbe8] sm:px-8 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#fee101]">
          {EVENT_META.place} · {EVENT_META.dates}
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-[family-name:var(--font-imbue)] text-[clamp(3rem,11vw,7rem)] font-extrabold leading-[0.88] tracking-tight"
        >
          MAKE YOUR MARK
          <br />
          <span className="text-[#fee101]">IN GOA.</span>
        </motion.h2>

        <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-[#fffbe8]/70">
          Three beats. Zero fluff. An official HH Goa asset you can wear on X.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="relative border-t border-[#fee101]/40 pt-6"
            >
              <span className="font-[family-name:var(--font-imbue)] text-7xl font-extrabold leading-none text-[#fee101]/35 sm:text-8xl">
                {step.n}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-imbue)] text-4xl font-bold tracking-tight text-[#fee101] sm:text-5xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs font-mono text-sm leading-relaxed text-[#fffbe8]/75">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
