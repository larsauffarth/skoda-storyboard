# E02 — Core Blocks

- **Phase:** A · **Pilot:** Yes
- **Total effort:** 24 SP · AI-assisted ~9.5–15d / manual ~21–32d *(planning estimate, not a quote)* — SKODA-207 (Series template, +3 SP) added 2026-09-14 per decision D18.

## Epic Goal
Build the reusable, table-driven content blocks that make up the static capability pilot — the highest-coverage patterns on the source site — as vanilla `decorate(block)` blocks with re-derived CSS (no jQuery/Owl/Isotope/React ports). Covers Cards/Teaser (the 91%-coverage universal card unit, 3 variants: overlay/media/toolbar), the LCP-friendly image Hero, the Gallery with an accessible lightbox modal via `/modals/`, the multi-provider Embeds block (Vimeo/YouTube/Buzzsprout/Spotify with `dnt=1` + native lazy), and the Tags/metadata block. These blocks are what the pilot press-release article + listing are authored from and what the import pipeline (E06) targets.

## Tickets
- **SKODA-201** — Cards/Teaser block with `overlay`, `media`, `toolbar` variants (compound-class variants).
- **SKODA-202** — Hero block, `image` variant, real `<img>` → optimized `<picture>`, LCP-friendly.
- **SKODA-203** — Gallery block + full-screen lightbox modal via `/modals/` (focus-trap, keyboard nav).
- **SKODA-204** — Embeds block: Vimeo/YouTube/Buzzsprout/Spotify autoblock, `dnt=1`, native lazy iframe.
- **SKODA-205** — Tags block / metadata rendering.
- **SKODA-206** — Škodapedia glossary block: inline A–Z directory + client-side letter/category filter + accessible term modal (`/modals/`).
- **SKODA-207** — Series template (2-level: directory + hub) (3SP, **M1**) — confirmed a real template by the 22-URL analysis (2026-09-14), not a 301-redirect; reuses cards/hero/grid, pulled into M1 per D18.

## Dependencies
- **Upstream:** E01 — specifically SKODA-102 (scaffold) and SKODA-106 (design tokens/CSS); SKODA-204 needs only 102.
- **Downstream:** E04 (SKODA-402 faceted listing renders Cards → needs 201), E06 (SKODA-603 pilot pages consume 201/202/203/204/205), E07 (SKODA-701 unit tests, 702/703 perf & a11y).

## Source-Doc Traceability
- `SKODA-EDS-DA-ARCHITECTURE.md` §3 (Fit matrix — Cards/Hero native, Gallery+lightbox and Embeds adapt), §5 (Block Architecture — Block Collection first, vanilla rebuild, `/modals/` convention, a11y upgrade).
- `SKODA-SYSTEM-BUILD-SPECS.md` §6 (Embeds — provider matrix, `dnt=1`, native lazy, consent gate).
- `SKODA-EN-BLOCK-INVENTORY.md` §2A (Cards/Teaser 91% + 3 variants, Hero, Gallery + lightbox, Embeds 4 providers, Tags), §7 (build-priority order), §8 (gallery is the standout JS-driven block: column-count + `width()<=767` lightbox).
