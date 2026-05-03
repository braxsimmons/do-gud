import type { MetadataRoute } from "next";

const BASE =
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "https://do-gud.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/terms", "/privacy"],
        disallow: ["/admin", "/admin/*", "/api/*", "/me", "/welcome", "/verify"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
