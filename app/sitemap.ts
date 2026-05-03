import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE =
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "https://do-gud.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/onboarding`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const prompts = await db.prompt.findMany({
      where: { removed: false },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    return [
      ...staticUrls,
      ...prompts.map((p) => ({
        url: `${BASE}/p/${p.id}`,
        lastModified: p.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticUrls;
  }
}
