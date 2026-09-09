# SKODA-201 — Cards/Teaser block (overlay, media, toolbar variants)
- **Epic:** E02 — Core Blocks
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 5 SP · AI-assisted 2–3d / manual 5–7d *(planning estimate, not a quote)*

## Summary
Build the Cards/Teaser block — the universal card unit (91% page coverage) — with `overlay`, `media`, and `toolbar` variants as compound classes.

## Description
Highest-priority build: the teaser card appears on nearly every source page (related-content rails, listings, home), per `SKODA-EN-BLOCK-INVENTORY.md` §2A (3,191 pages) and §7 (#1 build priority). Three co-occurring variants — `media` (image+text), `toolbar` (action row), `overlay` (styled hero-card form). Reuse Block Collection *Cards*, extend with variants; vanilla `decorate()`, re-derived CSS (`SKODA-EDS-DA-ARCHITECTURE.md` §5). Responsiveness is CSS-only grid reflow (inventory §8 — straight port). Also the render target for the E04 faceted listing.

## Requirements / Spec
**DA content model (table):**
```
| Cards (overlay) |            |
| ---             | ---        |
| ![img](img.jpg) | ### Title  |
|                 | Summary…   |
|                 | [Link](/x) |
```
- First cell names block + variant: `Cards`, `Cards (media)`, `Cards (toolbar)`, `Cards (overlay)`.
- Each row = one card; cells map to image / title / summary / CTA(s).

**`decorate(block)` outline:**
1. Read variant from block classlist (`overlay`/`media`/`toolbar`).
2. For each row, build a card: lift `<img>` out of `<p>` so it is a direct child of a `<div>` (EDS `<picture>` wrapping gotcha), wrap in `<picture>`.
3. Add semantic region classes: `cards-card-image` + `cards-card-body` (both sides classified — no positional `:not()` chains).
4. `toolbar` → render action row; `overlay` → absolute-positioned text over image.
5. Decorate links as buttons where authored (`<strong>`/`<em>` wrappers).
- CSS: mobile-first grid reflow using SKODA-106 tokens; variants via compound selectors (`.cards.overlay`).

## Acceptance Criteria
- [ ] All three variants render from their DA tables.
- [ ] Images render as optimized `<picture>` even when authored inside `<p>`.
- [ ] `cards-card-image` and `cards-card-body` classes present (no brittle positional selectors).
- [ ] Grid reflows correctly at mobile/tablet/desktop breakpoints.
- [ ] Uses SKODA-106 tokens only (no hardcoded colors/spacing); `npm run lint` clean.
- [ ] Keyboard-focusable links; images have alt.

## Dependencies
- Upstream: SKODA-102, SKODA-106
- Downstream: SKODA-402 (faceted listing renders Cards), SKODA-603 (pilot pages), SKODA-701 (unit tests)

## Risks / Flags
- Image-in-`<p>` extraction must be robust (import content default) — missing it breaks `<picture>` optimization and LCP.
- Three variants co-occur on a page; ensure variant CSS is scoped so overlay doesn't bleed into media/toolbar.
