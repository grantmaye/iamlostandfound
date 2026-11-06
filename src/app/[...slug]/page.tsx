import { pageNumber } from "@/lib/pagination";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { wp, posts, Post, Term, featured } from "@/lib/wordpress";
import { text, cleanContent } from "@/lib/content";
import { PostList, Pagination } from "@/components/posts";
import { Article, Sidebar } from "@/components/article";
import { StaticPage, staticPages } from "@/components/static-page";
type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
};
type Resolved = { term?: Term; filter?: string; post?: Post; page?: Post };
async function resolve(slug: string[]): Promise<Resolved> {
  const name = slug.at(-1)!;
  if (slug[0] === "category" || slug[0] === "tag") {
    const filter = slug[0] === "category" ? "categories" : "tags";
    const { data } = await wp<Term[]>(filter, { slug: name });
    return { term: data[0], filter };
  }
  if (slug[0] === "author" && slug.length === 2) {
    const { data } = await wp<Term[]>("users", { slug: name });
    return { term: data[0], filter: "author" };
  }
  if (slug.length !== 1) return {};
  const [post, page] = await Promise.all([
    posts({ slug: name }),
    wp<Post[]>("pages", { slug: name }),
  ]);
  return { post: post.data[0], page: page.data[0] };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length === 1 && staticPages[slug[0]])
    return {
      title: staticPages[slug[0]].title,
      alternates: { canonical: `/${slug[0]}/` },
    };
  const data = await resolve(slug);
  const item = data.post || data.page;
  return {
    title: item ? text(item.title.rendered) : data.term?.name || "Not found",
    alternates: { canonical: `/${slug.join("/")}/` },
    ...(item
      ? {
          description: text(item.excerpt?.rendered || "").slice(0, 160),
          openGraph: {
            images: featured(item) ? [featured(item)!.source_url] : [],
          },
        }
      : {}),
  };
}
export default async function Content({ params, searchParams }: Props) {
  const { slug } = await params;
  if (slug[0] === "page" && slug.length === 2 && /^\d+$/.test(slug[1]))
    permanentRedirect(`/?page=${slug[1]}`);
  if (slug.length === 1 && slug[0] === "contact")
    permanentRedirect("/elementor-15992/");
  if (slug.length === 1 && staticPages[slug[0]])
    return <StaticPage slug={slug[0]} />;
  const result = await resolve(slug);
  if (result.term) {
    const page = pageNumber((await searchParams).page);
    if (page === null) notFound();
    const list = await posts({ [result.filter!]: result.term.id, page });
    if (!list.data.length && page > 1) notFound();
    return (
      <main id="main">
        <div className="article-banner">
          <h1 className="shell">{text(result.term.name)}</h1>
        </div>
        <div className="shell article-grid archive-grid">
          <div>
            <PostList items={list.data} />
            <Pagination
              page={page}
              total={list.pages}
              base={`/${slug.join("/")}/`}
            />
          </div>
          <Sidebar />
        </div>
      </main>
    );
  }
  if (result.post) return <Article post={result.post} />;
  if (!result.page) notFound();
  const item = result.page;
  return (
    <main id="main" className="shell reading">
      <article>
        <h1 className="article-title">{text(item.title.rendered)}</h1>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{
            __html: cleanContent(item.content.rendered),
          }}
        />
      </article>
    </main>
  );
}
