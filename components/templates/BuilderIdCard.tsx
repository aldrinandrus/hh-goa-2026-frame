"use client";

import { memo, forwardRef } from "react";
import { FunctionalQr } from "@/components/shared/FunctionalQr";
import { builderPublicUrl } from "@/lib/site";
import { EVENT_META } from "@/lib/design-tokens";

export interface BuilderPassportProps {
  photoUrl: string;
  name: string;
  role: string;
  twitter?: string;
  builderTitle: string;
  builderId: string;
  width?: number;
  className?: string;
  qrUrl?: string;
}

/* ─── Tiny SVG icons (no emoji) ─── */
function IconCoconut({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden>
      <ellipse cx="8" cy="9" rx="5" ry="4.5" fill="#0b6839" />
      <ellipse cx="8" cy="8.5" rx="3.5" ry="3" fill="#0b6839" opacity="0.7" />
      <circle cx="6.5" cy="8" r="0.7" fill="#fffbe8" />
      <circle cx="9.5" cy="8" r="0.7" fill="#fffbe8" />
      <circle cx="8" cy="10" r="0.7" fill="#fffbe8" />
      <path d="M8 2 v4" stroke="#0b6839" strokeWidth="1.2" />
      <path d="M8 3 q-3 -2 -4 1" stroke="#0b6839" strokeWidth="1" fill="none" />
      <path d="M8 3 q3 -2 4 1" stroke="#0b6839" strokeWidth="1" fill="none" />
    </svg>
  );
}
function IconCode({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden>
      <rect x="1" y="2" width="14" height="12" rx="1" fill="#fee101" stroke="#0b6839" strokeWidth="1.2" />
      <path d="M5 6 L3 8 L5 10" stroke="#0b6839" strokeWidth="1.3" fill="none" />
      <path d="M11 6 L13 8 L11 10" stroke="#0b6839" strokeWidth="1.3" fill="none" />
      <path d="M9 5 L7 11" stroke="#ff0080" strokeWidth="1.2" />
    </svg>
  );
}
function IconBeats({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 9 a5 5 0 0 1 10 0 v3 a1.5 1.5 0 0 1 -3 0 v-2 h-4 v2 a1.5 1.5 0 0 1 -3 0 z"
        fill="#0b6839"
      />
      <rect x="2" y="9" width="2.5" height="4" rx="1" fill="#ff0080" />
      <rect x="11.5" y="9" width="2.5" height="4" rx="1" fill="#ff0080" />
    </svg>
  );
}

const BEACH_BAG = [
  { Icon: IconCoconut, label: "COCONUT" },
  { Icon: IconCode, label: "VS CODE" },
  { Icon: IconBeats, label: "LO-FI BEATS" },
] as const;

function MiniBarcode({ id, w, h }: { id: string; w: number; h: number }) {
  const bars: number[] = [];
  for (let i = 0; i < id.length; i++) {
    bars.push(1 + (id.charCodeAt(i) % 3));
    bars.push(1);
  }
  const total = bars.reduce((a, b) => a + b, 0) || 1;
  const unit = w / total;
  let x = 0;
  return (
    <svg width={w} height={h} aria-hidden>
      {bars.map((bw, i) => {
        const bx = x;
        x += bw * unit;
        if (i % 2 === 1) return null;
        return (
          <rect
            key={i}
            x={bx}
            y={0}
            width={Math.max(bw * unit * 0.85, 1)}
            height={h}
            fill="#0b6839"
          />
        );
      })}
    </svg>
  );
}

function StampCircle({
  size,
  rotate,
  label,
  sub,
  stroke,
  opacity = 0.92,
}: {
  size: number;
  rotate: number;
  label: string;
  sub?: string;
  stroke: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${stroke}`,
        background: `${stroke}14`,
        transform: `rotate(${rotate}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity,
        boxShadow: `inset 0 0 0 1px ${stroke}55`,
      }}
    >
      <div
        style={{
          width: "84%",
          height: "84%",
          borderRadius: "50%",
          border: `1px dashed ${stroke}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-imbue), Imbue, serif",
            fontWeight: 800,
            fontSize: size * 0.14,
            lineHeight: 1.05,
            color: stroke,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {sub ? (
          <span
            style={{
              fontFamily: "var(--font-victor-mono), monospace",
              fontSize: size * 0.095,
              color: stroke,
              letterSpacing: "0.05em",
              marginTop: 1,
            }}
          >
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Perforated postage stamp with original palm+sun art */
function PostageStamp({ size }: { size: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size * 1.15,
        position: "relative",
        background: "#0b6839",
        boxShadow: "2px 2px 0 #00000033",
        // perforated edge feel via outline + dashed inner
        outline: `1.5px dashed #fffbe8`,
        outlineOffset: -3,
        border: `2px solid #0b6839`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: "rotate(-3deg)",
      }}
    >
      <svg width={size * 0.72} height={size * 0.55} viewBox="0 0 40 28" aria-hidden>
        <circle cx="30" cy="8" r="5" fill="#fee101" />
        {[0, 60, 120, 180, 240, 300].map((d) => {
          const a = (d * Math.PI) / 180;
          return (
            <line
              key={d}
              x1={30 + Math.cos(a) * 6}
              y1={8 + Math.sin(a) * 6}
              x2={30 + Math.cos(a) * 9}
              y2={8 + Math.sin(a) * 9}
              stroke="#fee101"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          );
        })}
        <path d="M10 26 V14" stroke="#fee101" strokeWidth="1.5" />
        <ellipse cx="10" cy="10" rx="8" ry="3" fill="#fee101" transform="rotate(-30 10 10)" />
        <ellipse cx="10" cy="9" rx="7" ry="2.5" fill="#fee101" transform="rotate(25 10 9)" />
        <ellipse cx="10" cy="8" rx="6" ry="2.2" fill="#fee101" transform="rotate(70 10 8)" />
        <path d="M0 24 Q10 20 20 24 T40 24" stroke="#fffbe8" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-victor-mono), monospace",
          fontSize: size * 0.11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#fffbe8",
          marginTop: 2,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        GOA
        <br />
        INDIA
      </span>
    </div>
  );
}

/** Signpost + surfboards — left hero illustration (reference-inspired, original) */
function SignpostArt({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 56 110" aria-hidden>
      <rect x="25" y="28" width="4" height="72" fill="#0b6839" />
      {/* BUILD */}
      <g transform="rotate(-6 28 38)">
        <polygon points="8,30 48,30 48,42 8,42 4,36" fill="#fee101" stroke="#000" strokeWidth="1.2" />
        <text x="26" y="39" textAnchor="middle" fill="#000" style={{ fontFamily: "monospace", fontSize: 7, fontWeight: 700 }}>
          BUILD
        </text>
      </g>
      {/* SHIP */}
      <g transform="rotate(4 28 54)">
        <polygon points="10,48 50,48 50,60 10,60 6,54" fill="#ff0080" stroke="#000" strokeWidth="1.2" />
        <text x="28" y="57" textAnchor="middle" fill="#fffbe8" style={{ fontFamily: "monospace", fontSize: 7, fontWeight: 700 }}>
          SHIP
        </text>
      </g>
      {/* REPEAT */}
      <g transform="rotate(-3 28 70)">
        <polygon points="8,64 48,64 48,76 8,76 4,70" fill="#0b6839" stroke="#000" strokeWidth="1.2" />
        <text x="26" y="73" textAnchor="middle" fill="#fee101" style={{ fontFamily: "monospace", fontSize: 6.5, fontWeight: 700 }}>
          REPEAT
        </text>
      </g>
      {/* Surfboards */}
      <ellipse cx="14" cy="92" rx="5" ry="16" fill="#fee101" stroke="#000" strokeWidth="1" transform="rotate(-12 14 92)" />
      <line x1="14" y1="78" x2="14" y2="104" stroke="#0b6839" strokeWidth="0.8" transform="rotate(-12 14 92)" />
      <ellipse cx="40" cy="94" rx="5" ry="15" fill="#ff0080" stroke="#000" strokeWidth="1" transform="rotate(14 40 94)" />
      <line x1="40" y1="81" x2="40" y2="105" stroke="#fffbe8" strokeWidth="0.8" transform="rotate(14 40 94)" />
      {/* foliage */}
      <ellipse cx="8" cy="100" rx="7" ry="3" fill="#0b6839" opacity="0.35" />
      <ellipse cx="48" cy="102" rx="6" ry="2.5" fill="#0b6839" opacity="0.3" />
    </svg>
  );
}

/** Goan house + scooter — right hero illustration */
function GoanHouseArt({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 64 90" aria-hidden>
      {/* Speech bubble */}
      <path
        d="M8 8 h40 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-22 l-6 7 v-7 h-12 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6 z"
        fill="#fee101"
        stroke="#000"
        strokeWidth="1.3"
      />
      <text x="28" y="20" textAnchor="middle" fill="#000" style={{ fontFamily: "monospace", fontSize: 5.5, fontWeight: 700 }}>
        {"LET'S"}
      </text>
      <text x="28" y="28" textAnchor="middle" fill="#000" style={{ fontFamily: "monospace", fontSize: 5.5, fontWeight: 700 }}>
        BUILD!
      </text>
      {/* House */}
      <rect x="10" y="48" width="36" height="24" fill="#ff0080" stroke="#000" strokeWidth="1.2" />
      <polygon points="8,48 28,34 48,48" fill="#e40014" stroke="#000" strokeWidth="1.2" />
      <rect x="14" y="52" width="8" height="10" fill="#0b6839" opacity="0.85" />
      <rect x="28" y="54" width="7" height="9" fill="#fee101" stroke="#000" strokeWidth="0.7" />
      <rect x="38" y="52" width="5" height="7" fill="#fffbe8" opacity="0.8" />
      {/* Veranda line */}
      <line x1="10" y1="48" x2="46" y2="48" stroke="#000" strokeWidth="1" />
      {/* Scooter */}
      <circle cx="48" cy="78" r="5" fill="#ff0080" stroke="#000" strokeWidth="1" />
      <rect x="44" y="70" width="16" height="7" rx="2" fill="#fee101" stroke="#000" strokeWidth="0.9" />
      <circle cx="48" cy="80" r="2.5" fill="#000" />
      <circle cx="58" cy="80" r="2.5" fill="#000" />
      <path d="M44 70 L40 64 L46 64" stroke="#0b6839" strokeWidth="1.2" fill="none" />
      {/* Tiny palm */}
      <path d="M6 78 V66" stroke="#0b6839" strokeWidth="1.3" />
      <ellipse cx="6" cy="62" rx="6" ry="2.2" fill="#0b6839" transform="rotate(-30 6 62)" />
      <ellipse cx="6" cy="61" rx="5" ry="2" fill="#0b6839" transform="rotate(35 6 61)" />
    </svg>
  );
}

/** Richer Goa landscape band */
function GoaSceneBand({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 340 64" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fee101" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fffbe8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="340" height="64" fill="url(#sky)" />
      <circle cx="290" cy="16" r="11" fill="#fee101" opacity="0.9" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((d) => {
        const a = (d * Math.PI) / 180;
        return (
          <line
            key={d}
            x1={290 + Math.cos(a) * 13}
            y1={16 + Math.sin(a) * 13}
            x2={290 + Math.cos(a) * 18}
            y2={16 + Math.sin(a) * 18}
            stroke="#fee101"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
      {/* birds */}
      <path d="M60 14 q3 -3 6 0" stroke="#0b6839" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M72 18 q2.5 -2.5 5 0" stroke="#0b6839" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M250 12 q3 -3 6 0" stroke="#0b6839" strokeWidth="1" fill="none" opacity="0.35" />
      {/* water */}
      <rect x="0" y="46" width="340" height="18" fill="#0b683918" />
      <path d="M0 48 Q30 42 60 48 T120 48 T180 48 T240 48 T300 48 T340 48" stroke="#0b6839" strokeWidth="1.3" fill="none" opacity="0.45" />
      <path d="M0 54 Q30 50 60 54 T120 54 T180 54 T240 54 T300 54 T340 54" stroke="#0b6839" strokeWidth="1" fill="none" opacity="0.28" />
      {/* palm L */}
      <path d="M32 52 V28" stroke="#0b6839" strokeWidth="2" />
      <ellipse cx="32" cy="20" rx="14" ry="5" fill="#0b6839" transform="rotate(-32 32 20)" />
      <ellipse cx="32" cy="19" rx="12" ry="4.5" fill="#0b6839" transform="rotate(28 32 19)" />
      <ellipse cx="32" cy="18" rx="11" ry="4" fill="#0b6839" transform="rotate(72 32 18)" />
      <ellipse cx="32" cy="21" rx="10" ry="3.5" fill="#0b6839" transform="rotate(-72 32 21)" />
      {/* shack */}
      <rect x="78" y="34" width="32" height="16" fill="#ff0080" stroke="#000" strokeWidth="1" />
      <polygon points="78,34 94,22 110,34" fill="#fee101" stroke="#000" strokeWidth="1" />
      <rect x="88" y="40" width="7" height="10" fill="#fffbe8" />
      <rect x="98" y="38" width="6" height="5" fill="#0b6839" opacity="0.35" />
      {/* surfboard */}
      <ellipse cx="140" cy="44" rx="5" ry="14" fill="#ff0080" stroke="#000" strokeWidth="1" transform="rotate(-20 140 44)" />
      <line x1="140" y1="32" x2="140" y2="54" stroke="#fffbe8" strokeWidth="1" transform="rotate(-20 140 44)" />
      {/* scooter */}
      <circle cx="178" cy="42" r="5" fill="#0b6839" />
      <rect x="174" y="42" width="20" height="8" rx="2" fill="#fee101" stroke="#000" strokeWidth="0.9" />
      <circle cx="178" cy="50" r="2.8" fill="#000" />
      <circle cx="192" cy="50" r="2.8" fill="#000" />
      <path d="M174 42 L170 34 L176 34" stroke="#0b6839" strokeWidth="1.2" fill="none" />
      {/* umbrella */}
      <path d="M220 48 L220 34" stroke="#0b6839" strokeWidth="1.2" />
      <path d="M208 34 Q220 24 232 34 Z" fill="#ff0080" stroke="#000" strokeWidth="0.8" />
      <path d="M208 34 Q220 30 232 34" fill="#fee101" opacity="0.7" />
      {/* coconut */}
      <ellipse cx="248" cy="48" rx="5" ry="4" fill="#0b6839" />
      <circle cx="246.5" cy="47" r="0.6" fill="#fffbe8" />
      <circle cx="249.5" cy="47" r="0.6" fill="#fffbe8" />
      {/* palm R */}
      <path d="M310 52 V30" stroke="#0b6839" strokeWidth="2" />
      <ellipse cx="310" cy="22" rx="12" ry="4.5" fill="#0b6839" transform="rotate(30 310 22)" />
      <ellipse cx="310" cy="21" rx="11" ry="4" fill="#0b6839" transform="rotate(-40 310 21)" />
      <ellipse cx="310" cy="20" rx="10" ry="3.5" fill="#0b6839" transform="rotate(80 310 20)" />
      {/* boat */}
      <path d="M50 56 Q58 50 66 56 Z" fill="#0b6839" opacity="0.5" />
      <line x1="58" y1="56" x2="58" y2="48" stroke="#0b6839" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/**
 * HH Goa 2026 Builder Passport — dense festival travel artifact (4:5).
 */
export const BuilderIdCard = memo(
  forwardRef<HTMLDivElement, BuilderPassportProps>(function BuilderIdCard(
    {
      photoUrl,
      name,
      role,
      twitter,
      builderTitle,
      builderId,
      width = 360,
      className,
      qrUrl,
    },
    ref
  ) {
    const height = Math.round(width * 1.25);
    const s = width / 360;
    const displayName = (name || "YOUR NAME").toUpperCase();
    const displayRole = (role || "BUILDER").toUpperCase();
    const handleRaw = (twitter || "").trim().replace(/^@/, "");
    const handle = handleRaw ? `@${handleRaw}` : null;
    const publicUrl = qrUrl || builderPublicUrl(builderId);
    const idDisplay = builderId.startsWith("#") ? builderId : `#${builderId}`;
    const photo = width * 0.318;

    const paperNoise =
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
    const microPattern =
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ctext x='3' y='12' font-size='5.5' fill='%230b6839' font-family='monospace'%3EHH%3C/text%3E%3Ccircle cx='32' cy='9' r='1' fill='%230b6839'/%3E%3Cpath d='M5 28 q7 -4 14 0' stroke='%230b6839' stroke-width='0.9' fill='none'/%3E%3Ctext x='28' y='34' font-size='7' fill='%230b6839'%3E*%3C/text%3E%3C/svg%3E\")";

    return (
      <div
        ref={ref}
        className={className}
        data-export-root="card"
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3 * s,
          boxShadow: `${5 * s}px ${5 * s}px 0 #ff0080`,
        }}
      >
        {/* Layered border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0b6839",
            borderRadius: 3 * s,
            border: `${2 * s}px solid #000`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 2.5 * s,
            background: "#fee101",
            borderRadius: 2 * s,
          }}
        />
        {/* Tiny border tick marks */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 2.5 * s,
            borderRadius: 2 * s,
            zIndex: 1,
            pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent ${7 * s}px, #0b683933 ${7 * s}px, #0b683933 ${8 * s}px)`,
            backgroundSize: "100% 2px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "0 0",
            opacity: 0.5,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 5 * s,
            background: "#fffbe8",
            borderRadius: 1.5 * s,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: `${1.25 * s}px solid #0b6839`,
            boxSizing: "border-box",
          }}
        >
          {/* Pink corner accents */}
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: 14 * s, height: 3 * s, background: "#ff0080", zIndex: 8 }} />
          <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 14 * s, height: 3 * s, background: "#ff0080", zIndex: 8 }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, width: 14 * s, height: 3 * s, background: "#ff0080", zIndex: 8 }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: 14 * s, height: 3 * s, background: "#ff0080", zIndex: 8 }} />

          {/* Atmosphere layers */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.055,
                mixBlendMode: "multiply",
                backgroundImage: paperNoise,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.07,
                backgroundImage: microPattern,
                backgroundSize: `${44 * s}px ${44 * s}px`,
              }}
            />
            {/* Soft sun wash */}
            <div
              style={{
                position: "absolute",
                top: -20 * s,
                right: 20 * s,
                width: 90 * s,
                height: 90 * s,
                borderRadius: "50%",
                background: "radial-gradient(circle, #fee10133 0%, transparent 70%)",
              }}
            />
            {/* Edge palms */}
            <svg
              width={42 * s}
              height={64 * s}
              viewBox="0 0 40 60"
              style={{ position: "absolute", left: -6 * s, top: 95 * s, opacity: 0.14 }}
            >
              <path d="M20 58 V26" stroke="#0b6839" strokeWidth="2.2" />
              <ellipse cx="20" cy="18" rx="16" ry="5.5" fill="#0b6839" transform="rotate(-35 20 18)" />
              <ellipse cx="20" cy="16" rx="14" ry="5" fill="#0b6839" transform="rotate(28 20 16)" />
              <ellipse cx="20" cy="15" rx="12" ry="4.5" fill="#0b6839" transform="rotate(72 20 15)" />
              <ellipse cx="20" cy="19" rx="11" ry="4" fill="#0b6839" transform="rotate(-75 20 19)" />
            </svg>
            <svg
              width={46 * s}
              height={68 * s}
              viewBox="0 0 40 60"
              style={{
                position: "absolute",
                right: -8 * s,
                top: 88 * s,
                opacity: 0.12,
                transform: "scaleX(-1)",
              }}
            >
              <path d="M20 58 V26" stroke="#0b6839" strokeWidth="2.2" />
              <ellipse cx="20" cy="18" rx="16" ry="5.5" fill="#0b6839" transform="rotate(-35 20 18)" />
              <ellipse cx="20" cy="16" rx="14" ry="5" fill="#0b6839" transform="rotate(28 20 16)" />
              <ellipse cx="20" cy="15" rx="12" ry="4.5" fill="#0b6839" transform="rotate(72 20 15)" />
            </svg>
            {/* Scattered sparkles / marks */}
            {(
              [
                [48, 72, 0.2],
                [62, 280, 0.18],
                [130, 40, 0.16],
                [150, 300, 0.2],
                [200, 60, 0.15],
                [220, 270, 0.18],
              ] as const
            ).map(([top, left, op], i) => (
              <svg
                key={i}
                width={8 * s}
                height={8 * s}
                viewBox="0 0 10 10"
                style={{
                  position: "absolute",
                  top: top * s * 0.45,
                  left: (left / 360) * width,
                  opacity: op,
                }}
              >
                <path d="M5 0 L5.8 4.2 L10 5 L5.8 5.8 L5 10 L4.2 5.8 L0 5 L4.2 4.2 Z" fill="#0b6839" />
              </svg>
            ))}
            {/* Hand-drawn style waves mid */}
            <svg
              width={80 * s}
              height={14 * s}
              viewBox="0 0 80 14"
              style={{
                position: "absolute",
                top: 168 * s,
                left: 20 * s,
                opacity: 0.18,
              }}
            >
              <path d="M0 8 Q10 2 20 8 T40 8 T60 8 T80 8" stroke="#0b6839" strokeWidth="1.2" fill="none" />
            </svg>
            {/* Bird flocks */}
            {(
              [
                [38, 90],
                [42, 102],
                [36, 114],
                [70, 240],
                [74, 252],
                [68, 262],
              ] as const
            ).map(([t, l], i) => (
              <svg
                key={`b${i}`}
                width={10 * s}
                height={6 * s}
                viewBox="0 0 12 6"
                style={{
                  position: "absolute",
                  top: t * s,
                  left: (l / 360) * width,
                  opacity: 0.28,
                }}
              >
                <path d="M0 4 Q3 0 6 4 Q9 0 12 4" stroke="#0b6839" strokeWidth="1" fill="none" />
              </svg>
            ))}
            {/* Soft bottom wave wash (festival postcard depth) */}
            <svg
              width="100%"
              height={36 * s}
              viewBox="0 0 360 36"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                left: 0,
                bottom: 42 * s,
                opacity: 0.14,
              }}
            >
              <path d="M0 22 Q40 10 80 22 T160 22 T240 22 T320 22 T360 22 V36 H0 Z" fill="#0b6839" />
              <path d="M0 26 Q40 16 80 26 T160 26 T240 26 T320 26 T360 26" stroke="#fee101" strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
            {/* Leaf clusters near mid sides */}
            <svg
              width={28 * s}
              height={36 * s}
              viewBox="0 0 28 36"
              style={{ position: "absolute", left: 8 * s, top: 195 * s, opacity: 0.16 }}
            >
              <ellipse cx="10" cy="18" rx="9" ry="3.5" fill="#0b6839" transform="rotate(-40 10 18)" />
              <ellipse cx="16" cy="14" rx="8" ry="3" fill="#0b6839" transform="rotate(25 16 14)" />
              <ellipse cx="14" cy="22" rx="7" ry="2.5" fill="#ff0080" opacity="0.5" transform="rotate(10 14 22)" />
            </svg>
            <svg
              width={28 * s}
              height={36 * s}
              viewBox="0 0 28 36"
              style={{
                position: "absolute",
                right: 8 * s,
                top: 200 * s,
                opacity: 0.14,
                transform: "scaleX(-1)",
              }}
            >
              <ellipse cx="10" cy="18" rx="9" ry="3.5" fill="#0b6839" transform="rotate(-40 10 18)" />
              <ellipse cx="16" cy="14" rx="8" ry="3" fill="#0b6839" transform="rotate(25 16 14)" />
            </svg>
            {/* Vertical micro labels */}
            <span
              style={{
                position: "absolute",
                left: 3 * s,
                top: 120 * s,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 5.5 * s,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#ff0080",
                opacity: 0.35,
              }}
            >
              {EVENT_META.dates}
            </span>
            <span
              style={{
                position: "absolute",
                right: 3 * s,
                top: 120 * s,
                writingMode: "vertical-rl",
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 5.5 * s,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#0b6839",
                opacity: 0.35,
              }}
            >
              {EVENT_META.place} ✦
            </span>
          </div>

          {/* ===== HEADER ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "grid",
              gridTemplateColumns: `${52 * s}px 1fr ${52 * s}px`,
              alignItems: "flex-start",
              gap: 2 * s,
              padding: `${5 * s}px ${7 * s}px 0`,
              flexShrink: 0,
            }}
          >
            <PostageStamp size={46 * s} />

            <div style={{ textAlign: "center", paddingTop: 2 * s }}>
              {/* Hanging ribbon */}
              <div
                style={{
                  display: "inline-block",
                  marginTop: -5 * s,
                  background: "#ff0080",
                  border: `${1.25 * s}px solid #000`,
                  borderTop: "none",
                  padding: `${7 * s}px ${8 * s}px ${8 * s}px`,
                  clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)",
                  boxShadow: `${1.5 * s}px ${1.5 * s}px 0 #00000022`,
                }}
              >
                <svg width={12 * s} height={12 * s} viewBox="0 0 16 16" style={{ margin: "0 auto", display: "block" }}>
                  <circle cx="8" cy="4" r="2" fill="#fee101" />
                  <path d="M8 6 v8" stroke="#fee101" strokeWidth="1.5" />
                  <ellipse cx="8" cy="5" rx="5" ry="2" fill="#fee101" transform="rotate(-25 8 5)" />
                  <ellipse cx="8" cy="5" rx="5" ry="2" fill="#fee101" transform="rotate(25 8 5)" />
                </svg>
                <div
                  style={{
                    fontFamily: "var(--font-victor-mono), monospace",
                    fontSize: 6 * s,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#fffbe8",
                    marginTop: 2 * s,
                    lineHeight: 1.15,
                  }}
                >
                  HH GOA
                  <br />
                  2026
                </div>
              </div>
              <div
                style={{
                  marginTop: 4 * s,
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 20 * s,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "#0b6839",
                }}
              >
                HACKER{" "}
                <span style={{ color: "#ff0080" }}>गोवा</span>{" "}
                HOUSE
              </div>
              <div
                style={{
                  marginTop: 2 * s,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5.5 * s,
                  letterSpacing: "0.16em",
                  color: "#0b6839",
                  fontWeight: 700,
                  opacity: 0.7,
                }}
              >
                {EVENT_META.site} · BUILDER PASS
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 * s }}>
              <StampCircle
                size={48 * s}
                rotate={10}
                label="BUILD IN GOA"
                sub="SHIP FROM PARADISE"
                stroke="#000"
                opacity={0.88}
              />
            </div>
          </div>

          {/* ===== HERO ROW ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "grid",
              gridTemplateColumns: `${58 * s}px 1fr ${58 * s}px`,
              alignItems: "center",
              gap: 1 * s,
              padding: `${2 * s}px ${5 * s}px 0`,
              flexShrink: 0,
            }}
          >
            {/* Left — stamp + signpost illustration */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1 * s,
              }}
            >
              <StampCircle size={30 * s} rotate={-16} label="GOA" sub="INDIA" stroke="#0b6839" />
              <SignpostArt w={52 * s} h={96 * s} />
            </div>

            {/* Photo — multi-ring premium treatment */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Pink offset ring */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  width: photo + 10 * s,
                  height: photo + 10 * s,
                  borderRadius: "50%",
                  background: "#ff0080",
                  transform: `translate(${3.5 * s}px, ${3.5 * s}px)`,
                }}
              />
              {/* Green outer */}
              <div
                style={{
                  position: "relative",
                  width: photo + 6 * s,
                  height: photo + 6 * s,
                  borderRadius: "50%",
                  background: "#0b6839",
                  border: `${1.5 * s}px solid #000`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `${2 * s}px ${2 * s}px 0 #00000022`,
                }}
              >
                {/* Yellow ring */}
                <div
                  style={{
                    width: photo + 2 * s,
                    height: photo + 2 * s,
                    borderRadius: "50%",
                    background: "#fee101",
                    border: `${1.25 * s}px solid #000`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2 * s,
                  }}
                >
                  {/* Cream + green inner */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `${2 * s}px solid #0b6839`,
                      outline: `${1.25 * s}px solid #fffbe8`,
                      outlineOffset: -1,
                      background: "#0b6839",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={name || "Builder"}
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 18%",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Circumference sparkles */}
              {(
                [
                  [-4, 50, 0],
                  [8, 88, 15],
                  [78, 92, -10],
                  [92, 48, 5],
                ] as const
              ).map(([t, l, r], i) => (
                <svg
                  key={i}
                  width={7 * s}
                  height={7 * s}
                  viewBox="0 0 10 10"
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: `${t}%`,
                    left: `${l}%`,
                    transform: `rotate(${r}deg)`,
                    opacity: 0.7,
                  }}
                >
                  <path d="M5 0 L5.7 4.3 L10 5 L5.7 5.7 L5 10 L4.3 5.7 L0 5 L4.3 4.3 Z" fill="#fee101" stroke="#000" strokeWidth="0.4" />
                </svg>
              ))}
            </div>

            {/* Right — official stamp + Goan house scene */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2 * s,
              }}
            >
              <div
                style={{
                  background: "#fee101",
                  border: `${1.25 * s}px solid #000`,
                  padding: `${1.5 * s}px ${3 * s}px`,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 4.5 * s,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  boxShadow: `${1.5 * s}px ${1.5 * s}px 0 #ff0080`,
                  textAlign: "center",
                  transform: "rotate(3deg)",
                  lineHeight: 1.15,
                }}
              >
                OFFICIAL
                <br />
                BUILDER
              </div>
              <StampCircle size={28 * s} rotate={12} label="VERIFIED" sub="BUILDER" stroke="#ff0080" />
              <GoanHouseArt w={56 * s} h={78 * s} />
              <StampCircle size={24 * s} rotate={-10} label="28–31" sub="OCT 26" stroke="#0b6839" />
            </div>
          </div>

          {/* ===== NAME BADGE STACK (compact — X sits beside title) ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5 * s,
              padding: `${2 * s}px ${10 * s}px 0`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 4.5 * s,
                letterSpacing: "0.18em",
                color: "#0b6839",
                opacity: 0.4,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              BUILDER PASS · HHG26 · GOA, INDIA
            </div>
            {/* Layered name plate */}
            <div style={{ position: "relative", maxWidth: "96%" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#ff0080",
                  transform: `translate(${2 * s}px, ${2 * s}px)`,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#fee101",
                  transform: `translate(${1 * s}px, ${1 * s}px)`,
                }}
              />
              <div
                style={{
                  position: "relative",
                  background: "#0b6839",
                  color: "#fee101",
                  border: `${1.5 * s}px solid #000`,
                  padding: `${3 * s}px ${12 * s}px`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-imbue), Imbue, serif",
                    fontWeight: 800,
                    fontSize: Math.min(
                      16 * s,
                      (width * 0.7) / Math.max(displayName.length * 0.42, 8)
                    ),
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  ★ {displayName} ★
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fee101",
                color: "#e40014",
                border: `${1.25 * s}px solid #000`,
                boxShadow: `${1.5 * s}px ${1.5 * s}px 0 #0b6839`,
                padding: `${2 * s}px ${9 * s}px`,
                fontFamily: "var(--font-victor-mono), monospace",
                fontWeight: 700,
                fontSize: 7.5 * s,
                letterSpacing: "0.1em",
                maxWidth: "92%",
                textAlign: "center",
                transform: "rotate(-0.6deg)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4 * s,
                lineHeight: 1,
              }}
            >
              <svg width={7 * s} height={9 * s} viewBox="0 0 8 10" aria-hidden>
                <path d="M4 0 L0 5.5 H3.5 L2.5 10 L8 4 H4.5 Z" fill="#e40014" />
              </svg>
              {displayRole}
              <svg width={7 * s} height={9 * s} viewBox="0 0 8 10" aria-hidden>
                <path d="M4 0 L0 5.5 H3.5 L2.5 10 L8 4 H4.5 Z" fill="#e40014" />
              </svg>
            </div>
            {/* Title + X on one compact row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: `${2 * s}px ${6 * s}px`,
                maxWidth: "96%",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 11 * s,
                  color: "#ff0080",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderBottom: `${1.75 * s}px solid #fee101`,
                  paddingBottom: 1 * s,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {builderTitle}
              </div>
              {handle ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3 * s,
                    background: "#000",
                    color: "#fee101",
                    fontFamily: "var(--font-victor-mono), monospace",
                    fontSize: 7.5 * s,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    padding: `${2.5 * s}px ${7 * s}px`,
                    border: `${1 * s}px solid #fee101`,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#fffbe8" }}>𝕏</span>
                  {handle}
                </div>
              ) : null}
            </div>
          </div>

          {/* ===== GOA SCENE ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              margin: `${2 * s}px ${7 * s}px 0`,
              border: `${1.25 * s}px dashed #0b683955`,
              background: "#fffbe8",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <GoaSceneBand w={width - 30 * s} h={46 * s} />
          </div>

          {/* Micro meta */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `${1.5 * s}px ${9 * s}px 0`,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 4.5 * s,
                letterSpacing: "0.14em",
                color: "#0b6839",
                opacity: 0.5,
                fontWeight: 700,
              }}
            >
              BUILD · SHIP · REPEAT
            </span>
            <StampCircle
              size={18 * s}
              rotate={-8}
              label="HH"
              sub="GOA"
              stroke="#ff0080"
              opacity={0.7}
            />
            <span
              style={{
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 4.5 * s,
                letterSpacing: "0.12em",
                color: "#ff0080",
                opacity: 0.55,
                fontWeight: 700,
              }}
            >
              FRAME IN GOA
            </span>
          </div>

          {/* ===== INFO GRID ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              marginTop: 2 * s,
              marginLeft: 6 * s,
              marginRight: 6 * s,
              borderTop: `${1.25 * s}px solid #0b683955`,
              paddingTop: 3 * s,
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr 1fr",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: `0 ${3 * s}px`,
                borderRight: `${1 * s}px dashed #0b683944`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 0,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 28 * s,
                  left: -2 * s,
                  opacity: 0.2,
                  pointerEvents: "none",
                }}
              >
                <StampCircle size={28 * s} rotate={-20} label="SCAN" stroke="#0b6839" />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5 * s,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "#e40014",
                  textAlign: "center",
                }}
              >
                ✦ BUILDER CLASS ✦
              </div>
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 10 * s,
                  color: "#ff0080",
                  textAlign: "center",
                  lineHeight: 1.05,
                  marginTop: 2 * s,
                  textTransform: "uppercase",
                }}
              >
                {builderTitle}
              </div>
              <div
                style={{
                  marginTop: 3 * s,
                  border: `${1.5 * s}px solid #0b6839`,
                  padding: 2 * s,
                  background: "#fffbe8",
                  boxShadow: `${1.5 * s}px ${1.5 * s}px 0 #fee101`,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <FunctionalQr
                  url={publicUrl}
                  size={Math.round(42 * s)}
                  dark="#0b6839"
                  light="#fffbe8"
                />
              </div>
              <div
                style={{
                  marginTop: 2 * s,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 4.5 * s,
                  letterSpacing: "0.1em",
                  color: "#0b6839",
                  opacity: 0.55,
                  fontWeight: 700,
                }}
              >
                SCAN TO MEET
              </div>
            </div>

            <div
              style={{
                padding: `0 ${3 * s}px`,
                borderRight: `${1 * s}px dashed #0b683944`,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5 * s,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "#e40014",
                  textAlign: "center",
                }}
              >
                ✦ BEACH BAG ✦
              </div>
              <div
                style={{
                  marginTop: 4 * s,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3.5 * s,
                }}
              >
                {BEACH_BAG.map(({ Icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4 * s,
                      fontFamily: "var(--font-victor-mono), monospace",
                      fontSize: 6 * s,
                      fontWeight: 700,
                      color: "#0b6839",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span
                      style={{
                        width: 15 * s,
                        height: 15 * s,
                        border: `${1 * s}px solid #0b6839`,
                        background: "#fee10144",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon s={11 * s} />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: `0 ${3 * s}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5 * s,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#e40014",
                  textAlign: "center",
                }}
              >
                ✦ SHIPPING ✦
              </div>
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 9 * s,
                  color: "#ff0080",
                  textAlign: "center",
                  lineHeight: 1.1,
                  marginTop: 2 * s,
                  textTransform: "uppercase",
                }}
              >
                Building the Future
              </div>
              <div
                style={{
                  marginTop: 3 * s,
                  background: "#fee101",
                  border: `${1 * s}px solid #000`,
                  padding: `${1 * s}px ${4 * s}px`,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 4.5 * s,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                OFFICIAL
              </div>
              <div
                style={{
                  marginTop: 3 * s,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5 * s,
                  letterSpacing: "0.12em",
                  color: "#00000066",
                  textAlign: "center",
                }}
              >
                BUILDER ID
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontWeight: 700,
                  fontSize: 7 * s,
                  color: "#0b6839",
                  textAlign: "center",
                  marginTop: 1 * s,
                  wordBreak: "break-all",
                  lineHeight: 1.15,
                }}
              >
                {idDisplay}
              </div>
              <div style={{ marginTop: 2.5 * s }}>
                <MiniBarcode id={builderId} w={56 * s} h={11 * s} />
              </div>
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              marginTop: 3 * s,
              background: "#ff0080",
              borderTop: `${1.5 * s}px solid #000`,
              padding: `${5 * s}px ${8 * s}px ${4 * s}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              gap: 1 * s,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 2 * s,
                background: "#fee101",
              }}
            />
            <svg
              aria-hidden
              width="100%"
              height={12 * s}
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.3 }}
            >
              <path
                d="M0 8 Q25 2 50 8 T100 8 T150 8 T200 8"
                stroke="#fee101"
                strokeWidth="1.5"
                fill="none"
              />
              <path d="M12 12 V6" stroke="#fee101" strokeWidth="1" opacity="0.6" />
              <ellipse cx="12" cy="4" rx="4" ry="1.5" fill="#fee101" opacity="0.5" />
              <path d="M188 12 V6" stroke="#fee101" strokeWidth="1" opacity="0.6" />
              <ellipse cx="188" cy="4" rx="4" ry="1.5" fill="#fee101" opacity="0.5" />
            </svg>
            <span
              style={{
                position: "relative",
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 800,
                fontSize: 12 * s,
                color: "#fee101",
                letterSpacing: "0.14em",
              }}
            >
              ★ #FRAMEINGOA ★
            </span>
            <span
              style={{
                position: "relative",
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 4.5 * s,
                letterSpacing: "0.16em",
                color: "#fffbe8",
                opacity: 0.7,
                fontWeight: 700,
              }}
            >
              HACKER HOUSE GOA · 2026
            </span>
          </div>
        </div>
      </div>
    );
  })
);

export const BuilderPassport = BuilderIdCard;
