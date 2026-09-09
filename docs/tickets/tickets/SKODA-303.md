# SKODA-303 — Language switcher (6 locales) in nav tools
- **Epic:** E03 — Chrome Fragments
- **Type:** fragment
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 2 SP · AI-assisted 1d / manual 1–2d *(planning estimate, not a quote)*

## Summary
Author and decorate the 6-locale language switcher in the nav **tools** section, with per-locale link targets.

## Description
The source topbar exposes a language switcher (`lang-links`) with all **6 locales — en, cs, de, sk, sr, sl** — as links. In the EDS/DA model this lives in the **tools** section of the `nav` fragment and resolves to the per-locale content trees (`/en/`, `/cs/`, `/de/`, `/sk/`, `/sr/`, `/sl/`) defined in the i18n architecture. For the pilot the switcher renders and links across locales; full language-negotiated root routing is a later-phase concern (SKODA-1003).

## Requirements / Spec
- 6-locale switcher (en/cs/de/sk/sr/sl) authored in the nav fragment's tools section.
- Each locale entry links to the corresponding per-locale tree/target.
- Rendered as an accessible control (list of links or a labelled disclosure); keyboard-operable; current locale indicated.
- Locale labels/strings sourced consistently (placeholders where applicable per i18n architecture).
- Works within the Header block decoration alongside SKODA-301/302.

## Acceptance Criteria
- [ ] All 6 locales (en, cs, de, sk, sr, sl) appear in the nav tools section.
- [ ] Each locale links to its per-locale target/tree.
- [ ] The current/active locale is visually indicated.
- [ ] The switcher is keyboard-accessible with an accessible name.
- [ ] `npm run lint` passes.

## Dependencies
- Upstream: SKODA-301 (Header + nav fragment) / Downstream: SKODA-1003 (language-negotiated root routing + per-locale placeholders)

## Risks / Flags
- 🟢 Low risk for the pilot (link list).
- Full root-routing / `Accept-Language` negotiation is deferred to Phase D (SKODA-1003); pilot ships static per-locale links only.
- Per-locale nav structure differences (market-specific items) are unmapped beyond EN — flagged in the analysis as an open question.
