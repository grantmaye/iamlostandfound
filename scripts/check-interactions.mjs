import assert from "node:assert/strict";
import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const origin = process.env.LOCAL_ORIGIN || "http://localhost:3001";
const page = await browser.newPage({
  viewport: { width: 390, height: 900 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(origin);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(await page.locator("#navigation").isVisible(), true);
  await page.getByRole("button", { name: "Open search" }).click();
  await page.locator("#site-search").fill("Dolomites");
  await page.locator("#site-search").press("Enter");
  await page.waitForURL(/s=Dolomites/);
  await page.locator(".post-card").first().waitFor();
  await page.goto(origin);
  await page.getByRole("button", { name: "Show story 2" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Show story 2" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.goto(origin + "/hike-the-dolomites-italy/");
  const reply = page
    .getByRole("button", { name: "Reply", exact: true })
    .first();
  await reply.click();
  assert.notEqual(
    await page.locator('[name="comment_parent"]').inputValue(),
    "0",
  );
  assert.equal(
    await page
      .locator("#comment")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "Cancel reply" }).click();
  assert.equal(await page.locator('[name="comment_parent"]').inputValue(), "0");
  assert.match(
    await page.locator(".comment-form").getAttribute("action"),
    /\/wp-comments-post\.php$/,
  );
  for (const route of [
    "/",
    "/about-me/",
    "/category/italy/",
    "/hike-the-dolomites-italy/",
    "/travel-coaching-2/",
  ]) {
    await page.goto(origin + route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      route + " overflows",
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: mobile menu, search, carousel, comment reply/cancel/focus, five-route overflow checks, no browser exceptions. No form submitted.",
  );
} finally {
  await browser.close();
}
