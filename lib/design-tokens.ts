/**
 * HH Goa 2026 design tokens — extracted from https://hhgoa.com
 * Do not invent alternate colors or typography.
 */
export const hh = {
  colors: {
    cream: "#fffbe8",
    creamMuted: "#fffbe8cc",
    yellow: "#fee101",
    yellowSoft: "#fee10133",
    yellowGlow: "#fee1014d",
    yellowDim: "#fee1011a",
    green: "#0b6839",
    greenSoft: "#0b68390d",
    greenMid: "#0b683933",
    red: "#e40014",
    redDeep: "#bf000f",
    magenta: "#ff0080",
    blush: "#ffcaca",
    black: "#000000",
    white: "#ffffff",
  },
  shadows: {
    hardYellow: "4px 4px #fee101",
    glow: "0 0 18px 4px #fee1014d, 0 0 40px 8px #fee1011a",
    softGlow: "0 0 30px 15px #fee10100",
  },
  gradients: {
    greenYellow: "linear-gradient(135deg, #0b6839, #fee101)",
    yellowCream: "linear-gradient(135deg, #fee101, #fffbe8, #fee101)",
  },
  fonts: {
    display: "var(--font-imbue), Imbue, serif",
    mono: "var(--font-victor-mono), 'Victor Mono', monospace",
  },
  blur: "12px",
  radius: "4px",
} as const;

export const BUILDER_TITLES = [
  "Protocol Wizard",
  "Bug Hunter",
  "Chain Architect",
  "Open Source Ninja",
  "Hackathon Beast",
  "AI Whisperer",
  "Design Alchemist",
  "Backend Samurai",
  "Frontend Alchemist",
  "Full Stack Explorer",
] as const;

export const EVENT_META = {
  place: "GOA, INDIA",
  dates: "28–31 OCT 2026",
  site: "HHGOA.COM",
  hashtag: "#FrameInGoa",
} as const;

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const ACCEPTED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const FRAME_EXPORT_SIZE = 2048;
/** Passport canvas: 4:5 portrait — export via pixelRatio 2 → 2000×2500 */
export const CARD_EXPORT_WIDTH = 1000;
export const CARD_EXPORT_HEIGHT = 1250;
