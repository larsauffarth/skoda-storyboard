Let me investigate the current block structure and what's been compared so far, to ground the plan.Let me confirm the section→block mapping so the plan's audit list is precise.# Full-Page Section Audit — Find & Resolve All Mismatches

Systematically compare every section of the migrated `/en/` page against the original `skoda-storyboard.com/en/` at desktop **1440px** (and a mobile spot-check), catalogue every visual mismatch, then fix and re-verify. This plan is the discovery+triage pass; fixes are batched by block afterward.

## Method (per section)
For each section, capture from **both** pages via `playwright_evaluate` and compare:
- **Container**: background, section margin/padding, max-width, dark/light.
- **Heading**: text, font-size, weight, color, margin above/below (heading→rail).
- **Grid/rail**: display, columns, gap, card count, cell width/height, aspect ratio.
- **Card**: image size/ratio, overlay vs. below-image text, title font/size/weight/color/clamp, date style, hover/border/radius/shadow.
- **Icons/media**: sizes (e.g. social 76px), colors.
- Record each delta as `section · property · original → ours · severity`.

Numbers already confirmed live are treated as **baseline truth**, not re-litigated:
- Promo→Latest gap = 40px ✅ · section heading→rail = 20px ✅ · dark Social/Series headings inside green ✅ · Latest Stories date `D. M. YYYY` ✅ · featured excludes promoted stories ✅.
- Known-deployed-but-cache-masked: promo `.cards-overlay-promo` margin 16/32; social icon 76px (both confirmed in deployed CSS, awaiting 2h stylesheet cache).

## Sections to audit (block that renders each)
1. **Header / topbar / nav** — `header` block (already heavily matched; re-verify only spacing/hover regressions).
2. **Featured promo** (3 cards) — `cards-overlay` (`.cards-overlay-promo`): 1 large + 2 stacked grid, overlay text, summary on large only.
3. **Latest Stories** (5 cards) — `stories` (`.cards-overlay-latest` styling): 2 large + 3 medium grid.
4. **Social media** (dark) — `cards-media.social`: icon-above-handle, 76px icons, centered, 3-up row.
5. **Models / eMobility / Lifestyle / Škoda World** (light rails) — `carousel`: arrows, drag, cell width, image ratio, title style, date.
6. **Series** (dark) — `carousel` on dark green.
7. **Latest News** (light) — `carousel`.
8. **Footer** — `footer` block (matched before; re-verify columns/spacing/icons).
9. **Cross-cutting**: section vertical rhythm end-to-end, typography tokens (font sizes/weights/colors), link hover states, card corner-radius/shadow, mobile (412px) layout per section.

## Deliverable
A mismatch table grouped by section and severity (High = clearly wrong (color/size/layout), Med = spacing/typography, Low = subtle). Each row maps to the file that fixes it (`blocks/<block>/*.css`, `styles/styles.css`, or content). Then batch fixes into one PR per block, verify on branch preview, merge, publish, re-measure.

## Risks / notes
- **CSS deploy lag**: this session's code deploys have taken 15+ min and stylesheets carry a 2h cache; verify deployed CSS via `curl --compressed` + cache-bust, and prefer content-level fixes (section splits) where they achieve the same result instantly.
- **Reference-in-place images**: don't “fix” CDN image differences that stem from source derivatives (per prior masters-only decision).
- **Carousels**: original may auto-rotate / show partial next cell; ours is static drag+arrows — decide per-item whether a delta is in-scope or an intentional deferral.
- **Dynamic-content deltas** (live social feed, load-more, article-page fidelity) remain intentionally deferred — flag, don't fix.

## Checklist
- [ ] Capture original + ours computed-style snapshots for **header/nav** → list deltas
- [ ] Audit **Featured promo** (cards-overlay): grid, card sizes, overlay text, summary-on-large, radius/shadow
- [ ] Audit **Latest Stories** (stories): 2+3 grid ratios, card heights, title/date style vs. original
- [ ] Audit **Social media** (cards-media.social): icon 76px, spacing, centering, section padding
- [ ] Audit **Models** carousel: cell width, image ratio, title size/weight/color, date, arrows
- [ ] Audit **eMobility / Lifestyle / Škoda World** carousels (same checks; note per-rail differences)
- [ ] Audit **Series** (dark carousel): dark theming + same carousel checks
- [ ] Audit **Latest News** carousel
- [ ] Audit **Footer**: column count/widths, link/hover, social+app icons, legal row, spacing
- [ ] Cross-cutting: end-to-end **section vertical rhythm**, typography tokens, hover states, radius/shadow
- [ ] Mobile spot-check (412px) for each section; note responsive-only mismatches
- [ ] Compile prioritized **mismatch table** (section · property · original→ours · severity · target file)
- [ ] Confirm scope with user on any ambiguous/borderline items before fixing
- [ ] (Execute) Batch fixes per block; lint; verify on branch preview
- [ ] (Execute) Merge PRs to main; publish content; re-measure live against original; update memory

> This is an analysis-first plan; the audit steps are read-only. The final fix/merge/publish steps require **Execute mode**.
