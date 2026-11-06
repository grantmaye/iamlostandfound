import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/about-me/",
      "/category/italy/",
      "/hike-the-dolomites-italy/",
      "/travel-coaching-2/",
    ];
const dir = process.env.AUDIT_DIR || "../../work/visual";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const report = [];
const cached = process.env.AUDIT_REFERENCE_DIR
  ? JSON.parse(
      await readFile(
        path.join(process.env.AUDIT_REFERENCE_DIR, "report.json"),
        "utf8",
      ),
    )
  : [];
try {
  for (const width of (process.env.AUDIT_WIDTHS || "390,1200")
    .split(",")
    .map(Number)) {
    for (const route of routes) {
      const shots = [];
      const metrics = [];
      for (const [name, origin] of [
        ["reference", "https://iamlostandfound.com"],
        ["local", process.env.LOCAL_ORIGIN || "http://localhost:3000"],
      ]) {
        if (name === "reference" && process.env.AUDIT_REFERENCE_DIR) {
          const row = cached.find(
            (r) => r.route === route && r.width === width,
          );
          if (row) {
            const stem = `${route.replace(/\W+/g, "-")}-${width}`;
            const png = await readFile(
              path.join(
                process.env.AUDIT_REFERENCE_DIR,
                `${stem}-reference.png`,
              ),
            );
            await writeFile(path.join(dir, `${stem}-reference.png`), png);
            shots.push(PNG.sync.read(png));
            metrics.push(row.reference);
            continue;
          }
        }
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          deviceScaleFactor: 1,
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        await page.goto(origin + route, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const i of document.images) {
            if (i.getBoundingClientRect().top < 1100) i.loading = "eager";
          }
          await Promise.race([
            Promise.all(
              [...document.images]
                .filter((i) => i.getBoundingClientRect().top < 1100)
                .map((i) => i.decode().catch(() => {})),
            ),
            new Promise((r) => setTimeout(r, 10000)),
          ]);
        });
        if (name === "reference")
          await page.evaluate(() => {
            if (window.jQuery) {
              const c = window.jQuery(".owl-carousel");
              c.trigger("stop.owl.autoplay");
              c.trigger("to.owl.carousel", [0, 0]);
            }
          });
        await page.evaluate(
          () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(r)),
            ),
        );
        const selectors =
          name === "reference"
            ? {
                header: "header",
                logo: "header img",
                hero: ".blogs-sliders",
                tiles: ".elementor-element-0214c4e",
                post: ".single_post",
                title: ".post_title",
                excerpt: ".post_excerpt",
                footer: "footer",
                banner:
                  '.breadcrumb-section,[data-widget_type="heading.default"]',
                article: ".ss-post_container",
                body: ".post_single",
                sidebar: "aside",
              }
            : {
                header: "header",
                logo: "header img",
                hero: ".hero",
                tiles: ".feature-tiles",
                post: ".post-card",
                title: ".post-copy h2",
                excerpt: ".excerpt",
                footer: "footer",
                banner: ".article-banner,.page-banner",
                article: ".article-grid>article",
                body: ".article-body",
                sidebar: "aside",
              };
        await page.evaluate(async () => {
          const urls = [...document.querySelectorAll("*")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.top < 1100 && r.bottom > 0;
            })
            .flatMap((e) =>
              [
                ...getComputedStyle(e).backgroundImage.matchAll(
                  /url\("?([^")]+)"?\)/g,
                ),
              ].map((m) => m[1]),
            );
          await Promise.all(
            urls.map(
              (src) =>
                new Promise((resolve) => {
                  const i = new Image();
                  i.onload = i.onerror = resolve;
                  i.src = src;
                  setTimeout(resolve, 15000);
                }),
            ),
          );
        });
        const metric = await page.evaluate((selectors) => {
          const out = {
            height: document.documentElement.scrollHeight,
            width: document.documentElement.scrollWidth,
          };
          for (const [k, s] of Object.entries(selectors)) {
            out[k] = [...document.querySelectorAll(s)]
              .slice(0, 12)
              .map((e) => ({
                box: e.getBoundingClientRect().toJSON(),
                font: getComputedStyle(e).font,
                text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 700),
              }));
          }
          return out;
        }, selectors);
        metrics.push(metric);
        const stem = `${route.replace(/\W+/g, "-")}-${width}`;
        const png = await page.screenshot({
          path: path.join(dir, `${stem}-${name}.png`),
          animations: "disabled",
        });
        shots.push(PNG.sync.read(png));
        await context.close();
      }
      const diff = new PNG({ width, height: 900 });
      const count = pixelmatch(
        shots[0].data,
        shots[1].data,
        diff.data,
        width,
        900,
        { threshold: 0.1 },
      );
      const stem = `${route.replace(/\W+/g, "-")}-${width}`;
      await writeFile(path.join(dir, `${stem}-diff.png`), PNG.sync.write(diff));
      report.push({
        route,
        width,
        differentPixels: count,
        totalPixels: width * 900,
        percent: (100 * count) / (width * 900),
        reference: metrics[0],
        local: metrics[1],
      });
      console.log(
        JSON.stringify({ route, width, percent: report.at(-1).percent }),
      );
    }
  }
} finally {
  await browser.close();
  await writeFile(
    path.join(dir, "report.json"),
    JSON.stringify(report, null, 2),
  );
}
