# SKODA-301 — Header + mega-menu (3 nested-list panels) fragment+block
- **Epic:** E03 — Chrome Fragments
- **Type:** fragment
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 5 SP · AI-assisted 2–3d / manual 4–6d *(planning estimate, not a quote)*

## Summary
Stand up the site header as an EDS Block Collection **Header block** loaded into `<header>`, driven by a **`nav` fragment** (DA document) with three sections — brand / menu / tools — and decorate the three mega-menu panels as plain nested link lists.

## Description
The structural analysis (`SKODA-HEADER-FOOTER-ANALYSIS.md`) confirmed the header is simpler than earlier reports assumed: the mega-menu is a **plain nested `<ul>` link list with zero images and zero descriptions** — not a rich image-grid megamenu. The nav content is authored as a `nav` DA fragment; `header.js` loads it and decorates it. Three of the eight top-level items have child panels; the rest are flat links. Responsiveness in the source is CSS-driven (checkbox-hack), not JS — the mobile toggle rebuild is split out to SKODA-302, and the language switcher to SKODA-303.

## Requirements / Spec
- **Header block** (Block Collection Header) loaded into `<header>`; boilerplate default pattern.
- **`nav` fragment** = DA document, three sections: **brand** (inline SVG logo, `BRAND_LOGO` pattern), **menu** (top-level items + nested panels), **tools** (topbar: newsletter dropdown placeholder + language-switcher slot — see SKODA-303).
- **Top-level items (8):** Models, eMobility, Lifestyle, Škoda World, Series, Škodapedia, Podcast, Newsletter.
- **Three mega-menu panels**, each a nested `<ul class="sub-menu">` of plain links (no imagery, no descriptions):
  - **Models** → 12 models (Fabia, Scala, Octavia, Superb, Kamiq, Karoq, Kodiaq, Epiq, Peaq, Elroq, Enyaq) + **Classic Cars** + **Concepts**.
  - **Lifestyle** → People, Sports, Adventures.
  - **Škoda World** → Innovation & Technology, Design, Responsibility, Corporate Life, Heritage (5 topics).
- Remaining top-level items are flat links.
- Desktop panel open/close via hover + click toggle; decoration is CSS/JS over the nested lists (do NOT assume rich per-panel content).
- Per-locale fragment (one `nav` doc per language); EN authored for the pilot.

## Acceptance Criteria
- [ ] `<header>` renders the Header block from the `nav` fragment with brand / menu / tools sections.
- [ ] All 8 top-level items render; the 3 with children (Models, Lifestyle, Škoda World) expose their nested panels.
- [ ] Models panel lists exactly the 12 models + Classic Cars + Concepts; Lifestyle lists People/Sports/Adventures; Škoda World lists the 5 topics.
- [ ] No images or `<br>`-descriptions are introduced in the panels (plain nested link lists only).
- [ ] Brand logo renders as inline SVG via the `BRAND_LOGO` pattern.
- [ ] Desktop hover + click panel toggling works; only one panel open at a time.
- [ ] `npm run lint` passes; block CSS/JS are self-contained and scoped.

## Dependencies
- Upstream: SKODA-102 (boilerplate scaffold), SKODA-106 (design tokens + global CSS) / Downstream: SKODA-302 (mobile toggle), SKODA-303 (language switcher)

## Risks / Flags
- 🟡 Mega-menu decoration is the only genuinely new work; keep it CSS/JS over nested lists — do not reintroduce the "rich image-grid" assumption corrected in the analysis.
- `[RUNTIME-UNCONFIRMED]`: desktop hover timing and focus management when a panel opens need browser verification.
- Newsletter dropdown in the tools/topbar ties to the deferred newsletter service — keep it off the critical path (placeholder/stub for pilot).
