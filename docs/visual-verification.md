# Visual comparison — November 6, 2026

Production build compared with the live reference in local Chrome at device scale 1. Each top viewport is 900px tall; reduced motion is enabled and the original carousel is held on its first slide. Pixelmatch threshold: 0.1, detected antialiasing excluded. These results cover the tested viewports, not whole pages or every published article.

| Route                      | 390px | 768px | 1200px | 1440px |
| -------------------------- | ----: | ----: | -----: | -----: |
| /                          | 0.56% | 0.97% |  0.52% |  1.01% |
| /about-me/                 | 0.17% | 0.23% |  0.15% |  0.12% |
| /category/italy/           | 0.34% | 0.24% |  0.15% |  0.13% |
| /hike-the-dolomites-italy/ | 0.18% | 0.45% |  0.15% |  0.13% |
| /travel-coaching-2/        | 0.17% | 0.27% |  0.17% |  0.14% |

## Lower-page checks

Sixteen section comparisons covered the homepage first story/footer, About introduction/footer, article opening/related stories/comments, and coaching introduction at 390px and 1200px. The mobile article opening matched with zero differing pixels; the mobile comments view was within 0.55%. Lower sections still show accumulated spacing and image-rendering differences. The About map is an external iframe whose loading and layout vary; its screenshots are not a stable baseline.

## Remaining visual work

- Resolve full-article vertical drift and related-story sizing across breakpoints.
- Finish homepage footer and metadata details and verify all carousel slides.
- Validate the externally hosted travel map after successful loading.
- Extend comparisons to older posts, galleries, other categories, search, pagination, guides, and the subscription/contact templates.
- Newsletter and coaching forms intentionally retain links to their existing destinations while provider choice is deferred; these sections are not yet equivalent.

This is a substantial fidelity pass, not pixel-perfect sign-off. The final menu accessibility label, divider/map-spacing corrections, and preservation of WordPress resized-image dimensions followed these captures.
