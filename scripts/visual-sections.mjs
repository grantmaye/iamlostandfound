import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
const cases = [
  ["/", "first-story", ".single_post .post_content", ".post-copy"],
  ["/", "footer", "body>footer", ".site-footer"],
  [
    "/about-me/",
    "introduction",
    '[data-widget_type="text-editor.default"]',
    '[data-block="3"]',
  ],
  ["/about-me/", "awards", ".elementor-element-8a30e97", '[data-block="4"]'],
  ["/about-me/", "footer", "body>footer", ".site-footer"],
  [
    "/hike-the-dolomites-italy/",
    "article-start",
    ".ss-post_container.post_single>.wp-block-paragraph",
    ".article-body>p",
  ],
  [
    "/hike-the-dolomites-italy/",
    "related",
    ".ss-related-posts",
    ".related-stories",
  ],
  ["/hike-the-dolomites-italy/", "comments", "#comments", "#comments"],
  [
    "/travel-coaching-2/",
    "introduction",
    '[data-widget_type="text-editor.default"]',
    '[data-block="2"]',
  ],
];
const dir = process.env.AUDIT_DIR || "../../work/sections";
await mkdir(dir, { recursive: true });
const b = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const rows = [];
try {
  for (const width of [390, 1200])
    for (const [route, name, ref, local] of cases) {
      const shots = [];
      const ys = [];
      for (const [origin, selector, label] of [
        ["https://iamlostandfound.com", ref, "reference"],
        [process.env.LOCAL_ORIGIN || "http://localhost:3001", local, "local"],
      ]) {
        const p = await b.newPage({
          viewport: { width, height: 900 },
          deviceScaleFactor: 1,
          reducedMotion: "reduce",
        });
        await p.goto(origin + route, { waitUntil: "domcontentloaded" });
        await p.evaluate(async () => {
          await document.fonts.ready;
          await Promise.race([
            Promise.all(
              [...document.images].map((i) => {
                i.loading = "eager";
                return i.decode().catch(() => {});
              }),
            ),
            new Promise((r) => setTimeout(r, 15000)),
          ]);
        });
        const target = p.locator(selector).first();
        if (!(await target.count())) {
          await p.close();
          break;
        }
        const y = await target.evaluate(
          (e) => e.getBoundingClientRect().top + scrollY,
        );
        ys.push(y);
        await p.evaluate((y) => scrollTo(0, Math.max(0, y - 20)), y);
        await p.evaluate(async () => {
          await Promise.race([
            Promise.all(
              [...document.images]
                .filter((i) => {
                  const r = i.getBoundingClientRect();
                  return r.top < 1000 && r.bottom > 0;
                })
                .map((i) => {
                  i.loading = "eager";
                  return i.decode().catch(() => {});
                }),
            ),
            new Promise((r) => setTimeout(r, 10000)),
          ]);
        });
        await p.evaluate((y) => scrollTo(0, Math.max(0, y - 20)), y);
        const png = await p.screenshot({
          path: `${dir}/${route.replace(/\W/g, "-")}-${name}-${width}-${label}.png`,
          animations: "disabled",
        });
        shots.push(PNG.sync.read(png));
        await p.close();
      }
      if (shots.length < 2) continue;
      const diff = new PNG({ width, height: 900 });
      const different = pixelmatch(
        shots[0].data,
        shots[1].data,
        diff.data,
        width,
        900,
        { threshold: 0.1 },
      );
      await writeFile(
        `${dir}/${route.replace(/\W/g, "-")}-${name}-${width}-diff.png`,
        PNG.sync.write(diff),
      );
      const row = {
        route,
        name,
        width,
        yReference: ys[0],
        yLocal: ys[1],
        offset: ys[1] - ys[0],
        percent: (100 * different) / (width * 900),
      };
      rows.push(row);
      console.log(JSON.stringify(row));
    }
} finally {
  await b.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(rows, null, 2));
}
