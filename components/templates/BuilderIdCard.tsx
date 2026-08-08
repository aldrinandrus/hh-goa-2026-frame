"use client";

import { memo, forwardRef } from "react";
import {
  PassportStamp,
  TicketPerforation,
  WaveLine,
  PalmSilhouette,
  SunRays,
} from "@/components/shared/Decorations";
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
  /** Absolute URL for QR — defaults to public builder page */
  qrUrl?: string;
}

/**
 * HH Goa 2026 Builder Passport — festival travel document.
 * Canvas 4:5. Export at pixelRatio 2 → 1600×2000 from width 800.
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
    const height = Math.round(width * 1.25); // 4:5
    const s = width / 360;
    const publicUrl = qrUrl || builderPublicUrl(builderId);
    const displayName = (name || "YOUR NAME").toUpperCase();
    const handle = twitter ? `@${twitter.replace(/^@/, "")}` : null;

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
          // Pink offset shadow + yellow hard edge — print festival feel
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

        {/* Cream paper body */}
        <div
          style={{
            position: "absolute",
            inset: 5 * s,
            background: "#fffbe8",
            border: `${1.5 * s}px solid #000`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Paper grain */}
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

          {/* Subtle sun watermark */}
          <div
            style={{
              position: "absolute",
              top: -8 * s,
              right: -10 * s,
              width: 110 * s,
              opacity: 0.18,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <SunRays />
          </div>

          {/* HEADER */}
          <header
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: `${10 * s}px ${12 * s}px ${6 * s}px`,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 800,
                  fontSize: 42 * s,
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
                  fontSize: 9 * s,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "#000",
                  marginTop: 2 * s,
                }}
              >
                GOA 2026
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 8 * s,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#0b6839",
                }}
              >
                {EVENT_META.site}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 7 * s,
                  letterSpacing: "0.08em",
                  color: "#00000099",
                  marginTop: 4 * s,
                  lineHeight: 1.35,
                }}
              >
                {EVENT_META.place}
                <br />
                {EVENT_META.dates}
              </div>
              <div
                style={{
                  marginTop: 6 * s,
                  display: "inline-block",
                  background: "#fee101",
                  border: `${1.5 * s}px solid #000`,
                  padding: `${2 * s}px ${6 * s}px`,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 7 * s,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  boxShadow: `${2 * s}px ${2 * s}px 0 #ff0080`,
                }}
              >
                OFFICIAL BUILDER
              </div>
            </div>
          </header>

          <div style={{ padding: `0 ${12 * s}px` }}>
            <TicketPerforation className="w-full h-2" />
          </div>

          {/* PHOTO — passport treatment (sized to leave room for identity + X) */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              padding: `${6 * s}px ${16 * s}px ${2 * s}px`,
              flexShrink: 0,
            }}
          >
            {/* Pink offset behind photo */}
            <div
              style={{
                position: "absolute",
                width: width * 0.44,
                height: width * 0.5,
                background: "#ff0080",
                borderRadius: `${18 * s}px ${6 * s}px ${22 * s}px ${8 * s}px`,
                transform: `translate(${4 * s}px, ${4 * s}px)`,
                zIndex: 0,
              }}
            />
            {/* Yellow border plate */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: width * 0.44,
                height: width * 0.5,
                background: "#fee101",
                border: `${2 * s}px solid #000`,
                borderRadius: `${18 * s}px ${6 * s}px ${22 * s}px ${8 * s}px`,
                padding: 4 * s,
                boxShadow: `${3 * s}px ${3 * s}px 0 #0b6839`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: `${14 * s}px ${4 * s}px ${18 * s}px ${6 * s}px`,
                  border: `${1.5 * s}px solid #0b6839`,
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

            {/* Floating stamps */}
            <div
              style={{
                position: "absolute",
                left: 8 * s,
                bottom: -2 * s,
                zIndex: 3,
              }}
            >
              <PassportStamp
                label="HH GOA"
                sublabel="2026"
                rotate={-18}
                variant="green"
                size={48 * s}
              />
            </div>
            <div
              style={{
                position: "absolute",
                right: 6 * s,
                top: 2 * s,
                zIndex: 3,
              }}
            >
              <PassportStamp
                label="VERIFIED"
                sublabel="BUILDER"
                rotate={14}
                variant="pink"
                size={44 * s}
              />
            </div>
          </div>

          {/* IDENTITY */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: `${8 * s}px ${14 * s}px 0`,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 800,
                fontSize: Math.min(
                  32 * s,
                  (width * 0.88) / Math.max(displayName.length * 0.42, 8)
                ),
                lineHeight: 0.95,
                color: "#000",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontFamily: "var(--font-victor-mono), monospace",
                fontSize: 10 * s,
                fontWeight: 600,
                color: "#0b6839",
                letterSpacing: "0.12em",
                marginTop: 5 * s,
                textTransform: "uppercase",
              }}
            >
              {role || "ROLE / STACK"}
            </div>
            {/* Title + X handle on one centered, vertically aligned row */}
            <div
              style={{
                marginTop: 8 * s,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: `${6 * s}px ${10 * s}px`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-imbue), Imbue, serif",
                  fontWeight: 700,
                  fontSize: 16 * s,
                  lineHeight: 1,
                  color: "#ff0080",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  borderBottom: `${2 * s}px solid #fee101`,
                  paddingBottom: 2 * s,
                }}
              >
                {builderTitle}
              </div>
              {handle ? (
                <div
                  style={{
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
                    padding: `${5 * s}px ${9 * s}px`,
                    borderRadius: 2 * s,
                    border: `${1.5 * s}px solid #0b6839`,
                    boxShadow: `${2 * s}px ${2 * s}px 0 #ff0080`,
                    flexShrink: 0,
                  }}
                >
                  <span aria-hidden style={{ color: "#fffbe8", lineHeight: 1 }}>
                    𝕏
                  </span>
                  {handle}
                </div>
              ) : null}
            </div>
          </div>

          {/* Mid decorative wave */}
          <div
            style={{
              padding: `${6 * s}px ${20 * s}px 0`,
              opacity: 0.35,
              zIndex: 2,
              position: "relative",
            }}
          >
            <WaveLine className="w-full h-3" />
          </div>

          {/* FOOTER: ID + stamps + QR — padded so QR never clips the frame */}
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              zIndex: 2,
              padding: `${6 * s}px ${14 * s}px ${8 * s}px`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 10 * s,
              boxSizing: "border-box",
              width: "100%",
              overflow: "visible",
            }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: 4 * s }}>
              <div
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 7 * s,
                  letterSpacing: "0.2em",
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
                  fontSize: 15 * s,
                  color: "#0b6839",
                  letterSpacing: "0.04em",
                }}
              >
                {builderId}
              </div>
              <div
                style={{
                  marginTop: 4 * s,
                  display: "flex",
                  gap: 4 * s,
                  alignItems: "center",
                }}
              >
                <PassportStamp
                  label="GOA"
                  sublabel="28 OCT"
                  rotate={-8}
                  variant="yellow"
                  size={32 * s}
                />
                <PassportStamp
                  label="BUILD"
                  sublabel="SHIP"
                  rotate={6}
                  variant="red"
                  size={30 * s}
                />
              </div>
              <div
                style={{
                  marginTop: 5 * s,
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 6 * s,
                  letterSpacing: "0.08em",
                  color: "#00000055",
                }}
              >
                15.2993° N · 74.1240° E · #FrameInGoa
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2 * s,
                flexShrink: 0,
                paddingBottom: 2 * s,
              }}
            >
              <FunctionalQr url={publicUrl} size={Math.round(58 * s)} />
              <span
                style={{
                  fontFamily: "var(--font-victor-mono), monospace",
                  fontSize: 5.5 * s,
                  letterSpacing: "0.1em",
                  color: "#00000066",
                  textTransform: "uppercase",
                }}
              >
                Scan pass
              </span>
            </div>
          </div>

          {/* Bottom ribbon */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              background: "#0b6839",
              borderTop: `${2 * s}px solid #fee101`,
              padding: `${5 * s}px ${10 * s}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-imbue), Imbue, serif",
                fontWeight: 800,
                fontSize: 13 * s,
                color: "#fee101",
                letterSpacing: "0.14em",
              }}
            >
              HACKER HOUSE GOA
            </span>
            <PalmSilhouette
              className="h-5 w-3"
              color="#fee101"
            />
          </div>
        </div>
      </div>
    );
  })
);

/** Alias matching brief naming */
export const BuilderPassport = BuilderIdCard;
