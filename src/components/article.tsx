import { Comments } from "./comments";
import {
  Post,
  featured,
  wp,
  posts,
  categories,
  dateLabel,
} from "@/lib/wordpress";
import { cleanContent, text, localLink } from "@/lib/content";
type Comment = {
  id: number;
  parent: number;
  author_avatar_urls?: Record<string, string>;
  author_name: string;
  date: string;
  content: { rendered: string };
};
export function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>About Me</h2>
      <a href="/about-me/">
        <img
          src="https://iamlostandfound.com/wp-content/uploads/2023/08/2023PORTRAITME-2.jpg"
          alt="Jamie Edwards"
          width="320"
          height="400"
        />
      </a>
      <p>
        My name is Jamie. I’m an award-winning writer and the creator of I am
        Lost and Found—a website that inspires travel. I started my website to
        share the places I’ve loved, in hopes of sparking that same curiosity in
        others. My writing aims to transport readers—so they feel as though
        they’re right there beside me. Or better yet, to book a flight to see it
        for themselves. I’ve traveled to over 70 countries across seven
        continents, and most recently contributed to National Geographic’s The
        Traveler’s Atlas—a book that celebrates the joy of exploration through
        photography and stories.
      </p>
      <h2>Click for Inspiration!</h2>
      <a className="subscribe-button" href="/elementor-15992/">
        Click here to subscribe
      </a>
    </aside>
  );
}
export async function Article({ post }: { post: Post }) {
  const image = featured(post);
  const [comments, older, newer, related] = await Promise.all([
    wp<Comment[]>("comments", { post: post.id, per_page: 100, order: "asc" }),
    posts({ before: post.date, per_page: 1 }),
    posts({ after: post.date, per_page: 1, order: "asc" }),
    posts({
      categories: post.categories.join(","),
      exclude: post.id,
      per_page: 3,
    }),
  ]);
  const author = post._embedded?.author?.[0];
  const tags =
    post._embedded?.["wp:term"]
      ?.flat()
      .filter((t) => t.taxonomy === "post_tag") || [];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: text(post.title.rendered),
    datePublished: post.date,
    dateModified: post.modified,
    image: image?.source_url,
    url: `${site}/${post.slug}/`,
    author: {
      "@type": "Person",
      name: post._embedded?.author?.[0]?.name || "Jamie Edwards",
    },
  };
  return (
    <main id="main">
      <div className="article-banner">
        <h1 className="shell">{text(post.title.rendered)}</h1>
      </div>
      <div className="shell article-grid">
        <article>
          {image && (
            <div className="article-featured">
              <img
                src={image.source_url}
                alt={image.alt_text}
                width={image.media_details?.width || 1500}
                height={image.media_details?.height || 1125}
              />
            </div>
          )}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{
              __html: cleanContent(post.content.rendered),
            }}
          />
          <div className="article-tags">
            {tags.map((t) => (
              <a href={localLink(t.link)} key={t.id}>
                {text(t.name)}
              </a>
            ))}
          </div>
          <div className="article-bottom-meta">
            <span>
              by:{" "}
              <a href={`/author/${author?.slug || "jamie"}/`}>
                {author?.name || "Jamie Edwards"}
              </a>
            </span>
            <span>
              <a href="#comments">leave a comment</a> /{" "}
              {categories(post).map((t, i) => (
                <span key={t.id}>
                  {i > 0 ? ", " : ""}
                  <a href={localLink(t.link)}>{text(t.name)}</a>
                </span>
              ))}
            </span>
          </div>
          <nav className="adjacent-posts" aria-label="Adjacent stories">
            <div>
              {older.data[0] && (
                <a href={`/${older.data[0].slug}/`}>
                  ‹ &nbsp;{text(older.data[0].title.rendered)}
                </a>
              )}
            </div>
            <div>
              {newer.data[0] && (
                <a href={`/${newer.data[0].slug}/`}>
                  {text(newer.data[0].title.rendered)} &nbsp;›
                </a>
              )}
            </div>
          </nav>
          <div className="author-card">
            <div>
              {author?.avatar_urls?.["96"] && (
                <img
                  src={author.avatar_urls["96"]}
                  alt=""
                  width="96"
                  height="96"
                />
              )}
            </div>
            <div>
              <h5>
                More about{" "}
                <a href={`/author/${author?.slug || "jamie"}/`}>
                  {author?.name || "Jamie Edwards"}
                </a>
              </h5>
              {author?.description && <p>{author.description}</p>}
            </div>
          </div>
          {related.data.length > 0 && (
            <section className="related-stories">
              <h5>Related Posts</h5>
              <div>
                {related.data.map((p) => (
                  <article key={p.id}>
                    {featured(p) && (
                      <a href={`/${p.slug}/`}>
                        <img
                          src={featured(p)!.source_url}
                          alt={featured(p)!.alt_text}
                          loading="lazy"
                        />
                      </a>
                    )}
                    <h6>
                      <a href={`/${p.slug}/`}>{text(p.title.rendered)}</a>
                    </h6>
                    <time dateTime={p.date}>{dateLabel(p.date)}</time>
                  </article>
                ))}
              </div>
            </section>
          )}
          <Comments
            postId={post.id}
            open={post.comment_status === "open"}
            wordpressUrl={(
              process.env.WORDPRESS_URL || "https://iamlostandfound.com"
            ).replace(/\/$/, "")}
            items={comments.data.map((c) => ({
              id: c.id,
              parent: c.parent,
              author_name: text(c.author_name),
              date: c.date,
              html: cleanContent(c.content.rendered),
              avatar: c.author_avatar_urls?.["96"] || "",
            }))}
          />
        </article>
        <Sidebar />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
