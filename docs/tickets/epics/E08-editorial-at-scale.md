# E08 — Editorial at Scale (Phase B)

- **Phase:** B — Editorial at scale (EN) · **Milestone:** **SKODA-801 → M1** (story-flatten is a demo deliverable); 802/803/804 → M2
- **Goal:** With the static architecture proven in the pilot, migrate the *full* EN editorial corpus. This means solving the hardest template (Story / SiteOrigin Page Builder flattening — a **reduced-fidelity slice of which is an M1 demo deliverable** per the exec deck), covering the remaining templates (Škodapedia, press-kits, pages), automating bulk import to DA at scale, and wiring the consent/analytics glue (OneTrust + GTM, including the bespoke `skoda-analytics` event layer) that every interactive block will later depend on.
- **Scope note:** Content and blocks only — no dynamic *services* (search body-relevance, banners, newsletter, media-cart) are built here; those are Phase C. The `skoda-analytics` wiring in SKODA-804 is the vendor/consent + dataLayer *foundation*; the per-block event re-emission rebuild is SKODA-905 (Phase C).

## Tickets
- **SKODA-801 — Story template: SiteOrigin Page-Builder flattening parser** (8SP, **M1**) — flatten nested `so-panel`/`panel-grid`/`so-widget` trees into DA sections + blocks. **Reduced-fidelity slice is an M1 demo deliverable** (blog/story pages in the demo); full-fidelity parser at scale is M2.
- **SKODA-802 — Remaining templates** (5SP) — Škodapedia (terms pre-baked as `/modals/` docs → fully static glossary, no runtime API) and generic pages. *(Press kits split out to SKODA-805–808.)*
- **SKODA-803 — Bulk import automation** (8SP) — sitemaps/REST URL discovery → per-template parse → DA source-API push → Bulk Operations preview/publish, at corpus scale.
- **SKODA-804 — Consent + analytics wiring** (5SP) — OneTrust consent gate + GTM (server-side sync), including bootstrapping the `skoda-analytics` dataLayer, loaded in the delayed phase. *(Note: per D10, consent/OneTrust is now OUT of Adobe delivery scope — this ticket's consent portion may reduce to a stub; analytics remains in.)*
- **SKODA-805 — Press Kit template + structured narrative sections** (5SP) — press-kit header + fixed narrative sequence (Intro/Exterior/Interior/Battery/Safety/Connectivity), press-kit parser. Requirements §11.8, MR-PK01/02.
- **SKODA-806 — Press Kit grouped media/download areas + whole-kit ZIP** (5SP) — the five grouped areas (Texts/Infographics/Tech data/Images/Videos) + per-item downloads + whole-kit ZIP via the media-cart reduction service. Requirements §11.11/§11.12, MR-PK04/06/07.
- **SKODA-807 — FAQ block (Press Kit)** (2SP) — accessible Q/A accordion + FAQPage structured data. Requirements §11.10, MR-PK05.
- **SKODA-808 — Press Kit variant subsections + selector + internal categorization** (3SP) — nested variant subsections, variant/bodywork selector, facet metadata. Requirements §11.7/§11.9/§11.14, MR-PK03.
- **SKODA-810 — Company/Page template family (5 sub-types)** (8SP) — board-of-management (exec-bio accordion), annual-reports (download-list), company-logo (brand-asset grid), media-services-application (app-promo), contacts (contact-directory). Five net-new blocks surfaced by the 22-URL analysis (2026-09-14), deferred to M2 per D18.

## Effort roll-up
- **Total: 49 SP** · AI-assisted ~19–31d / manual ~37–62d *(planning estimates, not a quote)* — SKODA-801 re-pointed 13→8 SP after the flattener POC + census (`SKODA-FLATTENER-POC-FINDINGS.md`); Press Kit detail broken out of SKODA-802 into SKODA-805–808 (+15 SP net) after the requirements doc (§11) confirmed it is a structured template, not a reuse-only import (2026-09-11); SKODA-810 (company/Page family, +8 SP) added 2026-09-14 per D18.
- Critical path: SKODA-801 (blocks 802 and 803); SKODA-805 (blocks 806/807/808).

## Source-doc traceability
- SKODA-EDS-DA-ARCHITECTURE.md §12 (Phase B roadmap), §4 (Story → flatten SiteOrigin), §10 (import pipeline)
- SKODA-ADVERSARIAL-REVIEW.md §3.1 / C6 (SiteOrigin Page Builder finding — 13–19 panels, story-only)
- SKODA-COMPLEX-SYSTEMS-DEEP-DIVE.md §2.5, §2.6 (consent/analytics + bespoke `skoda-analytics` layer)
- SKODA-SYSTEM-BUILD-SPECS.md §5 (Škodapedia pre-baked `/modals/`), §3 (mediabox → downloads block)
- SKODA-CLIENT-REQUIREMENTS-MAPPING.md §3.D + §7 (Press Kit §11.8–11.14 → SKODA-805–808 breakout)
- CMS-MediaRoomMigration-Requirements-*.pdf §11 (Press Releases and Press Kits — live Peaq kit structure)
