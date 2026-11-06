import pages from "@/content/pages.json";
import sanitizeHtml from "sanitize-html";
import { cleanContent } from "@/lib/content";
export const staticPages = pages as Record<
  string,
  { title: string; blocks: { type: string; html: string; index: number }[] }
>;
function editorial(html: string) {
  return sanitizeHtml(cleanContent(html), {
    allowedTags: [
      "p",
      "a",
      "strong",
      "em",
      "b",
      "i",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "br",
      "img",
      "ul",
      "ol",
      "li",
      "blockquote",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height", "loading"],
    },
  });
}
export function StaticPage({ slug }: { slug: string }) {
  const page = staticPages[slug];
  return (
    <main id="main" className={"shell static-page " + slug}>
      <h1 className="page-banner">{page.title}</h1>
      {page.blocks
        .slice(page.blocks[0]?.type === "heading" ? 1 : 0)
        .map((b, i) =>
          b.type === "divider" ? (
            <div key={i} data-block={b.index} className="editorial-divider" />
          ) : b.type === "map" ? (
            <div key={i} data-block={b.index} className="travel-map">
              <div>
                <iframe
                  title="Countries Jamie has visited"
                  src={b.html.startsWith("//") ? `https:${b.html}` : b.html}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              <span>
                Create a map on{" "}
                <a href="https://www.fla-shop.com/visited-countries/">
                  Fla-shop.com
                </a>
              </span>
            </div>
          ) : b.type === "subscribe" || b.type === "inquiry" ? (
            <div key={i} className="pending-form">
              <p>
                {b.type === "subscribe"
                  ? "Inspiring travel—delivered to your inbox once a month."
                  : "Let’s plan your next adventure."}
              </p>
              <a href={`https://iamlostandfound.com/${slug}/`}>
                {b.type === "subscribe"
                  ? "Subscribe to the newsletter"
                  : "Send a travel inquiry"}
              </a>
            </div>
          ) : (
            <section
              key={i}
              data-block={b.index}
              className={"editorial-block " + b.type}
              dangerouslySetInnerHTML={{ __html: editorial(b.html) }}
            />
          ),
        )}
    </main>
  );
}
