# SKODA-302 — Mobile nav toggle with ARIA (fix checkbox-hack a11y gap)
- **Epic:** E03 — Chrome Fragments
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 2 SP · AI-assisted 1d / manual 1–2d *(planning estimate, not a quote)*

## Summary
Rebuild the mobile navigation toggle as a real `<button>` with correct `aria-expanded` state management, replacing the source's CSS checkbox-hack — a deliberate WCAG accessibility upgrade.

## Description
The source header uses a **CSS checkbox-hack** (`type="checkbox"` + `<label for>`) to open/close the mobile menu, and ships `aria-expanded`=0 that is **never wired to menu state** — a known WCAG defect flagged in `SKODA-HEADER-FOOTER-ANALYSIS.md`. The EDS rebuild replaces this with a real toggle button in `header.js`, with proper ARIA semantics, keyboard operability, and Escape-to-close. This is an upgrade over the source, not a port.

## Requirements / Spec
- Replace the checkbox-hack with a real `<button>` control (hamburger) in the Header block JS.
- Button carries `aria-expanded` reflecting actual open/closed state; toggles on click and on Enter/Space.
- Button has an accessible name (`aria-label` / visually-hidden text) and `aria-controls` referencing the menu container.
- Nested panels within the mobile drawer get their own accessible expand/collapse buttons with `aria-expanded`.
- Escape closes the open menu/panels; click-outside closes; focus returns to the toggle.
- Mobile-first CSS; `min-width` breakpoints at 600/900/1200; no reliance on the checkbox-hack CSS.

## Acceptance Criteria
- [ ] Mobile menu opens/closes via a real `<button>`, not a checkbox/label.
- [ ] `aria-expanded` on the toggle accurately reflects open/closed state at all times.
- [ ] Toggle is keyboard-operable (Enter/Space) and has an accessible name + `aria-controls`.
- [ ] Escape closes the menu and returns focus to the toggle; nested panel buttons expose their own `aria-expanded`.
- [ ] No `type="checkbox"` menu-hack remains in the header markup/CSS.
- [ ] `npm run lint` passes.

## Dependencies
- Upstream: SKODA-301 (Header + nav fragment) / Downstream: SKODA-703 (accessibility audit — nav ARIA)

## Risks / Flags
- 🟢 Accessibility upgrade — low risk, clear WCAG win.
- `[RUNTIME-UNCONFIRMED]`: mobile drawer animation and focus behavior need browser verification; a11y-gap severity to be confirmed with a screen reader in SKODA-703.
