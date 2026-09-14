# Škoda Storyboard — 22-URL Analysis & Gap Comparison

**Date:** 2026-09-14 · **Method:** structural analysis of each live URL, block-by-block, classified against the built inventory in `tools/importer/` (`page-templates.json`, parsers, transformers) and `docs/SKODA-MASTER.md` §3–§4.

**Legend:** ✅ captured (built & reusable) · 🔵 design variation of a captured block · 🔴 missed / net-new (page type or block not yet built)

---

## 0. Baseline — what we have captured

- **Templates built:** `en-landing` (home), `en-stories` (48 flattened story pages: hero + title + intro/body only — galleries, embeds, media-box **intentionally dropped**).
- **Parsers:** `cards-overlay`, `cards-media`, `cards-social`, `cards-toolbar`, `carousel`.
- **Transformers:** `skoda-cleanup`, `skoda-sections`, `skoda-story-cleanup`.
- **Blocks reused:** `stories`, `story-rail`, `carousel`, `cards-overlay`, `cards-media`, `hero-image`, `header`, `footer`.
- **Known-but-unbuilt (master §4):** faceted listing (High), gallery+lightbox, embeds (YouTube/Vimeo/Buzzsprout/Spotify), Škodapedia, media-cart, promo banner.

---

## 1. Headline findings (read first)

1. **🔴 Series IS a real template — master §3 is WRONG.** Both `/series-2/` (series *directory*, ~20 series cards) and `/series/125-years-of-motorsport/` (single series *hub*, 8 story cards) render as real listing pages, not 301 redirects. This is a **two-level listing page type** we neither captured nor scoped.

2. **🔴 Bucket H — five distinct "Page"-template pages are entirely out of the current M1 plan**, each needing net-new blocks: board-of-management (exec accordion), annual-reports (download list), company-logo (brand-asset grid), media-services-app (app-promo), contacts (contact directory). None reuse existing blocks beyond hero/chrome.

3. **🔵/🔴 Our `en-stories` template silently drops three recurring in-body block types** present in real articles: **image galleries (lightbox), YouTube/Vimeo embeds, and the bottom "Media Box" download gallery.** Fine for the demo's fidelity scope, but the matrix records them as gaps for M2.

4. **✅ One unified listing engine underlies most of the site.** Tag listings, category listings, News, Images, Videos, and the Media Room rails all share **one faceted-listing template** (same filter bar `All/News/Press Kits/Images/Videos`, same "Load more" pagination, same card system). Build it once → covers ~10 of these URLs. Master already rates this High-effort and unbuilt (🔴).

5. **🔴 Press-kit is a hub + chaptered sub-pages, only *partly* "= press_release."** The landing is an index hub (TOC of 8 chapters + resource tabs + ZIP downloads); sub-pages are article-like but carry a **persistent press-kit chapter sub-nav**, technical-spec tables, and an 84-image Media Box. Master §3's "press-kit = filtered press_release view" is true for the *data source*, not the *page structure*.

6. **🔴 Images/Videos listings force the unbuilt gallery-lightbox + Vimeo-embed blocks**, each with per-item media-cart/download actions (Images: "12 / 33,313"; Videos: Vimeo thumbs "12 / 913").

---

## 2. Comparison matrix (one row per URL, sub-rows per block)

### Bucket A — Story detail (template `en-stories`)

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 1 | `/skoda-world/the-versatile-octavia…` | hero + title + body | ✅ | `en-stories` | already imported; report exists |
| 2 | `/skoda-world/how-the-octavia-reached-365-km-h` | hero+body | ✅ | `en-stories` | imported |
| 2 | ″ | **in-body image galleries ×5** (grid) | 🔴 | gallery (unbuilt) | dropped by flatten; M2 |
| 2 | ″ | related-articles rail | ✅ | `story-rail` | bottom rail |
| 5 | `/emobility/whats-behind-epiq-design` | hero+body | ✅ | `en-stories` | imported |
| 5 | ″ | image gallery (5 exterior shots) | 🔴 | gallery (unbuilt) | dropped |
| 5 | ″ | **YouTube embed** | 🔴 | embed (unbuilt) | dropped |
| 5 | ″ | related rail (10 stories) | ✅ | `story-rail` | |
| 5 | ″ | **Media Box** (7 downloadable images) | 🔴 | media-cart / download (unbuilt) | dropped |
| 7 | `/lifestyle/people/olive-oil…` | hero+body | 🔵 | `en-stories` | fits template; **not yet imported** |
| 7 | ″ | **YouTube embed** | 🔴 | embed (unbuilt) | dropped |
| 7 | ″ | 2× lightbox galleries + single image | 🔴 | gallery+lightbox (unbuilt) | dropped |
| 7 | ″ | newsletter block | 🔴 | (out of scope) | dynamic stub |
| 7 | ″ | related rail + tags + Media Box (14 img) | ✅/🔴 | `story-rail` / media-cart | rail ✅, box 🔴 |

**Verdict A:** template ✅ confirmed for all four; #7 should be added to the import set. In-body gallery/embed/media-box are consistent 🔴 gaps (deliberately out of demo fidelity scope).

### Bucket B — Tag & Category listings

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 3 | `/tag/model/elroq/` | model hero + CTAs (Discover/Configure/Images/Videos) | 🔴 | (net-new model-hero) | shares hero with Model detail (G) |
| 3 | ″ | filtered card grid (overlay, load-more "4/31") | 🔴 | faceted-listing (unbuilt) | reuses `cards-overlay` card |
| 4 | `/tag/model/epiq/` | same as #3 | 🔴 | faceted-listing | identical structure ("4/11") |
| 6 | `/category/emobility/` | hero + **facet bar** (All/News/Press Kits/Images/Videos) | 🔴 | faceted-listing (unbuilt) | media-style cards, load-more |

**Verdict B:** one **faceted-listing template** (🔴 High) covers all three; card *cells* reuse `cards-overlay`/`cards-media`. Tag/model listing hero == Model-detail hero.

### Bucket C — Series (⚠ overturns master §3)

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 8 | `/series-2/` | hero + grid of ~20 **series** cards | 🔴 | (net-new: series directory) | second listing level |
| 9 | `/series/125-years-of-motorsport/` | hero (series title+desc) + 8 story cards | 🔴 | (net-new: series hub) | curated story grid, no load-more |

**Verdict C:** **Series is a real 2-level template** (directory → hub). Not a redirect. Cards reuse `cards-*`; the grouping/hub layout is net-new. **Update master §3.**

### Bucket D — Media Room home

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 10 | `/media-room/` | hero (single featured press-kit, overlay) | 🔵 | `cards-overlay` | |
| 10 | ″ | Featured rail (3 cards, overlay grid) | ✅ | `cards-overlay` | like landing promo |
| 10 | ″ | News rail (carousel) | ✅ | `carousel` | + "All" link |
| 10 | ″ | Images rail (3–4 col grid + downloads) | 🔴 | gallery + media-cart | download per tile |
| 10 | ″ | Videos rail (carousel, Vimeo) | 🔴 | carousel + embed | Vimeo thumbs |
| 10 | ″ | Models rail (3-col grid) | 🔵 | `cards-media`/`carousel` | like landing Models |
| 10 | ″ | Press Kits rail (grid) | 🔵 | `cards-overlay`/`carousel` | |
| 10 | ″ | Latest Stories rail (carousel) | ✅ | `stories`/`carousel` | |

**Verdict D:** ~70% assemblable from built rails (as the M1 plan assumed); the **Images & Videos rails need the unbuilt gallery/embed + media-cart** blocks.

### Bucket E — MR listings: News / Images / Videos

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 14 | `/news/` | facet bar + press-release card list + load-more | 🔴 | faceted-listing | same engine as B |
| 16 | `/images/` | **advanced facet bar** (Model/Year/Topic…) + image grid | 🔴 | faceted-listing + gallery | "12/33,313"; download Original/1920px per tile |
| 16 | ″ | lightbox on click + per-tile media-cart | 🔴 | gallery-lightbox + media-cart | unbuilt |
| 17 | `/videos/` | advanced facet bar + Vimeo-thumb grid | 🔴 | faceted-listing + embed | "12/913"; play + download + heart per tile |

**Verdict E:** all three = the **same faceted-listing template** with different card renderers (press-card / image-tile+lightbox / video-tile+embed). Advanced-filter facet set is far richer than the demo subset (D12).

### Bucket F — Press Kits (hub + chaptered sub-pages)

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 11 | `/press-kits/skoda-epiq-press-kit-2/` | hero + intro | 🔵 | `cards-overlay`/hero | |
| 11 | ″ | **TOC of 8 chapters** (thumbnail buttons) | 🔴 | (net-new: kit index) | Intro/Exterior/Interior/Battery/Safety/Connectivity/First-Edition/FAQ |
| 11 | ″ | resource tabs (Texts/Infographics/Tech data/Images/Videos) | 🔴 | (net-new: kit sub-nav) | + ZIP/WhatsApp download |
| 12 | `…/infographics/` | persistent chapter sub-nav | 🔴 | kit sub-nav | shared across sub-pages |
| 12 | ″ | 9 infographic tiles (PDF+JPG download each) | 🔴 | gallery + download | image-gallery page |
| 12 | ″ | related press-releases + tags | ✅ | `story-rail` | |
| 13 | `…/exterior-…/` | hero + article body + exec quote | 🔵 | `en-stories`-like | article structure matches |
| 13 | ″ | in-body infographics + photo carousel + video embed | 🔴 | gallery/carousel/embed | |
| 13 | ″ | **technical-spec table** | 🔴 | (net-new: spec table) | dimensions/equipment |
| 13 | ″ | **Media Box (84 images, 6 PDFs)** | 🔴 | media-cart / download | large |
| 13 | ″ | chapter sub-nav + tags | 🔴/✅ | kit sub-nav / tags | |

**Verdict F:** article sub-pages are `en-stories`-adjacent (🔵) but the **kit hub, persistent chapter sub-nav, spec tables, and large Media Box are net-new (🔴).** Master's "= press_release" holds only for the underlying data, not the page composition.

### Bucket G — Model detail

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 15 | `/skoda-model/peaq/` | hero (model name) | 🔵 | `hero-image` | shares hero family with tag listing (B) |
| 15 | ″ | model description / spec prose | 🔵 | default content | |
| 15 | ″ | News rail (carousel + All) | ✅ | `carousel`/`story-rail` | tag-driven |
| 15 | ″ | Press Kits rail | 🔵 | `carousel` | tag-driven |
| 15 | ″ | Stories rail | ✅ | `story-rail` | tag-driven |
| 15 | ″ | Images rail (Original/1920px downloads) | 🔴 | gallery + media-cart | |
| 15 | ″ | Videos rail (Vimeo) | 🔴 | carousel + embed | |

**Verdict G:** ~mostly assemblable (hero + 5 tag-driven rails), matching the M1 plan. Retrieval = model-tag-driven (🟡 exact rules still open). Images/Videos rails need unbuilt blocks.

### Bucket H — "Page" template variants (🔴 biggest gap — none in current M1 plan)

| # | URL | Block / layout | Status | Maps to | Notes & effort |
|---|-----|----------------|--------|---------|----------------|
| 18 | `/board-of-management/` | 2 groups (Board / Chief Officers) × 4 exec cards | 🔴 | **net-new: exec-bio accordion** | name/title/date/portrait + **expandable "show more" gallery** + CV/photo-set/press/LinkedIn links |
| 19 | `/annual-reports/` | reverse-chron list 2025→2000 | 🔴 | **net-new: download-list** | each: title/year, PDF-cover thumb, PDF link, save-heart |
| 20 | `/company-logo/` | 3 groups × 6 color variants = 36 assets | 🔴 | **net-new: brand-asset grid** | dual PDF+PNG download per asset |
| 21 | `/skoda-media-services-application/` | hero + intro + 2 screenshots + features + QR + app-store badges | 🔴 | **net-new: app-promo** | marketing layout |
| 22 | `/contacts/` | 2 dept groups × contact cards | 🔴 | **net-new: contact directory** | name/title/email/phone/photo/LinkedIn |

**Verdict H:** **5 net-new page types, ~5 net-new blocks.** All share hero + chrome only. This is the batch's largest scope discovery — **absent from the current M1 import plan.**

---

## 3. Totals

| Classification | Count (block-level rows) | Notes |
|---|---|---|
| ✅ captured (reuse as-is) | story template, `stories`/`story-rail`/`carousel`/`cards-*`, MR featured/news/models/press-kit/stories rails | the leverage |
| 🔵 variation of captured | model/press-kit/kit hero, MR overlay hero, article-like kit sub-page | low effort |
| 🔴 missed / net-new | **faceted-listing** (covers B/E/parts of D,G), **gallery+lightbox**, **video/Vimeo embed**, **media-cart/download**, **Series 2-level template**, **press-kit hub + chapter sub-nav + spec table**, **5 Bucket-H page types/blocks** | the work |

**Net-new page types discovered:** Series directory, Series hub, faceted listing (tag/category/news/images/videos), Media Room home, Model detail, Press-kit hub, Press-kit article sub-page, Press-kit gallery sub-page, board-of-management, annual-reports, company-logo, media-services-app, contacts.

**Net-new blocks discovered:** faceted-listing, gallery+lightbox, media-tile (image download), video-tile (Vimeo embed), media-cart action, series-directory/hub grid, press-kit TOC + chapter sub-nav, technical-spec table, exec-bio accordion, download-list, brand-asset grid, app-promo, contact-directory.

---

## 4. Master-doc assumptions confirmed / overturned

| Assumption (source) | Verdict | Evidence |
|---|---|---|
| "Series & Podcast are NOT templates — 301 redirect" (§3) | ❌ **OVERTURNED** for Series | `/series-2/` and `/series/125-years-of-motorsport/` render as real 2-level listing pages |
| "press-kits = filtered view of press_release" (§3) | ⚠ **PARTIAL** | true for data source; page structure adds hub TOC, chapter sub-nav, spec tables, 84-img Media Box |
| Faceted listing = one High-effort engine (§4) | ✅ **CONFIRMED & broadened** | one template underlies tag/category/news/images/videos + advanced facet bar |
| Gallery + lightbox unbuilt, needed (§4) | ✅ **CONFIRMED** | appears in stories, images listing, press-kit sub-pages |
| All video externally hosted (Vimeo/YouTube), no MAM video (§4) | ✅ **CONFIRMED** | videos listing & rails are Vimeo thumbs/embeds |
| Media-cart per-item actions (§4/§6.2) | ✅ **CONFIRMED** | download/heart on every image & video tile |

---

## 5. Recommended updates

### To `docs/SKODA-MASTER.md`
- **§3:** correct the "Series is not a template" line — Series is a **2-level listing template** (directory + hub). Re-check Podcast separately (not in this batch).
- **§3:** refine "press-kit = press_release" to "*data source* = press_release; *page composition* is a distinct hub+chapters+specs+media-box type."
- **§3/§4:** add the 5 Bucket-H "Page" sub-types as named page types (they were lumped under generic "Page, 334 pages, 9.6%").

### To `tools/importer/page-templates.json` (when built, Execute)
- Add templates: `en-listing` (faceted, covers tag/category/news), `en-images`, `en-videos`, `en-mediaroom`, `en-model`, `en-series` (directory), `en-series-hub`, `en-press-kit` (+ sub-page variants), and the Bucket-H set (`en-board`, `en-annual-reports`, `en-company-logo`, `en-app`, `en-contacts`).

### To the M1 import plan (`m1-demo-import-preparation.md`)
- **Confirmed on-plan:** Media Room home (D), Model page (G), Press Release detail, Press Kit (F) — all validated as real, mostly-assemblable types.
- **Newly surfaced, not on-plan — flag for scope decision:** Series (2-level), the faceted-listing engine as a prerequisite for MR rails/Images/Videos, and the **5 Bucket-H page types**. Recommend: keep Bucket H + Series **out of M1** (Tier-3/M2) unless the demo narrative needs them; ensure MR-home's Images/Videos rails are scoped with the gallery/embed/media-cart dependency (ties to D2/D5).

---

*Machine-readable version: `url-analysis-matrix.json` (same directory).*
