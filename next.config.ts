import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the bottom-left Next.js "N" badge in development
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "hhgoa.com" },
    ],
  },
  serverExternalPackages: ["sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
