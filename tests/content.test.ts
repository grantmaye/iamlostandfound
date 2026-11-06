import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanContent, localLink, text } from "../src/lib/content";
test("keeps editorial content but strips executable markup", () => {
  const html = cleanContent(
    '<p>Hello <strong>world</strong></p><script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a>',
  );
  assert.ok(html.includes("<strong>world</strong>"));
  assert.ok(!/script|onerror|javascript/.test(html));
});
test("rewrites only exact public-site links", () => {
  assert.equal(
    localLink("https://iamlostandfound.com/story/?x=1#photo"),
    "/story/?x=1#photo",
  );
  assert.equal(
    localLink("https://iamlostandfound.com.evil.test/story/"),
    "https://iamlostandfound.com.evil.test/story/",
  );
});
test("decodes title entities without markup", () =>
  assert.equal(text("<b>Travel &amp; life</b>"), "Travel & life"));
import { pageNumber } from "../src/lib/pagination";
test("pagination rejects malformed and unsafe page numbers", () => {
  for (const value of [
    "-1",
    "0",
    "1.5",
    "Infinity",
    "oops",
    "9007199254740992",
  ])
    assert.equal(pageNumber(value), null);
  assert.equal(pageNumber(undefined), 1);
  assert.equal(pageNumber("12"), 12);
});
