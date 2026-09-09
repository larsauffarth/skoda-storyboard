# SKODA-205 — Tags block / metadata rendering
- **Epic:** E02 — Core Blocks
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 1 SP · AI-assisted 0.5d / manual 1d *(planning estimate, not a quote)*

## Summary
Build the Tags block (or default-content rendering) that displays a page's taxonomy tag pills and feeds page metadata.

## Description
Tags appear on 83% of pages (story 1,276, press_release 1,628 — `SKODA-EN-BLOCK-INVENTORY.md` §2A). Low effort — a tag/metadata block or default content (`SKODA-EDS-DA-ARCHITECTURE.md` §3 "Tags → default content / small block"). The tag values also correspond to the taxonomy facets that the query index (SKODA-104/401) extracts, so consistent tag markup supports listings.

## Requirements / Spec
**DA content model (table):**
```
| Tags                          |
| ---                           |
| Kamiq, Technology, Motorsport |
```
- Single cell of comma-separated tags, or default-content list. Also surfaced in the page **Metadata** table (category/model taxonomy) for index extraction.

**`decorate(block)` outline:**
1. Parse tag values (comma-split or list items).
2. Render accessible pill list (`<ul>`/`<a>` linking to the relevant listing/facet where applicable).
3. Add semantic classes (`tags-item`) for styling — no positional selectors.
- CSS: pill styling via SKODA-106 tokens; CSS-only responsive (inventory §8 — trivial).

## Acceptance Criteria
- [ ] Tags render as an accessible pill list from the DA table.
- [ ] Tag values align with the query-index facet/taxonomy columns (SKODA-104/401).
- [ ] Keyboard-focusable if tags link out; semantic markup.
- [ ] Tokens-only CSS; `npm run lint` clean.

## Dependencies
- Upstream: SKODA-102
- Downstream: SKODA-401 (facet taxonomy alignment), SKODA-603 (pilot pages)

## Risks / Flags
- Tag markup must be consistent enough for `helix-query.yaml` selectors to extract facet columns reliably (R-A1) — coordinate with SKODA-401.
- CSS `:only-child` pitfall: don't use it to detect "only content" (matches ignoring text nodes) — use JS `textContent` checks per repo conventions.
