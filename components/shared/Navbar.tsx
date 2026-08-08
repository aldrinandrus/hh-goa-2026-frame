"use client";

import Link from "next/link";
import { memo } from "react";

export const Navbar = memo(function Navbar() {
  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-5 sm:px-8">
      <Link href="/" className="group flex items-baseline gap-2" aria-label="HH Goa home">
        <span
          className="font-[family-name:var(--font-imbue)] text-4xl font-extrabold leading-none tracking-tight text-[#0b6839] sm:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          HH
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-black/70 group-hover:text-[#0b6839]">
          Goa 2026
        </span>
      </Link>
      <a
        href="https://hhgoa.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs font-semibold uppercase tracking-wider text-black/60 underline-offset-4 hover:text-black hover:underline"
      >
        hhgoa.com
      </a>
    </header>
  );
});
