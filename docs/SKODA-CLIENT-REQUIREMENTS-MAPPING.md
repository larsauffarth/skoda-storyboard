# Škoda Media Room & Storyboard — Client Requirements Mapping (Requirements Doc v110926)

*Maps every requirement in the client's "Media Room Migration – Requirements" doc (DRAFT baseline, 90% completeness claim, due 25.09.2026) against what we have already identified/analysed and, where relevant, already built in the EN test migration. Each row carries a **Status**.*

**Date:** 2026-09-11 · **Companion to:** `SKODA-MASTER.md` (canonical findings), `SKODA-DELIVERY-PLAN.md` (milestones/decisions), `docs/tickets/OVERVIEW.md` (backlog). **Source requirement doc:** `docs/CMS-MediaRoomMigration-Requirements-110926-1118-1348.pdf`.

> **Note on scope framing:** the client doc is a **full target-state requirements baseline** (everything the eventual solution must do). Our existing work is scoped to a **capability pilot / 15 Oct demo** (M1) plus a **02 Jan 2027 go-live** (M2), tracked as 48 tickets / 207 SP across 10 epics (updated 2026-09-11: Press Kit detail broken out into SKODA-805–808). Many items the client lists as requirements we have deliberately deferred to a later phase — that is a *phase* status, not a gap in understanding. The doc's own Section 9 ("Out of Scope / Likely Deprecated") already aligns closely with our phasing.

> **Decision-log alignment (2026-09-10/11):** statuses below reflect the current `SKODA-DELIVERY-PLAN.md` §8 decision log (D1–D16), including the **media-cart reframe** (D2 — purpose is server-side file-size *reduction* for download, not just client-side zip bundling; WordPress is being switched off) and **consent/OneTrust now OUT of Adobe delivery scope** (D10 — stays with Škoda; analytics stays in). The QR-code restricted-article access is added here as **D17 (new)**.

---

## Status legend

| Status | Meaning |
|---|---|
| ✅ **Built** | Implemented & published on the EN test migration (`/en/`) |
| 🟢 **Solvable** | Clear EDS/DA path, analysed & ticketed; no blocker |
| 🔵 **Solvable-as-service** | Needs a rebuild-as-service or external integration (analysed, path known) |
| 🟠 **Open — decision** | Blocked on a client decision / TBD in our decision log (D1–D17) |
| 🟡 **Open — needs input** | Needs client walkthrough / a live example / spec before we can finalise |
| 🔴 **Deferred / out-of-scope (this phase)** | Real requirement, explicitly later-phase or candidate for removal |

---

## 1. Common — Stories & Media Room (§5.1, COM01–COM19)

| ID | Requirement | What we've identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| COM01 | Site Header | Header block + `nav` fragment built; topbar (Stories/Media Room/Subscribe + lang), brand SVG wordmark, mega-menu = nested link lists | SKODA-301/302 | ✅ Built (Stories nav); Media Room nav variant 🟢 |
| COM02 | Section Switcher (Stories ↔ Media Room) | Topbar Stories/Media Room links built; active-section state + Media Room destination pending | SKODA-301 | 🟢 Solvable |
| COM03 | Primary Navigation (materially different nav sets per section) | Stories nav built (Models/eMobility/Lifestyle/Škoda World/Series/Škodapedia/Podcast). Media Room nav (News/Press Kits/Models/Images/Videos/Company) not yet built | SKODA-301 | 🟢 Solvable |
| COM04 | Model / Secondary Navigation | Nested-list mechanism proven; exact structure TBD by client | SKODA-301 | 🟡 Open — structure to confirm |
| COM05 | Language / Country Selector (expose only authored variants) | Switcher built (EN/CS/DE/SK/SR/SL). "Show only existing languages per item" rule identified (hreflang/metadata signal) — pilot is EN | SKODA-303 / 1003 | 🟠 Open — D1 (locale scope) / rule to confirm |
| COM06 | Global Search | ElasticPress today; EDS path = query-index + client search (index-only). Ranking/searchable-types TBD | SKODA-403 / 901 | 🟠 Open — D6 (index-only vs hosted) |
| COM07 | Listing / Filtering (facets vary by type) | **15 taxonomy facets** enumerated; faceted listing + load-more is the hardest pilot block. Metadata needs a normalization layer | SKODA-401/402 | 🟢 Solvable (facet subset — D12) |
| COM08 | Content Card (Story/News/Series/Model/Media variants) | Card variants built: `cards-overlay`, `cards-media`(+social), `cards-toolbar`, carousel overlay/caption variants | SKODA-201 | ✅ Built (Story/Series/Model); News/Media card variants 🟢 |
| COM09 | Hero / Page Banner (multiple variants; full-width only Stories?) | `hero-image` block built; multiple variants identified | SKODA-202 | 🟢 Solvable |
| COM10 | Carousel / Slider (used extensively) | `carousel` block built (drag/arrows/scroll-snap, overlay+caption variants); reused via `buildBlock` for rails | SKODA-201 | ✅ Built |
| COM11 | Pagination / Load More (currently 6) | "Load more" built on Latest Stories; 6-per-click pattern identified for Media Room listing | SKODA-402 | ✅ Built (Stories); listing load-more 🟢 |
| COM12 | Media Preview — Actions (lightbox, a11y) | Gallery + lightbox modal ticketed; a11y focus-trap `[RUNTIME-UNCONFIRMED]` | SKODA-203 | 🟢 Solvable (a11y follow-up) |
| COM13 | Media Download (single/multi, renditions) | Static Downloads block (mediabox); masters-only ingest; DAM = AEM Assets | SKODA-501/502 | 🟢 Solvable |
| COM14 | Media Cart (add/retain across browsing) | **Mission-critical for demo.** Device-ID, no login. Demo cart state client-side; **download-size reduction is server-side (App Builder / AEM Assets renditions)** per D2 reframe — client-side zip demoted | SKODA-505 / 902 | 🔵 Solvable-as-service (D2) |
| COM15 | Social Share (configurable channels; page + footer) | Channels identified (X/Pinterest/LinkedIn/Facebook/WhatsApp); footer social icons built | SKODA-304 | 🟢 Solvable |
| COM16 | Subscription / Newsletter | 10-route subscriber account (mailguide.cz) today; `newsletter-stub` built; real ESP integration deferred | SKODA-904 | 🔴 Deferred — D4; provider TBD |
| COM17 | Cookie / Consent | OneTrust today. **D10: consent is OUT of Adobe delivery scope** (stays with Škoda); pilot ships a delayed-script stub only | SKODA-804 | 🔴 Out of Adobe scope (D10); stub built |
| COM18 | Footer (standard Škoda pattern, app badges, 4 social, full sitemap) | **Built** — dark-green footer, 7-col nav grid, FB/IG/YT/WhatsApp icons, app-store badges, legal row | SKODA-304 | ✅ Built |
| COM19 | App download Badge (mobile download / desktop link) | App-store badges built in footer | SKODA-304 | ✅ Built |

---

## 2. Storyboard Functional Requirements (§5.2)

### A. Storyboard Homepage (STO-H01–H09)

| ID | Requirement | What we've identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| STO-H01 | Promotional / Featured Carousel | **Built** — index-driven `stories` block, `variant: promo` (1 big + 2 small ≥900px; JS timed carousel on mobile). Manual-curation-vs-auto still open | SKODA-201 | ✅ Built (curation 🟠 §10 Q11) |
| STO-H02 | Latest Stories | **Built** — `stories` block, query-index driven, newest 5, press-releases excluded, Load more | SKODA-402 | ✅ Built |
| STO-H03 | Models Slider | **Built** — static carousel-caption rail (links to taxonomy pages). Source/order TBD | SKODA-201 | ✅ Built (source 🟡) |
| STO-H04 | eMobility Stories Slider | **Built** — `story-rail`, tag-filtered (category=emobility), auto-populated via carousel | SKODA-402 | ✅ Built |
| STO-H05 | Lifestyle Stories Slider | **Built** — `story-rail` (category=lifestyle) | SKODA-402 | ✅ Built |
| STO-H06 | Škoda World Stories Slider | **Built** — `story-rail` (category=skoda-world) | SKODA-402 | ✅ Built |
| STO-H07 | Series Slider (image-only clickable; different style; no date; sort TBD) | **Built** — static carousel-caption (undated, 16px/600 below image). Text-clickability + sort logic open | SKODA-201 | ✅ Built (sort/clickability 🟡) |
| STO-H08 | Latest News | **Built** — `story-rail` (category=press-releases). Source/continued-requirement is a new open Q (§10 Q12) | SKODA-402 | ✅ Built (scope 🟡) |
| STO-H09 | Social Media (approved channels) | **Built** — `cards-media` social variant (static, dark). `ys-social-feed` confirmed *not* live today | SKODA-201 | ✅ Built (static); live feed 🔴 |

### B. Story Category / Subcategory Pages (STO-C01–C05)

| ID | Requirement | What we've identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| STO-C01 | Category Hero | Hero block variants; category hero not yet assembled as a page template | SKODA-202 | 🟢 Solvable |
| STO-C02 | Story Results Grid | query-index + listing pattern; retrieval by category proven (rails use it) | SKODA-402 | 🟢 Solvable |
| STO-C03 | Story Card | Card variants built | SKODA-201 | ✅ Built (component) |
| STO-C04 | Pagination Status (current/total) | Load-more built; total-count display is a listing detail | SKODA-402 | 🟢 Solvable |
| STO-C05 | Load More | Built on homepage; reusable on category pages | SKODA-402 | ✅ Built (component) |

*Category page **template** itself is not yet assembled — deferred (§9 "not every template rebuilt this phase").* 🔴 later-phase template

### C. Series Page (STO-S01–S03) · D. Storyboard Model Page (STO-M01–M05)

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| STO-S01–S03 | Series hero / grid / card | Card + hero + grid components exist; Series page template not assembled; ordering/source TBD | SKODA-201/202 | 🟢 components / 🔴 template later-phase |
| STO-M01–M05 | Model hero / featured model / model-related stories grid / card / load-more | Components exist; **model page is a named M1 demo target** ("Media Room home + one Model page"); association is metadata-tag-driven (recommendation logic in scope, personalization out) | SKODA-201/402 | 🟢 Solvable (M1 target) |

### E. Story Detail Page (STO-D01–D10)

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| STO-D01 | Story Hero (title/image/perex/date/category) | 48 story pages imported with this metadata; hero on detail page | SKODA-202/603 | ✅ Built (content imported) |
| STO-D02 | Rich Text (flexible composition) | Story = SiteOrigin Page Builder → **flatten** (de-risked: 17 widget types, 98.7% simple). Pilot imported stories are flattened | SKODA-801 | 🟢 Solvable (flatten proven) |
| STO-D03 | Embedded Video (+ consent) | Embed autoblock (Vimeo/YouTube/Buzzsprout/Spotify), `dnt=1`, lazy. Consent relationship TBD (D10 — consent w/ Škoda) | SKODA-204 | 🟢 Solvable |
| STO-D04 | Image Carousel / Gallery (auto-play) | Gallery + lightbox; auto-play a11y (pause control) flagged | SKODA-203 | 🟢 Solvable (a11y) |
| STO-D05 | Newsletter Widget | `newsletter-stub`; real provider deferred | SKODA-904 | 🔴 Deferred — D4 |
| STO-D06 | Related Stories (tag-matched) | Tag-based aggregation **in scope** (personalization out); story-rail proves the pattern | SKODA-402 | 🟢 Solvable |
| STO-D07 | Article Sidebar | Identified (related/promo/subscription); responsive treatment needed | SKODA-201 | 🟢 Solvable |
| STO-D08 | Side Banner | Bespoke per-market ad server today; **drop/challenge for pilot** | SKODA-903 | 🔴 Deferred — D3 |
| STO-D09 | Media Box / Gallery (download, add-to-cart single+group, default 8) | Downloads block + media-cart; mediabox source known | SKODA-502/505 | 🔵 Solvable-as-service |
| STO-D10 | Social Share | Share channels identified | SKODA-304 | 🟢 Solvable |

---

## 3. Media Room Functional Requirements (§5.3 — marked WIP)

### A. Media Room Homepage (MR-H01–H10)

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| MR-H01 | Featured / Promotional Content | Promo pattern proven on Stories homepage (index-driven); Media Room home is a **named M1 demo target** | SKODA-201/603 | 🟢 Solvable (M1 target) |
| MR-H02 | News | query-index news card/slider; story-rail pattern reusable | SKODA-402 | 🟢 Solvable |
| MR-H03 | Images (preview/download) | Downloads + lightbox + masters-only ingest; DAM = AEM Assets | SKODA-203/501/502 | 🟢 Solvable |
| MR-H04 | Videos | Vimeo/YouTube embeds + separate downloadable file (dual path §11.5) | SKODA-204/503 | 🟢 Solvable |
| MR-H05 | Models | Model rail/card built (Stories); reuse for Media Room | SKODA-201 | ✅ component / 🟢 |
| MR-H06 | Press Kits | Press Kit card; listing shares search template (§11.6) | SKODA-402/802 | 🟢 Solvable (fields 🟡) |
| MR-H07 | Latest Stories | `stories` block reusable | SKODA-402 | ✅ component |
| MR-H08 | Media Cart | Demo cart (device-ID); reduction server-side (D2) | SKODA-505 | 🔵 Solvable-as-service |
| MR-H09 | Media Lightbox | Lightbox | SKODA-203 | 🟢 Solvable |
| MR-H10 | Contacts / Company Content | Sidebar/contacts block; placement TBD | SKODA-201 | 🟡 Open — placement |

### B. Shared Listing Pattern (MR-L01–L06)

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| MR-L01 | Listing Search | query-index search; relationship w/ global search TBD | SKODA-403 | 🟠 Open — D6 / §10 Q9 |
| MR-L02 | Content-Type Filter (All/Stories/News/Press Kits/Images/Videos) | **Definitive taxonomy confirmed** from live markup (§11.6) — one shared listing component parameterized by type | SKODA-402 | 🟢 Solvable |
| MR-L03 | Faceted Filters (model, bodywork, category…) | 15 facets enumerated; needs metadata-normalization layer (build-confirmed not clean in markup) | SKODA-401 | 🟢 Solvable — normalization effort (D12 subset) |
| MR-L04 | Result Grid/List | Card + grid components | SKODA-201/402 | 🟢 Solvable |
| MR-L05 | Result Card (per type) | Card variants; per-type definitions to finalise | SKODA-201 | 🟡 Open — finalise per type |
| MR-L06 | Pagination / Load More (6-per-click, total count, sort asc/desc) | Load-more built; sort + total-count are §10 Q5 open items | SKODA-402 | 🟢 Solvable (sort UX 🟡) |

### C. Press Release / News (MR-PR01–07) — see also §11

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| MR-PR01 | Press Release Header | Press-release = 47.5% of pages, structurally like story; **pilot validates on a press-release article**. No live detail snapshot reviewed yet (§11.1) | SKODA-603/801 | 🟢 Solvable (🟡 verify vs live) |
| MR-PR02 | Structured Article Content | Controlled structure; final authoring model TBD (DA vs UE — D13) | SKODA-802 | 🟠 Open — D13 |
| MR-PR03 | AI-Generated Audio Reading | External embed today; reproduce as-is, don't rebuild vendor (§11.2, §9) | — | 🔴 Deferred — vendor TBD |
| MR-PR04 | PDF Download (citation-ready) | Link/DAM handling; authored-vs-generated TBD | SKODA-503 | 🟡 Open — generation approach |
| MR-PR05 | Infographic (preview→PDF) | Preview-image-to-PDF pattern identified (also §11.4/11.11) | SKODA-502 | 🟢 Solvable |
| MR-PR06 | Video (playback + source download) | Dual path (embed + downloadable) identified | SKODA-204/503 | 🟢 Solvable |
| MR-PR07 | Media Downloads | Downloads block; DAM = AEM Assets | SKODA-502 | 🟢 Solvable |

### D. Press Kit (MR-PK01–07) — expanded in §11.8–11.14

| ID | Requirement | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| MR-PK01 | Press Kit Header | Press-kits = filtered view of press_release (not a CPT). Structure confirmed on live Peaq kit | SKODA-805 | 🟡 Open — needs walkthrough (§10 Q6) |
| MR-PK02 | Structured Narrative (fixed sections) | Fixed sequence confirmed (Intro/Exterior/Interior/Battery/Safety/Connectivity); required-vs-conditional per product type TBD (§11.8) | SKODA-805 | 🟡 Open — fixed vs conditional |
| MR-PK03 | Variant / Bodywork Selector | Variant subsection confirmed (§11.9); interaction TBD | SKODA-808 | 🟡 Open |
| MR-PK04 | Grouped Content (Texts/Infographics/Tech data/Images/Videos) | 5 grouped areas confirmed (§11.11); tabs/accordion/stacked = design detail | SKODA-806 | 🟢 Solvable (presentation TBD) |
| MR-PK05 | FAQ | First FAQ pattern in the doc (§11.10); per-kit vs shared pool TBD | SKODA-807 | 🟡 Open |
| MR-PK06 | Individual Asset Download | Downloads block | SKODA-502/806 | 🟢 Solvable |
| MR-PK07 | Complete Press Kit ZIP | Whole-kit zip (§11.12) — same non-EDS-native download problem as media-cart; ties to D2 reduction/packaging | SKODA-806/902 | 🔵 Solvable-as-service |

### E–G. Model / Images / Videos (MR-M01–07, MR-I01–05, MR-V01–04)

| Group | Requirement summary | Identified / built | Ticket(s) | Status |
|---|---|---|---|---|
| MR-M01–07 | Media Room model page + 5 related-content strips (news/press-kits/stories/images/videos) | Tag-driven aggregation in scope; model page is M1 target; retrieval rules TBD | SKODA-402 | 🟢 Solvable (retrieval rules 🟡) |
| MR-I01–05 | Image listing / filters / preview / rendition download / add-to-cart | Listing + lightbox + downloads + cart; **Original/1920px dual-rendition** pattern identified; rendition strategy ties to D2 | SKODA-203/402/505 | 🟢 Solvable / 🔵 (cart) |
| MR-V01–04 | Video listing / filters / playback / download | Embeds + downloadable file; DAM/source-file model TBD | SKODA-204/503 | 🟢 Solvable |

---

## 4. Editorial / Authoring / DAM (§6 — WIP)

| § | Requirement | Identified | Ticket(s) | Status |
|---|---|---|---|---|
| 6.1 | Reusable page structures / templates (10 families) | Template families mapped to EDS fit-scale (press-release 🔵, story 🟠-flatten, page 🟢, Škodapedia 🔵, listing 🔵). "New page w/o dev" = DA/EW authoring | SKODA-801/802 | 🟠 Open — DA vs UE (D13) |
| 6.2 | Content creation & config (blocks, variants, sources, metadata) | Controlled component variants built. **Layout-mode editability fix shipped** — `scripts/optimized-picture.js` optimizes images *in place* so featured/carousel/social images stay editable; index-driven blocks (`stories`/`story-rail`) edited via config rows in Content mode (inherently not layout-editable) | SKODA-201 | ✅ editability fix built; model choice 🟠 D13 |
| 6.3 | Preview & publishing lifecycle (+ update/unpublish/schedule/review/pre-pub) | Preview/publish proven (DA source-API + bulk-op). Scheduled/review/embargo not native → **staged-publish** recommended | SKODA-602 | 🟢 (core) / 🟠 (embargo D9) |
| 6.4 | Roles & permissions (7 user groups) | Governance layer explicitly **later-phase** (§9); role mapping TBD (RACI = D15) | — | 🔴 Deferred — role mapping open |
| 6.5 | Restricted pre-publication content (secured folder) | = **content embargo** (D9). Confirmed real 2026-09-10 ("restricted folders for new-car launches"). No native EDS gate → staged-publish | — | 🟠 Open — D9 |
| 6.6 | Restricted article access — end users (QR-code journey) | Access model fully open (auth? unique QR? expiry? entitlement?). No end-user auth today. **Added as new decision D17** | — | 🟡 Open — D17 (model undefined) |
| 6.7 | Auditability (change history) | Assumed via AEM/EDS authoring setup; needs technical validation (relates to D16 NFRs) | — | 🟡 Open — validate capability |
| 6.8 | Language & market setup (locale list, HQ vs local, fallback) | Per-locale trees + EW Translation; "selector shows only existing languages" confirmed | SKODA-1001/1002/1003 | 🟠 Open — D1 (locale scope) |
| 6.9 | DAM (images/videos/PDFs/infographics; rendition/rights/reuse) | **AEM Assets = approved source (D5 resolved).** Masters-only ingest; asset-mapping manifest. Source masters ~40 MB → **media pre-conditioning required** (content-bus 409). Dynamic Media TBD. Rights not machine-readable (no EXIF) | SKODA-501/504/506 | 🔵 Solvable (Dynamic Media 🟠) |

---

## 5. Content Migration (§7 — TBD) & Non-Functional (§8 — TBD)

| ID / § | Requirement | Identified | Ticket(s) | Status |
|---|---|---|---|---|
| MIG01–07 | Inventory, migrate historical content+media, map structures, preserve metadata/URLs/asset-links, validate | Scale measured (~13.3k editorial / ~28.3k media). Import infra built (parsers/transformers, DA push). **Bulk automated migration explicitly out-of-scope this phase (§9)** — sample content by hand; **full migration = WordPress switched off** (D7) | SKODA-601/602/803 | 🟢 Solvable / 🔴 bulk deferred |
| 8.1 | URL & SEO (preserve URLs, redirects, canonical, sitemap) | Redirects sheet planned; cross-locale redirects unstable + 8 dead EN URLs flagged; EDS ships canonical HTML (SEO gain). Redirect *execution* = pre-go-live task (§9) | SKODA-103 | 🟢 Solvable / 🔴 full redirect map deferred |
| 8.2 | Analytics & tracking (12 event types) | `skoda-analytics` = bespoke ~140 KB dataLayer over GTM. **D10: analytics IN Adobe scope** (GA+FB+Yoast baseline; confirm bespoke-layer need). Pilot = block hooks + stubs | SKODA-804/905 | 🟠 Open — D10 |
| 8.3 | Cookie consent (accept/reject/manage; respect state) | OneTrust. **D10: consent OUT of Adobe delivery scope** — stays with Škoda (complex integration) | — | 🔴 Out of Adobe scope — D10 |
| 8.4 | Newsletter / subscription (secure, consent) | 10-route account today; ESP integration deferred | SKODA-904 | 🔴 Deferred — D4 |
| 8.5 | Performance (Core Web Vitals) | Mobile Lighthouse **48** measured on `/en/`; root-cause + fix plan drafted. **Shared index-fetch shipped** (`scripts/query-index.js` memoizes the query-index across `stories`+`story-rail`, 5 fetches → 1). Remaining CLS/LCP/reflow items ticketed. Target ≥90 | SKODA-702 | 🟢 Solvable (partial fixes shipped) |
| 8.6 | Accessibility (nav/forms/filters/carousels/modals/media/cards) | Mobile-nav ARIA gap + carousel/modal focus-trap flagged `[RUNTIME-UNCONFIRMED]`; a11y audit ticketed. WCAG level TBD | SKODA-302/703 | 🟢 Solvable (target level 🟡) |

---

## 6. Out of Scope / Deprecated (§9) & Open Questions (§10) — alignment check

**§9 — Client's own scope cuts largely match our phasing:**

| Client statement (§9) | Our position | Status |
|---|---|---|
| Podcast no longer used — candidate for removal | Podcast is not a template (301s into story/PR); safe to drop | 🔴 Agreed drop |
| Some homepage category stripes not retained | Aligns with controlled-simplification | 🟠 confirm which |
| App integration may be obsolete; RSS continuity desirable | RSS feed deferred (needs feed generator + migrated articles) | 🔴 Deferred |
| Škodapedia continues *outside* Storyboard | Matches our finding; glossary block still ticketed (SKODA-206) if needed | 🟢 aligned |
| Full site page coverage NOT this phase (subset: MR home + 1 Model, extendable) | Exactly our capability-pilot framing | ✅ aligned |
| Backend depth (roles/embargo/audit/market editing) later phase | Matches our M2/Phase C deferrals | ✅ aligned |
| Bulk/automated migration out (sample only) | Matches (SKODA-803 deferred) | ✅ aligned |
| Visual redesign out (as-is fidelity) | Matches — our build is pixel-matched to source | ✅ aligned |
| Recommendation: tag-based aggregation IN, personalization OUT | Matches (story-rail is tag-driven; no ML). The 3 functions Markus flagged "not OOTB" (exclude-from-listings, multi-category placement, manual+tag recs) are **already built** on `/en` | ✅ aligned |
| Full localization tooling later; one locale for PoC | Matches (EN built; CS for demo) | ✅ aligned |
| Third-party rebuilds out (audio/newsletter/app-RSS reproduced as-is) | Matches | ✅ aligned |
| Search + redirect *execution* pre-go-live (stub acceptable) | Matches (index-only pilot) | ✅ aligned |

**§10 — Client's 12 open questions vs our decision log:**

| §10 Q | Our mapped decision / answer | Status |
|---|---|---|
| Q1/Q2 Cart (cross-section, persistent icon, downloads page, CTAs per type) | D2 (device-ID, no login; **download reduction server-side**); cart-page structure needs design | 🟡 Open — UX detail |
| Q3 Share at site vs page level | Both identified (COM15) | 🟡 confirm |
| Q4 Advanced filter deep-dive | 15 facets enumerated; needs display-logic walkthrough (facet subset = D12) | 🟡 Open |
| Q5 Media Room 2-col/6-card, total count, +6 on view-more, sort | Listing pattern known; sort/count are listing details | 🟢 Solvable |
| Q6 Press kits walkthrough | Need live walkthrough (also MR-PK) | 🟡 Open |
| Q7 Subscription in scope? Registration steps? Stories vs Newsletter wording | D4 open; provider TBD | 🟠 Open |
| Q8 Footer app links (Škoda Media Room iOS/Android) | Badges built | ✅ Built |
| Q9 Search ranking + whether MR home search is narrower | D6; ranking TBD | 🟠 Open |
| Q10 Definitive locale list + missing-translation fallback | D1; "show only existing" rule identified | 🟠 Open |
| Q11 Featured curated vs most-recent + count | STO-H01 built as most-recent index-driven; curation is the open call | 🟠 Open |
| Q12 "Latest News" source + in scope? | Built as press-release rail; **flagged same open Q by us** | 🟡 Open — confirm |

---

## 7. New / expanded decisions surfaced by this requirements doc

| # | Decision | Origin | Recommendation | Status |
|---|---|---|---|---|
| **D17 (new)** | **Restricted article access for end users via QR-code journey** (§6.6) — model fully undefined: auth required? unique vs shared QR? expiry? subscriber/entitlement validation? access duration? forwarding behaviour? | This doc, §6.6 | Distinct from author-side embargo (D9). No end-user auth exists today; EDS has no native gated delivery. Treat as an M2+ investigation; scope only once the business clarifies the access model. Add to `SKODA-DELIVERY-PLAN.md` §8. | 🟡 Open — needs client input |

*(D1–D16 already tracked in `SKODA-DELIVERY-PLAN.md` §8. This doc adds D17.)*

**Press-Kit detail (§11.8–11.14) — broken out into E08 tickets (2026-09-11):** previously rolled into SKODA-802 "remaining templates" as a reuse-only import, the §11 detail confirmed it is a *structured* template. Now split into four dedicated tickets:

| Ticket | Covers | Requirements | SP |
|---|---|---|---|
| **SKODA-805** | Press Kit template + fixed narrative sections (Intro/Exterior/Interior/Battery/Safety/Connectivity) + header + parser | §11.8, MR-PK01/02 | 5 |
| **SKODA-806** | Five grouped media/download areas (Texts/Infographics/Tech data/Images/Videos) + per-item downloads + whole-kit ZIP | §11.11/§11.12, MR-PK04/06/07 | 5 |
| **SKODA-807** | FAQ block (accessible Q/A accordion + FAQPage structured data) | §11.10, MR-PK05 | 2 |
| **SKODA-808** | Variant/bodywork subsections + selector + internal categorization (facet metadata) | §11.7/§11.9/§11.14, MR-PK03 | 3 |

SKODA-802 slimmed 8→5 SP (Škodapedia + generic pages only); E08 grew 29→41 SP; program 190→207 SP. The **fixed-vs-conditional-sections question (§11.8)** is the key modelling decision carried on SKODA-805 (required fields vs optional/conditional) and needs a live press-kit example (§10 Q6 / §11.1) before the template is locked.

---

## 8. Client "90% complete" cross-check — where the remaining ~10% sits

The client marks the doc a DRAFT baseline at ~90% completeness. The sections **they themselves** flag as WIP/TBD/unverified — i.e. the genuine remainder — are:

- **§5.3 Media Room Functional Requirements — "WIP"** (the entire Media Room functional set is provisional).
- **§6 Editorial / Authoring / DAM — "WIP"** (roles, embargo, QR access, audit, locale model, DAM/Dynamic Media all open).
- **§7 Content Migration — "TBD"** (volumes, retention/exclusion, automation, transformation, reconciliation deferred to the migration team).
- **§8 Non-Functional — "TBD"** (analytics platform, CMP, subscription provider, performance thresholds, WCAG level all unconfirmed).
- **§11.1** — press-release detail requirements are **reported business behaviour, not yet verified against a live page** (a live example is requested as a next step).
- **§10** — 12 explicitly-open questions (cart structure, filters, press-kit walkthrough, subscription, search ranking, locales, curation, Latest News source).

**Net:** the ~90% that is solid is the *functional-frontend* surface (Common + Storyboard, §5.1–5.2), which is exactly where our build is strongest (largely ✅/🟢). The remaining ~10% is concentrated in **authoring/governance, DAM depth, migration mechanics, NFRs, and the un-walked Press-Kit/Press-Release detail** — matching our own 🟠/🟡/🔴 clusters. No contradictions between their draft and our analysis.

---

## 9. Headline read for the client

- **The doc is well-aligned with our analysis.** Its §9 scope cuts and §10 open questions map almost one-to-one onto our decision log (D1–D17) and phase split — no surprises, no contradictions.
- **A large share of the *common* + *Storyboard homepage* surface is already built and published** on the EN test migration (header, footer, nav, hero, cards, carousel, featured promo, latest stories, 4 tag-rails, social, app badges, 48 imported stories) — plus the Layout-editability fix and the shared-index-fetch perf fix.
- **The genuinely hard items are the same three we already flagged:** (1) faceted listing/search over a normalized 15-facet index, (2) the media-cart / whole-kit-ZIP **download-size reduction** (non-EDS-native, now server-side per D2 — covers both COM14 and PK07), and (3) the backend-as-service rebuilds (newsletter, banners, analytics) which the client themselves defer.
- **New/expanded in this doc vs our prior corpus:** the Press-Kit detail structure (§11.8–11.14), the **QR-code restricted-article end-user access** (§6.6 → new **D17**), and the explicit "Latest News on Stories side" question — all captured as 🟡 needs-input above.

---

## 10. Cross-references

- `SKODA-MASTER.md` — canonical findings (block inventory, complex systems, media, architecture).
- `SKODA-DELIVERY-PLAN.md` §8 — decision log D1–D16 (this doc adds **D17**).
- `docs/tickets/OVERVIEW.md` — 43-ticket / 190-SP backlog referenced in the Ticket(s) columns.
- `SKODA-MEDIA-CART-DOWNLOAD.md` — media-cart / download-reduction options (D2).
- `SKODA-EDS-DA-ARCHITECTURE.md` §6 — DA/EW Layout-editability (relevant to §6.1/6.2, D13).
- Source: `docs/CMS-MediaRoomMigration-Requirements-110926-1118-1348.pdf`.
