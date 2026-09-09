# SKODA-203 — Gallery block + lightbox modal (/modals/)
- **Epic:** E02 — Core Blocks
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 5 SP · AI-assisted 2–3d / manual 4–6d *(planning estimate, not a quote)*

## Summary
Build the Gallery block (responsive grid + "show more") with an accessible full-screen lightbox modal via the `/modals/` convention.

## Description
Gallery appears on 50% of pages, predominantly press releases (`SKODA-EN-BLOCK-INVENTORY.md` §2A; §7 #3). It is the standout JS-driven block (§8): the source computes **column count by width** (`>19 items → 5 cols; >9 → 4; else 3`) and ships a **lightbox** overlay (`sb-gallery-lightbox`) gated at `width()<=767`. The EDS port rebuilds vanilla (no Owl/Isotope) with a proper accessible modal via `/modals/` (`SKODA-EDS-DA-ARCHITECTURE.md` §5; Block Collection modal `autoLinkModals()`). The source has WCAG gaps — this is a deliberate a11y upgrade, not a port.

## Requirements / Spec
**DA content model (table):**
```
| Gallery                          |
| ---                              |
| ![img](1.jpg) | Caption 1        |
| ![img](2.jpg) | Caption 2        |
```
- Each row = one gallery item (image + optional caption). Import carries `alt` + `data-caption` (53% of source captions live in `data-caption` — arch §7; must not be lost).

**`decorate(block)` outline:**
1. Build responsive grid; compute column count by item count/viewport (reproduce 5/4/3 branch as CSS grid + minimal JS) — no library.
2. Lift `<img>` out of `<p>`, wrap `<picture>`; render caption into `<figcaption>` from `data-caption`.
3. Optional "show more" expand for large sets.
4. Lightbox: link items via `/modals/` convention → accessible overlay with **focus-trap, Escape to close, arrow-key navigation between items, focus return on close**.
- CSS: mobile-first grid + overlay via SKODA-106 tokens.

## Acceptance Criteria
- [ ] Grid renders with correct column count across breakpoints (5/4/3 behavior reproduced).
- [ ] Captions from `data-caption` render as `<figcaption>` (none dropped).
- [ ] Clicking an item opens an accessible `/modals/` lightbox.
- [ ] Lightbox: focus-trap, Escape closes, arrow keys navigate, focus returns to trigger.
- [ ] Images optimized to `<picture>`; tokens-only CSS; `npm run lint` clean.

## Dependencies
- Upstream: SKODA-102, SKODA-106
- Downstream: SKODA-603 (pilot press-release pages), SKODA-703 (a11y — modal focus-trap), SKODA-701 (unit tests)

## Risks / Flags
- [RUNTIME-UNCONFIRMED]: source lightbox focus behavior and whether it fetches larger originals (arch §13) — verify in browser during SKODA-703.
- Accessibility is a hard acceptance gate (focus-trap/keyboard) — the source is non-compliant; do not replicate its behavior, upgrade it.
- Import parser must carry `data-caption` (arch §7 / §10) — coordinate with SKODA-601.
