import { cache } from "react";
export type Term = {
  id: number;
  name: string;
  slug: string;
  link: string;
  taxonomy?: string;
};
export type Post = {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }[];
    "wp:term"?: Term[][];
    author?: { name: string }[];
  };
};
const origin = (
  process.env.WORDPRESS_URL || "https://iamlostandfound.com"
).replace(/\/$/, "");
export const wp = cache(
  async <T>(resource: string, params: Record<string, string | number> = {}) => {
    const url = new URL(`${origin}/wp-json/wp/v2/${resource}`);
    for (const [k, v] of Object.entries(params))
      url.searchParams.set(k, String(v));
    const response = await fetch(url, {
      next: { revalidate: 300, tags: ["wordpress"] },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      if (response.status === 400 && Number(params.page) > 1)
        return { data: [] as T, pages: 0 };
      throw new Error(`WordPress ${resource}: ${response.status}`);
    }
    return {
      data: (await response.json()) as T,
      total: Number(response.headers.get("x-wp-total") || 0),
      pages: Number(response.headers.get("x-wp-totalpages") || 1),
    };
  },
);
export const posts = (params: Record<string, string | number> = {}) =>
  wp<Post[]>("posts", { per_page: 10, _embed: 1, ...params });
export const featured = (p: Post) => p._embedded?.["wp:featuredmedia"]?.[0];
export const categories = (p: Post) =>
  p._embedded?.["wp:term"]?.flat().filter((t) => t.taxonomy === "category") ||
  [];
export const dateLabel = (s: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(s + "Z"));
