import { notFound } from "next/navigation";
import { pageNumber } from "@/lib/pagination";
import { posts, featured, categories, dateLabel, wp } from "@/lib/wordpress";
import { text } from "@/lib/content";
import { Hero } from "@/components/hero";
import { PostList, Pagination } from "@/components/posts";
const tiles = [
  ["About Me", "/about-me/", "2026/01/JamieEgypt3.jpg"],
  ["Wander", "/category/wander/", "2025/08/tourchurch.jpg"],
  ["Fab Finds", "/category/5-fab-finds/", "2024/10/MAIN.jpg"],
  ["Subscribe", "/elementor-15992/", "2025/09/ellawithkayaks.jpg"],
];
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; s?: string }>;
}) {
  const q = await searchParams;
  const page = pageNumber(q.page);
  if (page === null) notFound();
  const result = await posts({ page, ...(q.s ? { search: q.s } : {}) });
  if (page > 1 && !result.data.length) notFound();
  const counts =
    page === 1 && !q.s
      ? await Promise.all(
          result.data
            .slice(0, 3)
            .map((p) =>
              wp<unknown[]>("comments", { post: p.id, per_page: 1 }).then(
                (r) => r.total || 0,
              ),
            ),
        )
      : [];
  return (
    <main id="main" className="shell">
      {page === 1 && !q.s ? (
        <>
          <h1 className="sr-only">I Am Lost and Found — Inspiring Travel</h1>
          <Hero
            slides={result.data.slice(0, 3).map((p, i) => ({
              comments: counts[i],
              href: `/${p.slug}/`,
              title: text(p.title.rendered),
              image: featured(p)?.source_url || "",
              date: dateLabel(p.date),
              categories: categories(p)
                .map((c) => text(c.name))
                .join(", "),
            }))}
          />
          <div className="feature-tiles">
            {tiles.map(([label, href, img]) => (
              <a
                href={href}
                key={label}
                style={{
                  backgroundImage: `url(https://iamlostandfound.com/wp-content/uploads/${img})`,
                }}
              >
                <span>{label}</span>
              </a>
            ))}
          </div>
        </>
      ) : (
        <h1 className="archive-heading">
          {q.s ? `Search results for “${q.s}”` : `Stories — Page ${page}`}
        </h1>
      )}
      <PostList items={result.data} />
      {!result.data.length && (
        <p className="empty">No stories found. Try another search.</p>
      )}
      <Pagination page={page} total={result.pages} search={q.s} />
    </main>
  );
}
