import sanitizeHtml from "sanitize-html";
import { decode } from "he";
export const text = (html: string) =>
  decode(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }));
export function localLink(value: string) {
  try {
    const u = new URL(value);
    return ["iamlostandfound.com", "www.iamlostandfound.com"].includes(
      u.hostname,
    )
      ? u.pathname + u.search + u.hash
      : value;
  } catch {
    return value;
  }
}
export function cleanContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
      "picture",
      "source",
      "video",
      "audio",
    ]),
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: [
        "src",
        "srcset",
        "sizes",
        "alt",
        "width",
        "height",
        "loading",
        "style",
      ],
      source: ["src", "srcset", "type"],
      video: ["src", "controls", "poster"],
      audio: ["src", "controls"],
      "*": ["id", "class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedStyles: {
      img: {
        width: [/^\d+(?:\.\d+)?(?:px|%)$/],
        height: [/^(?:auto|\d+(?:\.\d+)?(?:px|%))$/],
        "aspect-ratio": [/^\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?$/],
      },
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: "a",
        attribs: { ...attrs, href: localLink(attrs.href || "") },
      }),
      img: (_tag, attrs) => ({
        tagName: "img",
        attribs: { ...attrs, loading: "lazy" },
      }),
    },
  });
}
