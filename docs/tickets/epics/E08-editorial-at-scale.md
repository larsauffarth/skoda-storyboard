# E08 — Editorial at Scale (Phase B)

- **Phase:** B — Editorial at scale (EN) · **Milestone:** **SKODA-801 → M1** (story-flatten is a demo deliverable); 802/803/804 → M2
- **Goal:** With the static architecture proven in the pilot, migrate the *full* EN editorial corpus. This means solving the hardest template (Story / SiteOrigin Page Builder flattening — a **reduced-fidelity slice of which is an M1 demo deliverable** per the exec deck), covering the remaining templates (Škodapedia, press-kits, pages), automating bulk import to DA at scale, and wiring the consent/analytics glue (OneTrust + GTM, including the bespoke `skoda-analytics` event layer) that every interactive block will later depend on.
- **Scope note:** Content and blocks only — no dynamic *services* (search body-relevance, banners, newsletter, media-cart) are built here; those are Phase C. The `skoda-analytics` wiring in SKODA-804 is the vendor/consent + dataLayer *foundation*; the per-block event re-emission rebuild is SKODA-905 (Phase C).

## Tickets
- **SKODA-801 — Story template: SiteOrigin Page-Builder flattening parser** (8SP, **M1**) — flatten nested `so-panel`/`panel-grid`/`so-widget` trees into DA sections + blocks. **Reduced-fidelity slice is an M1 demo deliverable** (blog/story pages in the demo); full-fidelity parser at scale is M2.
- **SKODA-802 — Remaining templates** (8SP) — Škodapedia (terms pre-baked as `/modals/` docs → fully static glossary, no runtime API), press-kits (gallery + downloads, no new blocks), and generic pages.
- **SKODA-803 — Bulk import automation** (8SP) — sitemaps/REST URL discovery → per-template parse → DA source-API push → Bulk Operations preview/publish, at corpus scale.
- **SKODA-804 — Consent + analytics wiring** (5SP) — OneTrust consent gate + GTM (server-side sync), including bootstrapping the `skoda-analytics` dataLayer, loaded in the delayed phase.

## Effort roll-up
- **Total: 29 SP** · AI-assisted ~11–18d / manual ~22–36d *(planning estimates, not a quote)* — SKODA-801 re-pointed 13→8 SP after the flattener POC + census (`SKODA-FLATTENER-POC-FINDINGS.md`).
- Critical path: SKODA-801 (blocks 802 and 803).

## Source-doc traceability
- SKODA-EDS-DA-ARCHITECTURE.md §12 (Phase B roadmap), §4 (Story → flatten SiteOrigin), §10 (import pipeline)
- SKODA-ADVERSARIAL-REVIEW.md §3.1 / C6 (SiteOrigin Page Builder finding — 13–19 panels, story-only)
- SKODA-COMPLEX-SYSTEMS-DEEP-DIVE.md §2.5, §2.6 (consent/analytics + bespoke `skoda-analytics` layer)
- SKODA-SYSTEM-BUILD-SPECS.md §5 (Škodapedia pre-baked `/modals/`), §3 (mediabox → downloads block)
