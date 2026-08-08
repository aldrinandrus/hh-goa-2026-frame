"use client";

import { memo } from "react";

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
