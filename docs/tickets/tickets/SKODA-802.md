# SKODA-802 — Remaining templates (Škodapedia pre-baked terms, press-kits, pages)
- **Epic:** E08 — Editorial at Scale
- **Type:** import
- **Phase:** B  ·  **Pilot:** No · **Milestone:** M2 (go-live)
- **Estimate:** 8 SP · AI-assisted 3–5d / manual 6–10d *(planning estimate, not a quote)*

## Summary
Cover the remaining editorial templates once the story parser lands: Škodapedia glossary (with terms pre-baked as `/modals/` docs), press-kits, and generic pages — reusing existing blocks, adding none.

## Description
With the hardest template (story) solved in SKODA-801, this ticket completes template coverage:

- **Škodapedia:** the A–Z directory and letter/category filter are already 100% client-side (class-based, no fetch). The term *detail* is otherwise a thin `skodapedia/v1/term/{id}` fetch returning ready-rendered HTML. **Pre-bake each term as its own DA doc under `/modals/skodapedia/{slug}`** so the directory links open via the EDS modal convention — this makes the glossary **fully static with zero runtime API** (recommended over keeping a thin fetch). ~189 EN term docs to generate.
- **Press-kits:** these are `press_release` items surfaced via a filter (not a separate CPT). They import with the existing gallery + downloads blocks (downloads baked from `mediakit/v1/mediabox` per SKODA-502) — **no new blocks required**.
- **Pages:** the generic page template (~9.6%) is native DA default content — straightforward doc + metadata.

## Requirements / Spec
- Škodapedia glossary block: inline directory (all terms present for SEO), A–Z + category client-side filter reproducing the source's class-based toggle model.
- Generate one `/modals/skodapedia/{slug}` doc per term from the source term content; wire directory links to open via `autoLinkModals()` / `/modals/` convention.
- Press-kit parser reuses gallery + downloads blocks; downloads populated from mediabox data at import (title + size label + link).
- Generic page parser: sections + default content + metadata table.
- Content-driven detection only; no new blocks introduced.

## Acceptance Criteria
- [ ] Škodapedia index renders the full inline directory; A–Z and category filters work client-side with no network fetch.
- [ ] Each term opens as an accessible `/modals/` doc (focus-trap, Escape, return-focus); no `skodapedia/v1` runtime call remains.
- [ ] Press-kit pages import with gallery + downloads blocks and no new block types.
- [ ] Generic pages import as default-content docs with correct metadata.
- [ ] All output passes lint and renders correctly vs. source in local preview.

## Dependencies
- Upstream: SKODA-801 (story parser + shared import infra) / Downstream: SKODA-803 (bulk import), SKODA-1001 (per-locale trees)

## Risks / Flags
- **Škodapedia decision (🟡):** pre-bake (recommended, fully static) vs. keep a thin fetch — confirm with stakeholders; ~189 EN term docs to generate and keep in sync.
- Modal focus behavior is `[RUNTIME-UNCONFIRMED]` — verify accessibility in a browser.
- Gallery lightbox interactive/a11y scope (from adversarial finding) applies where press-kit galleries use it.
