import type { Metadata } from "next";
import { Imbue, Victor_Mono } from "next/font/google";
import "./globals.css";

const imbue = Imbue({
  variable: "--font-imbue",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://hh-goa-2026-frame-five.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HH Goa 2026 · Frame & Builder ID",
    template: "%s · HH Goa 2026",
  },
  description:
    "Create your official HH Goa 2026 Builder Frame or Builder ID in seconds. Download & share with #FrameInGoa.",
  keywords: [
    "HH Goa",
    "Hacker House Goa",
    "FrameInGoa",
    "Builder ID",
    "2026",
  ],
  openGraph: {
    title: "HH Goa 2026 · Frame & Builder ID",
    description:
      "Create your official HH Goa 2026 Builder Frame or Builder ID in seconds.",
    type: "website",
    siteName: "HH Goa 2026",
    images: [{ url: "/brand/Sun rise.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 · Frame & Builder ID",
    description: "Create your official HH Goa Builder Frame or ID · #FrameInGoa",
  },
  icons: {
    icon: "/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#fffbe8" }}>
      <body
        className={`${imbue.variable} ${victorMono.variable} min-h-dvh bg-[#fffbe8] font-mono text-black antialiased`}
        style={{ backgroundColor: "#fffbe8" }}
      >
        {children}
      </body>
    </html>
  );
}
