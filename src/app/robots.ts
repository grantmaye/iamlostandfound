import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const production = process.env.ALLOW_INDEXING === "true";
  return {
    rules: {
      userAgent: "*",
      ...(production
        ? { allow: "/", disallow: ["/api/", "/?s="] }
        : { disallow: "/" }),
    },
    ...(production
      ? { sitemap: `${origin.replace(/\/$/, "")}/sitemap.xml` }
      : {}),
  };
}
