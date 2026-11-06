"use client";
import { useState } from "react";
type Comment = {
  id: number;
  parent: number;
  author_name: string;
  date: string;
  html: string;
  avatar: string;
};
export function Comments({
  items,
  postId,
  wordpressUrl,
  open,
}: {
  items: Comment[];
  postId: number;
  wordpressUrl: string;
  open: boolean;
}) {
  const [reply, setReply] = useState<{ id: number; name: string } | null>(null);
  const jump = (c: Comment) => {
    setReply({ id: c.id, name: c.author_name });
    document.getElementById("respond")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("comment")?.focus({ preventScroll: true });
  };
  const render = (parent: number): React.ReactNode =>
    items
      .filter((c) => c.parent === parent)
      .map((c) => (
        <li key={c.id} id={`comment-${c.id}`}>
          <article className="comment-body">
            <img
              className="comment-avatar"
              src={c.avatar}
              width="75"
              height="75"
              alt=""
            />
            <div className="comment-meta">
              <h4>{c.author_name}</h4>
              <a href={`#comment-${c.id}`}>
                <time dateTime={c.date}>
                  {new Date(c.date + "Z").toLocaleString("en-US", {
                    timeZone: "UTC",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              </a>
            </div>
            <div
              className="comment-content"
              dangerouslySetInnerHTML={{ __html: c.html }}
            />
            {open && (
              <button className="comment-reply" onClick={() => jump(c)}>
                Reply
              </button>
            )}
          </article>
          {items.some((child) => child.parent === c.id) && (
            <ol>{render(c.id)}</ol>
          )}
        </li>
      ));
  return (
    <section id="comments" className="comments-area">
      {items.length > 0 && (
        <>
          <h3 className="comment-count">
            {items.length === 1 ? "One Comment" : `${items.length} Comments`}
          </h3>
          <ol className="comment-list">{render(0)}</ol>
        </>
      )}
      {open && (
        <div id="respond">
          <h3>
            {reply ? `Reply to ${reply.name}` : "Leave a comment"}
            {reply && (
              <button className="cancel-reply" onClick={() => setReply(null)}>
                Cancel reply
              </button>
            )}
          </h3>
          <form
            action={`${wordpressUrl}/wp-comments-post.php`}
            method="post"
            className="comment-form"
          >
            <p>
              Your email address will not be published. Required fields are
              marked *
            </p>
            <p>
              <label htmlFor="comment">Comment *</label>
              <textarea id="comment" name="comment" rows={8} required />
            </p>
            <div className="comment-fields">
              <p>
                <label htmlFor="author">Name</label>
                <input id="author" name="author" autoComplete="name" />
              </p>
              <p>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                />
              </p>
              <p>
                <label htmlFor="url">Website</label>
                <input type="url" id="url" name="url" autoComplete="url" />
              </p>
            </div>
            <p className="comment-subscription">
              <label>
                <input
                  type="checkbox"
                  name="subscribe_comments"
                  value="subscribe"
                />{" "}
                Notify me of follow-up comments by email.
              </label>
            </p>
            <p className="comment-subscription">
              <label>
                <input
                  type="checkbox"
                  name="subscribe_blog"
                  value="subscribe"
                />{" "}
                Notify me of new posts by email.
              </label>
            </p>
            <input type="hidden" name="comment_post_ID" value={postId} />
            <input type="hidden" name="comment_parent" value={reply?.id || 0} />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      )}
    </section>
  );
}
