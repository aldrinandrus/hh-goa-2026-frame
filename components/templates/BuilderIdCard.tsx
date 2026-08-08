"use client";

import { memo, forwardRef } from "react";
import {
  PassportStamp,
  TicketPerforation,
  WaveLine,
  PalmSilhouette,
  SunRays,
} from "@/components/shared/Decorations";
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
  /** @deprecated QR removed from passport — kept for call-site compat */
  qrUrl?: string;
}

/**
 * HH Goa 2026 Builder Passport — festival travel document.
 * Canvas 4:5. Export at pixelRatio 2 → 1600×2000 from width 800.
 * Layout is deliberately compact so every block stays inside the frame.
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
    },
    ref
  ) {
    const height = Math.round(width * 1.25); // 4:5
    const s = width / 360;
    const displayName = (name || "YOUR NAME").toUpperCase();
    const handleRaw = (twitter || "").trim().replace(/^@/, "");
    const handle = handleRaw ? `@${handleRaw}` : null;
    const photoW = width * 0.34;
    const photoH = width * 0.36;

    const paperNoise =
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

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
          boxShadow: `${6 * s}px ${6 * s}px 0 #ff0080, ${10 * s}px ${10 * s}px 0 #fee10155`,
        }}
      >
        {/* Outer green frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0b6839",
            border: `${2 * s}px solid #000`,
            borderRadius: 2 * s,
          }}
        />

        {/* Cream paper body — clipped to the frame */}
        <div
          style={{
            position: "absolute",
            inset: 5 * s,
            background: "#fffbe8",
            border: `${1.5 * s}px solid #000`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: paperNoise,
              opacity: 0.07,
              pointerEvents: "none",
              mixBlendMode: "multiply",
              zIndex: 5,
            }}
          />

          {/* Soft Goa atmosphere — watermarks only, behind all content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
            aria-hidden
          >
            <div
              style={{
                position: "absolute",
                top: -6 * s,
                right: -8 * s,
                width: 100 * s,
                opacity: 0.2,
              }}
            >
              <SunRays />
            </div>
            <div
              style={{
                position: "absolute",
                top: 38 * s,
                left: -18 * s,
                width: 70 * s,
                opacity: 0.1,
              }}
            >
              <SunRays />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 28 * s,
                left: -6 * s,
                width: 52 * s,
                opacity: 0.12,
              }}
            >
              <PalmSilhouette className="h-full w-full" color="#0b6839" />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 22 * s,
                right: -8 * s,
                width: 58 * s,
                opacity: 0.1,
                transform: "scaleX(-1)",
              }}
            >
              <PalmSilhouette className="h-full w-full" color="#0b6839" />
            </div>
            <div
              style={{
                position: "absolute",
                top: "42%",
                left: "50%",
                width: 120 * s,
                height: 120 * s,
                marginLeft: -60 * s,
                marginTop: -60 * s,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #fee10122 0%, #ff00800a 45%, transparent 70%)",
              }}
            />
          </div>

          {/* HEADER */}
          <header
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: `${7 * s}px ${10 * s}px ${4 * s}px`,
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 34 * s,
                  lineHeight: 0.85,
                  color: "#0b6839",
                  letterSpacing: "-0.03em",
                }}
              >
                HH
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 8 * s,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#000",
                  marginTop: 1 * s,
                }}
              >
                GOA 2026
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 7 * s,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#0b6839",
                }}
              >
                {EVENT_META.site}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 6 * s,
                  letterSpacing: "0.06em",
                  color: "#00000099",
                  marginTop: 2 * s,
                  lineHeight: 1.3,
                }}
              >
                {EVENT_META.place}
                <br />
                {EVENT_META.dates}
              </div>
              <div
                style={{
                  marginTop: 4 * s,
                  display: "inline-block",
                  background: "#fee101",
                  border: `${1.25 * s}px solid #000`,
                  padding: `${1.5 * s}px ${5 * s}px`,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 6 * s,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  boxShadow: `${1.5 * s}px ${1.5 * s}px 0 #ff0080`,
                }}
              >
                OFFICIAL BUILDER
              </div>
            </div>
          </header>

          <div style={{ padding: `0 ${10 * s}px`, flexShrink: 0 }}>
            <TicketPerforation className="w-full h-1.5" />
          </div>

          {/* PHOTO */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              padding: `${4 * s}px ${12 * s}px ${2 * s}px`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: photoW,
                height: photoH,
                background: "#ff0080",
                borderRadius: `${12 * s}px ${5 * s}px ${16 * s}px ${6 * s}px`,
                transform: `translate(${3 * s}px, ${3 * s}px)`,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: photoW,
                height: photoH,
                background: "#fee101",
                border: `${1.75 * s}px solid #000`,
                borderRadius: `${12 * s}px ${5 * s}px ${16 * s}px ${6 * s}px`,
                padding: 3 * s,
                boxShadow: `${2 * s}px ${2 * s}px 0 #0b6839`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: `${9 * s}px ${3 * s}px ${12 * s}px ${4 * s}px`,
                  border: `${1.25 * s}px solid #0b6839`,
                  background: "#0b6839",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={name || "Builder"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                  }}
                  draggable={false}
                />
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 6 * s,
                bottom: 0,
                zIndex: 3,
              }}
            >
              <PassportStamp
                label="HH GOA"
                sublabel="2026"
                rotate={-16}
                variant="green"
                size={36 * s}
              />
            </div>
            <div
              style={{
                position: "absolute",
                right: 4 * s,
                top: 0,
                zIndex: 3,
              }}
            >
              <PassportStamp
                label="VERIFIED"
                sublabel="BUILDER"
                rotate={12}
                variant="pink"
                size={34 * s}
              />
            </div>
          </div>

          {/* IDENTITY */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: `${5 * s}px ${12 * s}px 0`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 800,
                fontSize: Math.min(
                  26 * s,
                  (width * 0.8) / Math.max(displayName.length * 0.42, 8)
                ),
                lineHeight: 0.95,
                color: "#000",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                textAlign: "center",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 8.5 * s,
                fontWeight: 600,
                color: "#0b6839",
                letterSpacing: "0.12em",
                marginTop: 3 * s,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {role || "ROLE / STACK"}
            </div>
            <div
              style={{
                marginTop: 5 * s,
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 700,
                fontSize: 13 * s,
                lineHeight: 1,
                color: "#ff0080",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textAlign: "center",
                borderBottom: `${1.75 * s}px solid #fee101`,
                paddingBottom: 2 * s,
                maxWidth: "92%",
              }}
            >
              {builderTitle}
            </div>
            {handle ? (
              <div
                style={{
                  marginTop: 6 * s,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5 * s,
                  background: "#000",
                  color: "#fee101",
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 10 * s,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  padding: `${4 * s}px ${9 * s}px`,
                  borderRadius: 2 * s,
                  border: `${1.5 * s}px solid #fee101`,
                  boxShadow: `${2 * s}px ${2 * s}px 0 #ff0080`,
                }}
              >
                <span aria-hidden style={{ color: "#fffbe8", lineHeight: 1 }}>
                  𝕏
                </span>
                {handle}
              </div>
            ) : null}
          </div>

          <div
            style={{
              padding: `${4 * s}px ${20 * s}px 0`,
              opacity: 0.35,
              zIndex: 2,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <WaveLine className="w-full h-2" />
          </div>

          {/* Mission chips — compact, no outer shadow that escapes the frame */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              margin: `${5 * s}px ${10 * s}px 0`,
              background: "#fee101",
              border: `${1.25 * s}px solid #000`,
              padding: `${5 * s}px ${6 * s}px`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 4 * s,
              }}
            >
              {(
                [
                  { label: "VALID", tone: "#0b6839" },
                  { label: "BUILD", tone: "#000" },
                  { label: "SHIP", tone: "#e40014" },
                ] as const
              ).map((chip) => (
                <div
                  key={chip.label}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "var(--font-victor-mono), monospace",
                    fontSize: 7 * s,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: chip.tone,
                    background: "#fffbe8",
                    border: `${1 * s}px solid #000`,
                    padding: `${2.5 * s}px 0`,
                  }}
                >
                  {chip.label}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 4 * s,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 6 * s,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 12 * s,
                  letterSpacing: "0.04em",
                  color: "#000",
                  lineHeight: 1,
                }}
              >
                {EVENT_META.hashtag}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 6 * s,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#0b6839",
                  textAlign: "right",
                  lineHeight: 1.2,
                }}
              >
                {EVENT_META.dates}
              </span>
            </div>
          </div>

          {/* Spacer pushes footer to the bottom without overflowing */}
          <div style={{ flex: "1 1 auto", minHeight: 4 * s }} />

          {/* FOOTER */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: `${2 * s}px ${10 * s}px ${5 * s}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8 * s,
              flexShrink: 0,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 6 * s,
                  letterSpacing: "0.18em",
                  color: "#00000066",
                  textTransform: "uppercase",
                }}
              >
                Builder No.
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontWeight: 700,
                  fontSize: 13 * s,
                  color: "#0b6839",
                  letterSpacing: "0.03em",
                  marginTop: 1 * s,
                }}
              >
                {builderId}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * s,
                flexShrink: 0,
              }}
            >
              <PassportStamp
                label="GOA"
                sublabel="28 OCT"
                rotate={-8}
                variant="yellow"
                size={28 * s}
              />
              <PalmSilhouette className="h-7 w-5 opacity-35" color="#0b6839" />
            </div>
          </div>

          {/* Bottom ribbon */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              background: "#0b6839",
              borderTop: `${1.75 * s}px solid #fee101`,
              padding: `${4 * s}px ${8 * s}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 800,
                fontSize: 11 * s,
                color: "#fee101",
                letterSpacing: "0.12em",
              }}
            >
              HACKER HOUSE GOA
            </span>
            <PalmSilhouette className="h-4 w-2.5" color="#fee101" />
          </div>
        </div>
      </div>
    );
  })
);

/** Alias matching brief naming */
export const BuilderPassport = BuilderIdCard;
