# Škoda Storyboard `/en` — Design-System Extraction & Pixel-Perfect UI Plan

## Goal
Run the design-system extraction against the **live rendered** Škoda site, produce the missing `styles/brand.css` (design tokens), apply those tokens across global styles and the migrated blocks, then drive an iterative pixel-perfect visual critique of the already-migrated `/en` landing page until every block matches the original at **desktop (1440px)**.

## Decisions (confirmed)
- **Design source of truth:** the **live rendered site** (`https://www.skoda-storyboard.com/en/`) — extract computed styles/tokens directly; no Figma access required.
- **Fidelity target viewport:** **desktop 1440px** only. Mobile gets a reasonable responsive pass but is not pixel-verified this round.

## Starting point (already in place from the content migration)
- Migrated page live: `https://main--skoda-storyboard--larsauffarth.aem.page/en/` (content completeness 97.2%).
- Blocks built with baseline CSS: `hero-image`, `cards-overlay`, `cards-media`, `cards-toolbar`, `newsletter-stub`.
- Import infra under `tools/importer/` (template `en-landing`, parsers, transformers).
- **Gap this plan closes:** `styles/brand.css` does **not** exist yet — that is exactly what blocked the earlier full visual critique (it could only do content/structural, which already passed).

## Known brand cues (from analysis docs, to be verified by extraction)
- Škoda brand green `#0e3a2f` (used as dark-section background + theme-color).
- Source stylesheet is heavy (295KB, 168 `!important`, 30 breakpoints) — we re-derive clean tokens, we do **not** port it.
- Dark sections (Social media, Series) already carry section-metadata `dark`; brand.css must define the matching dark theme.

## Approach
1. **Extract design tokens from the live site** → generate `styles/brand.css` (CSS custom properties: color palette, type scale/families, spacing, radii, shadows, container widths) and wire it into `head.html`/`styles.css`.
2. **Apply tokens** so global styles + section themes (light/dark) consume the variables.
3. **Pixel-perfect block critique loop** (desktop): extract computed styles from original vs migrated per block, compute similarity, and let the design-expert sub-agent regenerate block CSS until each block ≥ target, respecting the intentional stubs/deferrals from the content migration.
4. **Re-push & re-preview**, then final verification.

## Scope guardrails (do NOT "fix" these — they are intentional)
Media-cart add buttons, promo banners, live newsletter, live social feed, "Load more", Series auto-rotation (static rail), rail "All" links. These are excluded from critique diffs so the design pass doesn't try to recreate deferred dynamic features.

## Tooling
- `excat:excat-complete-design-expert` (or `excat-block-design-expert`) for token extraction + block CSS regeneration.
- `excat:excat-visual-critique` in **Page mode** (`originalUrl` = live `/en/`, `migratedPath` = `/en/`) for the detect → fix → reassess cascade at 1440px.
- DA source API push + `admin.hlx.page` preview to publish updated code/styles.
- Browser access for computed-style extraction is provided by the design/critique skills themselves.

## Checklist

### 1. Prep & baseline
- [ ] Confirm local preview is running and `/en/` renders (`http://localhost:3000/content/en/index`); confirm live preview `…aem.page/en/` is reachable.
- [ ] Set critique viewport to desktop **1440×900**.
- [ ] Capture a baseline block-by-block similarity score of the current (pre-token) state for before/after comparison.

### 2. Extract the design system (live site → tokens)
- [ ] Run design-system extraction against `https://www.skoda-storyboard.com/en/` to derive tokens: color palette (incl. brand green `#0e3a2f`), typography (font families, sizes, weights, line-heights), spacing scale, radii, borders, shadows, container/max-widths.
- [ ] Generate `styles/brand.css` with the tokens as CSS custom properties.
- [ ] Wire `brand.css` into the load path (`head.html` / `styles/styles.css`) and map existing variables (`--background-color`, `--dark-color`, `--light-color`, font vars) to the extracted tokens.
- [ ] Lint (`npm run lint`) and confirm the page still renders with tokens applied.

### 3. Apply tokens to global + section theming
- [ ] Update `styles/styles.css` so base typography, colors, and spacing consume brand tokens.
- [ ] Ensure light/`dark` section themes (Social media, Series) resolve from tokens and match the source's dark green treatment.
- [ ] Verify global fonts load (self-hosted/`fonts.css`) matching the source families.

### 4. Pixel-perfect block critique loop (desktop 1440px)
- [ ] Run Page-mode visual critique: extract computed styles for hero + all card rails on original vs migrated, compute per-block similarity, list categorized diffs.
- [ ] Apply cascading fixes: global first, then section backgrounds, then per-block CSS via the design-expert sub-agent (full regen where similarity is low).
- [ ] Iterate per block until each reaches the fidelity target (≥90%, push toward pixel-match) — max 3 iterations per block.
- [ ] Keep the excluded/stubbed elements out of the diff set (see scope guardrails).

### 5. Re-publish & verify
- [ ] Push updated `blocks/**`, `styles/**`, `head.html` code changes (git branch + preview) and re-preview the page.
- [ ] Re-push page/fragments to DA only if markup changed (styling-only changes don't require re-import).
- [ ] Final desktop side-by-side check of hero, the three card variants, dark sections, header mega-menu, and footer; record before→after similarity per block.

### 6. Wrap up
- [ ] Summarize final per-block fidelity, files changed, and the preview link.
- [ ] Note residual gaps (e.g., mobile not pixel-verified this round, any block held below target and why) and recommended follow-ups (mobile/tablet pixel pass, Figma-token reconciliation if desired).

---
*Plan built in plan mode. Executing it (extraction, `brand.css` creation, CSS regeneration, DA/preview pushes, git) requires switching to Execute mode.*
