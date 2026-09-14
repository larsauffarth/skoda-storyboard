# SKODA-207 — Series template (2-level: directory + hub)
- **Epic:** E02 — Core Blocks
- **Type:** template / import
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (demo)
- **Estimate:** 3 SP · AI-assisted 1–2d / manual 2–4d *(planning estimate, not a quote)*

## Summary
Assemble the **Series** page type, confirmed by the 22-URL analysis (2026-09-14) to be a real **two-level template**, not the 301-redirect the master doc previously assumed. Level 1 is a series **directory** (`/series-2/`, ~20 series cards); level 2 is a series **hub** (`/series/<slug>/`, e.g. `125-years-of-motorsport`, a curated grid of the stories in that series). Pulled into M1 (decision D18) because it reuses already-built primitives and adds visible demo breadth.

## Description
Verified live (`.migration/plans/url-analysis-comparison.md`, Bucket C):
- **Series directory** — hero + a grid of ~20 series cards (image + series title + short description), each linking to its hub.
- **Series hub** — hero (series title + description) + a curated grid of story cards (8 on the motorsport hub); no "load more" (curated set, not a paginated feed).

Both levels reuse the existing `cards-overlay`/`cards-media` card cells, `hero-image`, and the grid layout; the only net-new bits are the two grouping layouts (directory-of-series and hub-of-stories) and the retrieval/ordering signal.

## Requirements / Spec
- Directory page: hero + series-card grid; each card links to a hub. Source/order of series TBD (same open question flagged on STO-H07).
- Hub page: hero (title + description) + curated story-card grid; membership is per-series (tag/taxonomy-driven via query-index, consistent with `story-rail`).
- Reuse `cards-*` + `hero-image`; no bespoke card markup invented.
- Parser/transformer: detect the two Series source layouts, map to DA sections + one canonical Metadata block (template=series / series-hub, title, description, image).
- Correct the stale "Series is not a template" claim wherever it appears (done in SKODA-MASTER §3, this ticket tracks the build).

## Acceptance Criteria
- [ ] Series directory renders hero + series-card grid; cards link to their hubs.
- [ ] A series hub renders hero + the curated story-card grid in the source order.
- [ ] Cards reuse the existing card variants (no new card CSS beyond layout).
- [ ] Parser output for `/series-2/` + one hub (`125-years-of-motorsport`) matches source structure in local preview.
- [ ] Metadata block carries template/title/description/image; passes lint.

## Dependencies
- Upstream: SKODA-201 (cards), SKODA-202 (hero), SKODA-402 (query-index retrieval pattern used by the hub), SKODA-601 (import infra/parser conventions)
- Downstream: SKODA-1001 (per-locale trees)

## Risks / Flags
- **Ordering/source of series** (🟡): same open question as the homepage Series slider (STO-H07) — confirm sort + whether the directory is curated or index-driven.
- Series hub membership signal (tag vs explicit list) to confirm against more than one live hub before locking the retrieval rule.
