import type { MetadataRoute } from "next";
import { getPlan } from "@/lib/plans";

export default function sitemap(): MetadataRoute.Sitemap {
  const plan = getPlan();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://lcdr-consagracion-reconstruccion.vercel.app");

  const diaEntries: MetadataRoute.Sitemap = plan.dias.map((dia) => ({
    url: `${siteUrl}/dias/${dia.n}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/dias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...diaEntries,
  ];
}
