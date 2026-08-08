"use client";

import { forwardRef, memo } from "react";
import { PalmSilhouette } from "@/components/shared/Decorations";

interface ProfileFrameProps {
  photoUrl: string;
  size?: number;
  className?: string;
}

/**
 * HH Goa circular profile frame — photo-forward, tropical ring, brand arc.
 * Export 2048×2048 via html-to-image pixelRatio.
 */
export const ProfileFrame = memo(
  forwardRef<HTMLDivElement, ProfileFrameProps>(function ProfileFrame(
    { photoUrl, size = 360, className },
    ref
  ) {
    const ring = size * 0.028;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: size,
          height: size,
          position: "relative",
          background: "transparent",
        }}
        data-export-root="frame"
      >
        {/* Soft yellow glow */}
        <div
          style={{
            position: "absolute",
            inset: size * 0.02,
            borderRadius: "50%",
            boxShadow: "0 0 32px 10px #fee10166, 0 0 64px 20px #fee10133",
          }}
        />

        {/* Pink offset ring (festival print) */}
        <div
          style={{
            position: "absolute",
            inset: size * 0.015,
            borderRadius: "50%",
            border: `${ring * 0.7}px solid #ff0080`,
            transform: "translate(3px, 3px)",
            opacity: 0.85,
          }}
        />

        {/* Main striped ring: yellow / green / cream */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "conic-gradient(from 200deg, #fee101 0deg, #fee101 50deg, #0b6839 50deg, #0b6839 110deg, #fee101 110deg, #fee101 160deg, #ff0080 160deg, #ff0080 190deg, #fee101 190deg, #fee101 250deg, #0b6839 250deg, #0b6839 310deg, #fee101 310deg)",
            padding: ring,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#fffbe8",
              padding: ring * 0.55,
              border: `${ring * 0.35}px solid #000`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                border: `${ring * 0.45}px solid #0b6839`,
                background: "#0b6839",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="HH Goa profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 18%",
                  display: "block",
                }}
                draggable={false}
              />

              {/* Brand arc */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "26%",
                  background:
                    "linear-gradient(to top, rgba(11,104,57,0.97) 10%, rgba(11,104,57,0.78) 55%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: "9%",
                  gap: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: size * 0.02 }}>
                  <span style={{ width: size * 0.05, height: size * 0.075, display: "inline-block" }}>
                    <PalmSilhouette color="#fee101" className="h-full w-full" />
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-imbue), Imbue, serif",
                      fontWeight: 800,
                      fontSize: size * 0.078,
                      lineHeight: 1,
                      color: "#fee101",
                      letterSpacing: "0.06em",
                    }}
                  >
                    HH GOA
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-victor-mono), monospace",
                    fontSize: size * 0.03,
                    color: "#fffbe8",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                  }}
                >
                  2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tiny pink + yellow dots on ring */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            width: size * 0.035,
            height: size * 0.035,
            marginLeft: -(size * 0.0175),
            borderRadius: "50%",
            background: "#fee101",
            border: "1.5px solid #000",
            boxShadow: "0 0 8px #fee101",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            right: "7%",
            width: size * 0.028,
            height: size * 0.028,
            borderRadius: "50%",
            background: "#ff0080",
            border: "1px solid #000",
          }}
        />
      </div>
    );
  })
);
