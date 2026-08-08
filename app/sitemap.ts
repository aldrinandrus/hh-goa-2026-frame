import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://hhgoa-frame.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/create`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
