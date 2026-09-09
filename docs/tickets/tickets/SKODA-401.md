# SKODA-401 — Query-index schema + helix-query selectors (15 facets)
- **Epic:** E04 — Listings & Search
- **Type:** setup
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 5 SP · AI-assisted 2–3d / manual 3–5d *(planning estimate, not a quote)*

## Summary
Define the per-locale query-index: `helix-query.yaml` CSS-selector definitions over published HTML that emit `/{locale}/query-index.json` with the full column schema including the 15 taxonomy facets.

## Description
DA does **not** support spreadsheet-based indexing, so listings and search are backed by **`helix-query.yaml` indexing with CSS selectors applied to published HTML** (`/developer/indexing`), output per-locale at `/{locale}/query-index.json`. This ticket builds on the SKODA-104 skeleton to define the actual selectors and column schema that extract page metadata plus the 15 taxonomy facets from rendered pages. This index is on the critical path (risk R-A1 / 🟠) — every listing and search capability depends on it extracting the facet columns reliably.

## Requirements / Spec
- Per-locale index definitions (the indexing-reference default-and-override pattern maps to `/en`, `/de`, …) → served at `/{locale}/query-index.json`.
- **Column schema:** `path, title, description, image, template, date` + the **15 taxonomy facets** + `tags`, where template ∈ (post | press_release | press_kit | …).
- **The 15 facets:** `model, bodywork, derivative, motorsport, equipment, technology, years, view, company, concept, environment, happening, history, sponsorship, vip`.
- **Multi-value facets stored comma-joined** so the client can filter with `includes()`.
- Selectors extract from published HTML only (content-driven; no URL/template-type hardcoding).
- Index is a cacheable single JSON GET per locale (chunked if large).

## Acceptance Criteria
- [ ] `helix-query.yaml` defines a per-locale index emitting `/{locale}/query-index.json`.
- [ ] Emitted rows contain all base columns: `path, title, description, image, template, date, tags`.
- [ ] All 15 taxonomy facet columns are present and populated from source HTML.
- [ ] Multi-value facet cells are comma-joined (client-`includes()` friendly).
- [ ] `template` values distinguish post / press_release / press_kit (and others encountered).
- [ ] Index validated against representative pilot pages (a press-release article + a listing page).

## Dependencies
- Upstream: SKODA-104 (helix-query.yaml skeleton / per-locale index defs) / Downstream: SKODA-402 (faceted listing), SKODA-403 (search), SKODA-901 (hosted body-search, Phase C), SKODA-1001 (per-locale index rollout, Phase D)

## Risks / Flags
- 🟠 R-A1: index design is on the critical path — selectors must extract the 15 facet columns reliably from published HTML.
- Facet count is **15** (corrected from an earlier "14" in prior docs).
- Selectors depend on stable published-HTML structure; brittle selectors break the index — prefer semantic/class-based extraction.
