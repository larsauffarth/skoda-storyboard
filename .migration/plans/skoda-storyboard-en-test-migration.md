# Škoda Storyboard `/en` Landing Page — Test-Migration Plan

## Goal
Migrate the single English landing page (`https://www.skoda-storyboard.com/en/`) to AEM Edge Delivery Services (Document Authoring / Experience Workspace) so it renders faithfully in local preview — including a working **header/nav + footer** — with dynamic systems represented as **static stubs**. This is a capability slice that also stands up the reusable blocks the rest of the migration needs.

## Source-of-truth alignment
- **Authoring surface:** Document Authoring / Experience Workspace — table-driven blocks, no Universal Editor / JCR (per `SKODA-EDS-DA-ARCHITECTURE.md`).
- **Repo target:** org `larsauffarth`, site `skoda-storyboard` (from `.migration/project.json`); content pushed via DA source API `POST https://admin.da.live/source/larsauffarth/skoda-storyboard/{path}.html` (credentials injected — never a pasted token).
- Repo is a fresh AEM boilerplate; `content/index.plain.html`, `nav.plain.html`, `footer.plain.html` still hold boilerplate content and will be replaced for the pilot.

## What the `/en` page is made of
WordPress front page (server-rendered, **not** SiteOrigin Page Builder — so no story-flattener needed). Composition:
- **Hero** (real `<img>`, overlay `<h1>`, LCP-friendly) → Hero block.
- **Teaser/card rails** — featured grid + category rows (eMobility, Lifestyle, Škoda World) → Cards block with `overlay` / `media` / `toolbar` variants.
- **"Series" carousel** (auto-rotating) → rendered as a static card rail for this pilot (no auto-rotate).
- **Chrome:** mega-menu header (3 nested panels, plain links) + footer (nav repeat + social + app badges + legal) → `nav` / `footer` fragments.
- **Dynamic (static stubs):** media-cart "add" buttons omitted from teasers; promo banner → static promo image/box; newsletter → static (non-submitting) block; social feed → static cards/omitted.

## Blocks required
| Block | Source | Effort | Notes |
|---|---|---|---|
| Hero | new (Block Collection pattern) | Low | CSS-only; `<img>` direct child of `<div>`; watch overlay contrast |
| Cards/Teaser | boilerplate `cards` + variants | Low–Med | Variants overlay/media/toolbar; CSS `line-clamp` (not dotdotdot); CSS grid (not Isotope); **omit cart hooks** |
| Header/nav | boilerplate `header` + `nav` fragment | Med | Rebuild mobile toggle with real button + `aria-expanded` (fix source a11y gap) |
| Footer | boilerplate `footer` + `footer` fragment | Low–Med | Nav repeat + social (icon-font→SVG) + app badges + legal |
| Promo/Newsletter stub | small block / section | Low | Static only, no backend |

## Media handling (importer rules)
- **Masters-only** — ingest one master per logical image; drop the derivative ladder (EDS regenerates `<picture>`/webp).
- **`<img>` must be a direct child of `<div>`** or EDS won't wrap it.
- Carry **`alt`** (96% coverage) and **`data-caption`** (~53% of images — else captions are lost) into figcaptions.
- Legacy CDN (`cdn.skoda-storyboard.com`) has **no CORS** and no transforms — reference-in-place is fine for a demo render; do any hashing/ingest server-side. For one landing page the in-scope image set is a handful of masters (single-digit MB).

## Explicitly deferred (not in this page)
Working media-cart / zip, live banner ad service, newsletter account system, live social feed, faceted listing / ElasticPress search, story SiteOrigin flattening, full analytics/consent wiring, the other 5 locales.

## Checklist

### 0. Setup & confirm environment
- [ ] Confirm DA org/site (`larsauffarth/skoda-storyboard`) and that DA source API / preview credentials are enabled (Settings → LLM Permissions if a push later 401/403s).
- [ ] Start local preview (`aem up`) against local code + previewed content; confirm boilerplate renders.

### 1. Scrape & analyze the source page
- [ ] Scrape `https://www.skoda-storyboard.com/en/` — capture cleaned HTML, metadata, screenshots, and the in-use image list (masters).
- [ ] Analyze page structure → identify section boundaries and per-section sequences (hero, teaser rails, category rows, carousel-as-cards, stubs).
- [ ] Record block variants needed and their DOM signatures; note which elements become static stubs.

### 2. Build/adapt the blocks
- [ ] Hero block (CSS-only; image + overlay heading; LCP `fetchpriority`).
- [ ] Cards/Teaser block with `overlay` / `media` / `toolbar` variants; CSS line-clamp + CSS grid; cart hooks omitted.
- [ ] Static promo + newsletter stub block/section.
- [ ] Verify each block renders in local preview (snapshot/evaluate, not screenshots).

### 3. Header/nav + footer chrome
- [ ] Author `nav` fragment (brand / mega-menu with 3 nested panels / language switcher + newsletter dropdown as static).
- [ ] Adapt header block for mega-menu + accessible mobile toggle (real button + `aria-expanded`).
- [ ] Author `footer` fragment (nav repeat + social SVG icons + app-download badges + legal bar).
- [ ] Adapt footer block; verify chrome renders around the page.

### 4. Generate import infrastructure
- [ ] Create per-template parser + transformer under `tools/importer/` (content-driven detection only): map hero, teaser rails, category rows, stubs; strip cart/banner/newsletter dynamic hooks; carry `alt` + `data-caption`; ensure `<img>` sits directly under `<div>`.
- [ ] Media step: collect masters-only for in-use images; rewrite `<img>` references; drop derivatives.
- [ ] Run the bundled import script to produce clean DA HTML for the page (do **not** hand-write content HTML).

### 5. Push & publish to DA
- [ ] POST the generated page (and `nav` / `footer` fragment docs) to `admin.da.live/source/larsauffarth/skoda-storyboard/...`.
- [ ] Preview via Sidekick / Bulk Operations (drafts-first); resolve any render errors.

### 6. Validate against the source
- [ ] Compare imported page vs original for content completeness, blocks, media, and metadata (title/description/`image`/hreflang).
- [ ] Visual critique of hero, card rails, header mega-menu, footer at desktop + mobile widths.
- [ ] Confirm images produce optimized `<picture>`/webp and captions/alt survived.
- [ ] Lint (`npm run lint`) and a quick Lighthouse/a11y sanity pass; note any `[RUNTIME-UNCONFIRMED]` items resolved.

### 7. Wrap up
- [ ] Summarize what rendered, what was stubbed/deferred, and the preview link (`{branch}--skoda-storyboard--larsauffarth.aem.page/en`).
- [ ] List follow-ups (Series carousel behavior, dynamic services, remaining templates/locales).

---
*This plan is built in plan mode. Execution (scraping, block edits, import script runs, DA pushes, git) requires switching to Execute mode.*
