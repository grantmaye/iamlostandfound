import { Post, featured, categories, dateLabel } from "@/lib/wordpress";
import { text, cleanContent, localLink } from "@/lib/content";
export function Meta({ post }: { post: Post }) {
  return (
    <div className="post-meta">
      <time dateTime={post.date}>{dateLabel(post.date)}</time>
      <span className="category-links">
        {categories(post).map((c, i) => (
          <span key={c.id}>
            {i > 0 ? ", " : ""}
            <a href={localLink(c.link)}>{text(c.name)}</a>
          </span>
        ))}
      </span>
    </div>
  );
}
export function PostList({ items }: { items: Post[] }) {
  return (
    <div className="post-list">
      {items.map((p) => {
        const img = featured(p);
        return (
          <article key={p.id} className="post-card">
            {img && (
              <a className="post-image" href={`/${p.slug}/`}>
                <img
                  src={img.source_url}
                  alt={img.alt_text || ""}
                  width={img.media_details?.width}
                  height={img.media_details?.height}
                  loading="lazy"
                />
              </a>
            )}
            <div className="post-copy">
              <h2>
                <a href={`/${p.slug}/`}>{text(p.title.rendered)}</a>
              </h2>
              <Meta post={p} />
              <div className="excerpt">
                {text(p.content.rendered)
                  .replace(/\s+/g, " ")
                  .trim()
                  .split(" ")
                  .slice(0, 85)
                  .join(" ")}
                ...
              </div>
            </div>
            <div className="post-bottom">
              <a className="read-more" href={`/${p.slug}/`}>
                Read More
              </a>
              <span>
                <a href={`/${p.slug}/#comments`}>Leave a comment</a> / by{" "}
                {p._embedded?.author?.[0]?.name || "Jamie Edwards"}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function Pagination({
  page,
  total,
  base = "/",
  search,
}: {
  page: number;
  total: number;
  base?: string;
  search?: string;
}) {
  const href = (n: number) =>
    `${base}?${new URLSearchParams({ ...(search ? { s: search } : {}), page: String(n) })}`;
  return total > 1 ? (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && (
        <a href={href(page - 1)} aria-label="Previous page">
          «
        </a>
      )}
      {Array.from({ length: total }, (_, i) => i + 1)
        .filter((n) => n === 1 || n === total || Math.abs(n - page) < 2)
        .map((n, i, a) => (
          <span key={n}>
            {i > 0 && n - a[i - 1] > 1 && <span className="ellipsis">…</span>}
            <a aria-current={n === page ? "page" : undefined} href={href(n)}>
              {n}
            </a>
          </span>
        ))}
      {page < total && (
        <a href={href(page + 1)} aria-label="Next page">
          »
        </a>
      )}
    </nav>
  ) : null;
}
