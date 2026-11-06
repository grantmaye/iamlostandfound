# I Am Lost and Found

Custom Next.js 16 / React 19 / TypeScript frontend with Tailwind CSS 4 tooling. WordPress remains the editorial backend via its core REST API. This repository is an **initial migration build**, not yet a production cutover or a certified pixel-perfect replacement.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The default WordPress source is the existing public site; no credentials are required to read published stories.

```sh
npm test
npm run typecheck
npm run build
```

## Architecture

- Server-rendered posts, categories, search, and pagination read the WordPress REST API. Content is cached for five minutes and sanitized before rendering.
- Next.js components own the header, mobile navigation, carousel, archive layout, and article layout. No Elementor, jQuery, Owl Carousel, or WordPress theme scripts are loaded.
- Non-blog editorial pages are checked into `src/content/pages.json`, extracted from the public site on November 6, 2026. They are rendered by custom components and edited in this repo, not through Elementor.
- Logo and font assets are local. Existing photographs remain on their original media hosts. Font assets preserve the original site’s families, but CSS currently matches the fallback typography visibly rendered by the public reference, whose font requests fail.
- `POST /api/revalidate/` accepts `Authorization: Bearer <REVALIDATE_SECRET>` and expires the WordPress cache. Never expose this secret to the browser. Automatic WordPress webhooks are not installed yet.
- Published comments, nested replies, related stories, and author details come from WordPress. The custom comment form posts to the existing WordPress comment endpoint; reply selection is handled locally. Actual submission/moderation remains unverified. Subscription and inquiry buttons link to the existing forms pending provider selection.

## Before production

Read [the migration status](docs/migration-status.md). Keep the public site untouched until the remaining integrations, visual comparisons, redirects, and cutover checks pass.

Set `WORDPRESS_URL` to a separate WordPress origin (for example a CMS subdomain) **before** pointing the public domain at Next.js, or REST requests will loop back to the frontend. Set `NEXT_PUBLIC_SITE_URL` to the production frontend origin. WordPress media URLs and comment/form fallback URLs also need a cutover plan.

The existing photography, text, logo, and brand assets belong to their respective owners. Font Awesome brand icons are retained from the original site for visual continuity and are subject to their upstream license.

## Visual verification

See [the visual comparison report](docs/visual-verification.md) for coverage and remaining differences. Against a running production preview:

```sh
LOCAL_ORIGIN=http://localhost:3001 AUDIT_WIDTHS=390,768,1200,1440 node scripts/visual-audit.mjs
LOCAL_ORIGIN=http://localhost:3001 node scripts/visual-sections.mjs
LOCAL_ORIGIN=http://localhost:3001 node scripts/check-interactions.mjs
```

Set `CHROME_PATH` if Chrome is not at the default macOS installation path. Set `AUDIT_DIR` to choose the screenshot output folder. `AUDIT_REFERENCE_DIR` can reuse an earlier top-viewport capture and its report. Screenshot percentages use a pixelmatch threshold of 0.1 and exclude detected antialiasing; they are not a claim of full-site equivalence. Do not rebuild while capturing against a running production server: rebuild first, then restart it so HTML and assets use the same build.
