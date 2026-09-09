# SKODA-402 — Faceted listing + load-more block (deep-link paging)
- **Epic:** E04 — Listings & Search
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 8 SP · AI-assisted 3–5d / manual 6–9d *(planning estimate, not a quote)*

## Summary
Build the custom faceted-listing block that reads the per-locale query-index JSON, filters/sorts/paginates entirely client-side, and reproduces the source's `posts_per_page:6` + `history.pushState` deep-link paging.

## Description
The source listings use ElasticPress + an `admin-ajax` load-more (`query_vars` incl. `posts_per_page:6, offset:6`, `ep_integrate:true`, `orderby:post_date`), pushing the offset to the URL via `history.pushState`. The EDS target reproduces this **with no server round-trip**: fetch `/{locale}/query-index.json`, read facet state from URL query params (deep-link), filter across the 15 facet columns + `template`, sort, render the first page as cards, and append the next slice on "Load more". This is the #1 pilot prototype for the static model (High effort / 🟠). Cards rendering reuses the Cards/Teaser block (SKODA-201).

## Requirements / Spec
- **Listing page content model:** a DA doc with a `Listing` block table — first row `Listing`; option rows for `template` filter, default sort, and page size (**6**, matching source).
- `decorate()` flow:
  1. Read current locale from URL prefix → fetch `/{locale}/query-index.json` (chunked if large).
  2. Read facet state from URL query params (deep-link) → filter rows client-side across the 15 facet columns + `template`.
  3. Sort (date/title); render first `pageSize` (6) as cards (via SKODA-201).
  4. Wire **"Load more"** → append next slice; `history.pushState` the offset (reproduces source deep-linking).
  5. Render facet UI from distinct column values; on change, re-filter + update URL.
- Facet checkboxes need labels + keyboard support; listing page still exposes canonical content for crawlers.
- Uses placeholders for UI strings ("Load more") per i18n architecture.

## Acceptance Criteria
- [ ] Block fetches `/{locale}/query-index.json` for the current locale and renders results as cards.
- [ ] Default page size is 6; "Load more" appends the next 6 without a server round-trip.
- [ ] Facet UI is generated from distinct index column values across the 15 facets + `template`.
- [ ] Changing facets re-filters client-side and updates URL query params (deep-linkable).
- [ ] The paging offset is pushed to the URL via `history.pushState`; loading a deep-linked URL restores that filtered/paged state.
- [ ] Facet controls are labelled and keyboard-operable.
- [ ] `npm run lint` passes.

## Dependencies
- Upstream: SKODA-401 (query-index schema), SKODA-201 (Cards/Teaser block) / Downstream: SKODA-603 (pilot page set — PR listing), SKODA-702 (performance)

## Risks / Flags
- 🟠 Highest-effort pilot block; the #1 prototype for proving the static architecture.
- Index-only recall: this block filters on indexed columns/facets, not full-text body — reduced recall accepted for pilot.
- `[RUNTIME-UNCONFIRMED]`: load-more scroll/render behavior and deep-link restoration need browser verification.
