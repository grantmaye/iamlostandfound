import type { MetadataRoute } from "next";
import { wp, Post, Term } from "@/lib/wordpress";
import { staticPages } from "@/components/static-page";
import { localLink } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const first = await wp<Post[]>("posts", {
    per_page: 100,
    _fields: "slug,modified",
  });
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, first.pages - 1) }, (_, i) =>
      wp<Post[]>("posts", {
        per_page: 100,
        page: i + 2,
        _fields: "slug,modified",
      }),
    ),
  );
  const terms = await wp<Term[]>("categories", {
    per_page: 100,
    _fields: "link",
  });
  return [
    { url: origin + "/" },
    ...Object.keys(staticPages).map((slug) => ({ url: `${origin}/${slug}/` })),
    ...first.data.concat(remaining.flatMap((r) => r.data)).map((p) => ({
      url: `${origin}/${p.slug}/`,
      lastModified: new Date(p.modified + "Z"),
    })),
    ...terms.data.map((t) => ({ url: origin + localLink(t.link) })),
  ];
}
