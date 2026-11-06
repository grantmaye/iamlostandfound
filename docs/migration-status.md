# Migration status — November 6, 2026

## Implemented

- Next.js, React, TypeScript, Tailwind tooling; fresh repository and lockfile.
- Custom responsive navigation, carousel, feature tiles, archive cards, footer, and responsive local logo/icon/font assets.
- Measured editorial block styling, restored travel map embed, article author/adjacent/related sections, existing comments, and reply controls.
- Published WordPress post retrieval, category archives including nested category URLs, keyword search, and pagination.
- Post URL preservation, tag and author archives, per-page metadata, sitemap, robots policy, article structured data, missing-page and service-error states.
- Sanitized editorial HTML and internal-link rewriting; authenticated cache invalidation endpoint.
- Checked-in content for About Me, Travel Coaching, Subscribe, contact pages, guides, and photo gallery.

## Verification completed

- Mobile menu, search, carousel selection, comment reply/cancel/focus, and overflow checks passed; no browser exceptions and no form submissions.
- Twenty top-viewport comparisons across five routes at 390, 768, 1200, and 1440px, plus sixteen lower-section comparisons. See the visual report for measured differences and limits.

- Production compilation and TypeScript check passed.
- Five tests covering content sanitization, safe image sizing, link rewriting, entity decoding, and pagination validation.
- HTTP checks: homepage, category, nested category, article, search, page 2, coaching and subscription pages returned 200; nonexistent slug returned 404; unauthenticated cache invalidation returned 401.
- Browser inspection at 1200px desktop and 390px mobile. No horizontal overflow on the mobile homepage. Mobile menu/submenu and search submission verified in the browser.
- About Me desktop banner: x=30, y≈317.08, width=1140, height=162. First image: x=30, y≈499.08, width=400, height=596. These match the reference measurements to under 0.01px. Article title and featured image positions also matched the same desktop reference to under 0.01px.

## Still required — not pixel-perfect or launch-ready

- Extend [the screenshot comparisons](visual-verification.md) beyond the five primary routes and four viewport widths. Remaining lower-page spacing, image, and dynamic-embed differences prevent pixel-perfect sign-off.
- Connect newsletter and inquiry forms directly to the confirmed email/form services. Current links use the old site; do not remove those WordPress plugins yet.
- Verify the custom comment form against the WordPress submission, anti-spam, subscription-checkbox, and moderation setup. No test comment has been submitted.
- Inventory shop, cart, checkout, account, e-guide purchase flows, embeds, social feeds, shortcodes, and their dependencies. These are not migrated by this initial build.
- Complete remaining legacy redirects, canonical pagination behavior, and feeds. Tag/author archives, homepage pagination aliases, sitemap, robots policy, and article structured data are implemented but need broader production verification.
- Audit older article galleries and plugin-generated content. Sanitization deliberately removes scripts/forms and does not recreate arbitrary plugin widgets.
- Set up a stable WordPress CMS/media origin, preview of drafts, optional publish webhook, deployment project, and production environment variables.
- Verify publishing a real post through WordPress, subscriptions, inquiries, comments, analytics, and SEO before DNS changes.

The live site was not modified, no plugins were disabled, and no DNS or production deployment changes were made.

Newsletter/inquiry provider selection was explicitly deferred by the user. Ask again during the integration phase, not during this design milestone.
