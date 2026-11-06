import { Post, featured, wp, dateLabel } from "@/lib/wordpress";
import { cleanContent, text } from "@/lib/content";
type Comment = {
  id: number;
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
  const comments = await wp<Comment[]>("comments", {
    post: post.id,
    per_page: 100,
    order: "asc",
  });
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
                width="770"
                height="500"
              />
            </div>
          )}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{
              __html: cleanContent(post.content.rendered),
            }}
          />
          <section id="comments">
            <h2>
              {comments.total || 0}{" "}
              {(comments.total || 0) === 1 ? "Comment" : "Comments"}
            </h2>
            {comments.data.map((c) => (
              <article className="comment" id={`comment-${c.id}`} key={c.id}>
                <h3>{text(c.author_name)}</h3>
                <time dateTime={c.date}>{dateLabel(c.date)}</time>
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanContent(c.content.rendered),
                  }}
                />
              </article>
            ))}
            <a
              className="read-more"
              href={`${process.env.WORDPRESS_URL || "https://iamlostandfound.com"}/${post.slug}/#respond`}
            >
              Leave a comment
            </a>
          </section>
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
