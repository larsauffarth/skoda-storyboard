# SKODA-202 — Hero block (image variant, LCP-friendly)
- **Epic:** E02 — Core Blocks
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 2 SP · AI-assisted 1d / manual 2–3d *(planning estimate, not a quote)*

## Summary
Build the Hero block (`image` variant) using a real `<img>` optimized to `<picture>`, tuned for LCP.

## Description
Hero appears on story/skodapedia/page templates (1,587 pages, `SKODA-EN-BLOCK-INVENTORY.md` §2A; §7 #2). Per `SKODA-EDS-DA-ARCHITECTURE.md` §3/§5, use the Block Collection Hero pattern with a **real `<img>` → optimized `<picture>`** (not a CSS background) so it is the eager-phase LCP element. Responsiveness is CSS-only (inventory §8 — straight port).

## Requirements / Spec
**DA content model (table):**
```
| Hero (image)          |
| ---                   |
| ![img](hero.jpg)      |
| # Heading             |
| Subcopy + [CTA](/x)   |
```
- Variant `image`. Image row + content row(s).

**`decorate(block)` outline:**
1. Detect image — `block.querySelector('picture')` with fallback `:scope > div > p > img` (image authored inside `<p>`).
2. Lift `<img>` to be a direct child of a `<div>`, wrap in `<picture>` so EDS emits responsive webp; keep `width`/`height` for low CLS.
3. Mark hero image `loading="eager"` / high `fetchpriority` (LCP); ensure it renders in the first (eager) section.
4. Structure heading + subcopy + CTA content cell; promote CTA link to button.
- CSS: full-bleed image + overlaid content via SKODA-106 tokens; mobile-first.

## Acceptance Criteria
- [ ] Hero renders a real `<img>`/`<picture>` (not a background-image).
- [ ] Image is eager-loaded and is the measured LCP element on a pilot hero page.
- [ ] `width`/`height` present → no layout shift (low CLS).
- [ ] Works when image is authored inside `<p>` (fallback path).
- [ ] Tokens-only CSS; `npm run lint` clean; heading hierarchy correct.

## Dependencies
- Upstream: SKODA-102, SKODA-106
- Downstream: SKODA-603 (pilot pages), SKODA-702 (LCP/perf), SKODA-701 (unit tests)

## Risks / Flags
- LCP correctness is [RUNTIME-UNCONFIRMED] until measured in a browser (SKODA-702) — real LCP/CLS carried as a residual unknown in arch §13.
- Background-image heroes would defeat LCP optimization — enforce real `<img>` in review.
