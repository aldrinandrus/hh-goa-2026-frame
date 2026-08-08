"use client";

import { memo } from "react";
import { PalmSilhouette, SunRays } from "@/components/shared/Decorations";

/**
 * Stable decorative background — CSS transforms only.
 * Reduced motion is handled in globals.css (@media prefers-reduced-motion).
 */
export const FloatingBackground = memo(function FloatingBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ contain: "strict" }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, #fee1014d, transparent), radial-gradient(ellipse 60% 40% at 100% 50%, #0b683933, transparent), radial-gradient(ellipse 50% 30% at 0% 80%, #ff00801a, transparent)",
        }}
      />
      <div
        className="hh-float-a absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#fee101]/30 blur-3xl"
        style={{ transform: "translate3d(0,0,0)" }}
      />
      <div
        className="hh-float-b absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#0b6839]/25 blur-3xl"
        style={{ transform: "translate3d(0,0,0)" }}
      />
      <div
        className="hh-float-c absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#ff0080]/10 blur-3xl"
        style={{ transform: "translate3d(0,0,0)" }}
      />

      {/* Rising sun — top right */}
      <div className="hh-float-y absolute -right-6 top-8 w-36 opacity-50 sm:top-12 sm:w-48 sm:opacity-60">
        <SunRays className="w-full" color="#fee101" />
      </div>
      {/* Soft second sun wash — top center */}
      <div className="absolute left-1/2 top-0 w-28 -translate-x-1/2 opacity-25 sm:w-40">
        <SunRays className="w-full" color="#fee101" />
      </div>

      {/* Coconut palms */}
      <PalmSilhouette
        className="hh-float-y absolute -bottom-4 -left-2 h-44 w-28 opacity-[0.18] sm:h-56 sm:w-36 sm:opacity-[0.22]"
        color="#0b6839"
      />
      <PalmSilhouette
        className="absolute -bottom-8 left-10 h-36 w-24 -scale-x-100 opacity-[0.12] sm:left-16 sm:h-44 sm:w-28"
        color="#0b6839"
      />
      <PalmSilhouette
        className="hh-float-y absolute -bottom-6 -right-3 h-48 w-32 -scale-x-100 opacity-[0.16] sm:h-60 sm:w-40 sm:opacity-[0.2]"
        color="#0b6839"
      />
      <PalmSilhouette
        className="absolute bottom-0 right-14 h-32 w-20 opacity-[0.1] sm:right-24 sm:h-40 sm:w-24"
        color="#ff0080"
      />

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
});
