# Cojo Consulting — Project Notes

Static Eleventy site for cojo-consulting.ch. See `README.md` for dev/build/deploy instructions.

## Verifying changes (build + visual check via Docker/Playwright)

The host machine has **no local Node/npm** — every build/serve/test command must run inside
Docker. There's no test suite; verification means (1) confirming the Eleventy build succeeds and
(2) actually looking at the rendered output, since a clean build doesn't guarantee the page looks
right.

**1. Build check** — run from the repo root:

```bash
docker run --rm -v "$PWD:/workspace" -w /workspace node:24-bookworm bash -c "npx eleventy"
```

Confirms a clean build and lists every file written to `_site/`. Do this after any template/CSS
change before moving on.

**2. Visual check** — serve the built site, then screenshot it with Playwright from a second
container:

```bash
# Serve (background, pick a free port)
docker run --rm -d --name cojo-preview \
  -v "$PWD:/workspace" -w /workspace -p 8099:8080 \
  node:24-bookworm bash -c "npx eleventy --serve --port=8080 --quiet"

# Screenshot with Playwright (separate container, --network host to reach the server above)
docker run --rm --network host \
  -v "/path/to/scratchpad:/out" \
  mcr.microsoft.com/playwright:v1.48.0-jammy bash -c "
    cd /tmp && npm init -y >/dev/null 2>&1 && npm install playwright@1.48.0 >/dev/null 2>&1
    node -e \"
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.goto('http://localhost:8099/', { waitUntil: 'networkidle' });
        await page.screenshot({ path: '/out/screenshot.png', fullPage: true });
        await browser.close();
      })();
    \"
  "

# Always clean up when done
docker rm -f cojo-preview
```

Then use the Read tool on the screenshot PNG to actually look at it.

- Always `docker rm -f` preview containers when done — a stray container left holding a port
  causes a confusing `port is already allocated` error on the next run.
- To check scroll-triggered content (`[data-fade]` sections use `IntersectionObserver`), either
  simulate a real scroll in the Playwright script before screenshotting, or don't rely on a single
  `fullPage: true` shot to prove animated sections have real content — a full-page screenshot
  resizes the viewport rather than actually scrolling, so off-screen `[data-fade]` elements can
  read as empty even though they're fine for a real user.
- The site's global CSS sets `html { scroll-behavior: smooth }`. That makes **programmatic**
  scrolling (`window.scrollBy`/`scrollTo`, e.g. in a Playwright verification script) animate
  asynchronously instead of jumping instantly, so a `scrollBy` loop can silently fall short of the
  page bottom even though the loop "ran long enough" on paper (`window.scrollY` lags behind what
  you just requested). Before scroll-simulating in a test, do
  `page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; })` first. This
  is a test-only concern — smooth-scroll doesn't affect real users, since it only applies to
  programmatic/anchor-link scrolls, never native mouse-wheel/trackpad/touch scrolling.

## SEO strategy

**Primary target keywords** (the exact phrases people search for — use these forms, not just
loosely related words):

- Versicherungsberatung
- Finanzberatung
- Vorsorgeberatung
- Ungebundener Vermittler

"Beratung" alone is too generic/high-competition to target directly for a small local site — it's
only useful as a supporting term inside the phrases above, not as a standalone heading/title goal.

**Secondary keyword cluster — institutional clients** (scoped specifically to the
Liegenschaftsübersicht/property-management service on the Leistungen page, not a site-wide
primary keyword — don't force these into unrelated pages/sections):

- Gemeinden
- Stiftungen
- Verwaltungen

**Target regions**, in priority order:

1. Zentralschweiz
2. Mittelland, Seeland

**When editing or adding visible page copy** (headings, body text, image `alt` text): weave the
keyword+region combinations in naturally where they're truthful — e.g. "Versicherungsberatung in
der Zentralschweiz" reads fine, forcing all four keywords into one sentence does not. Keep the
site's existing warm, informal "Du" voice. No keyword stuffing.

**Status as of the last SEO pass:** the technical layer (see below), page `<title>`/meta
`description`, and the Leistungen page's "Zusatzleistungen im Detail" section are keyword-
optimized. The *original* short Leistungen teaser cards (Privatpersonen/Geschäftskunden grids)
and the homepage hero body text are **not yet** rewritten with these keywords; that's pending a
content pass on those specific sections.

## Technical SEO conventions

- `src/_data/site.json` is the single source of truth for the domain, NAP (name/address/phone),
  and social links — used by `base.njk` for canonical URLs, Open Graph/Twitter tags, and the
  JSON-LD block. Update it there, not inline in templates.
- Every page's front-matter `title`/`description` drives its `<title>` tag, meta description, and
  Open Graph/Twitter tags automatically (see `src/_includes/base.njk`) — always set both when
  adding a new page.
- `src/sitemap.njk` builds `sitemap.xml` from `collections.all` automatically — new pages are
  included with no manual step, as long as they don't set `eleventyExcludeFromCollections: true`.
- If the services offered, address, phone, or opening hours change, update the JSON-LD
  (`FinancialService`) block in `src/_includes/base.njk` to match — that block, not just the
  visible footer, is what tells Google what the business actually offers.
- `src/images/og-image.png` is the social-share preview image (placeholder, built from brand
  colors/logo — see git history for how it was generated with Playwright). Replace with real
  photography when available; keep it at 1200×630.
