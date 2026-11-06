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
- The frontend is read-only with respect to WordPress. Published comments are displayed; comment submission links to WordPress; subscription and inquiry buttons link to the existing forms pending direct provider integration.

## Before production

Read [the migration status](docs/migration-status.md). Keep the public site untouched until the remaining integrations, visual comparisons, redirects, and cutover checks pass.

Set `WORDPRESS_URL` to a separate WordPress origin (for example a CMS subdomain) **before** pointing the public domain at Next.js, or REST requests will loop back to the frontend. Set `NEXT_PUBLIC_SITE_URL` to the production frontend origin. WordPress media URLs and comment/form fallback URLs also need a cutover plan.

The existing photography, text, logo, and brand assets belong to their respective owners. Font Awesome brand icons are retained from the original site for visual continuity and are subject to their upstream license.
