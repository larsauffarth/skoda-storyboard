# Škoda Demo — Dynamic-Feature Fallback Confirmation (Phase 0 #7)

Confirmed against the freshly-pulled `SKODA-DELIVERY-PLAN.md` decision log (2026-09-17). This records
which dynamic features are in scope for the import build vs deferred, and the fallback each carries so a
slipped client-side dependency never breaks the demo.

| Feature | Decision | Import-build impact | Fallback |
|---|---|---|---|
| **Media-cart** (D2) | **Reframed 2026-09-10** — server-side reduction is the M2 target; **client-side zip DEMOTED**. **Demo decision (2026-09-17, user):** keep all cart functionality **UI-side** (device-ID collect/persist, no login); on download, trigger **individual per-asset downloads** (each collected asset downloaded separately) rather than a zip bundle or server-side reduction. | Build cart **UI + device-ID collect/persist + per-asset download** entirely client-side; no backend, no zip. | n/a for the demo — the per-asset download IS the demo path. Real server-side reduction is M2 (SKODA-902). |
| **AEM Assets** (D5) | **Resolved** — AEM Assets is the approved-asset source. Sharpened: source masters ~40 MB → **content-bus 409** if published as-is, so a **media pre-conditioning step is required**. | Import must pre-condition (resize/optimize) heavy masters; keep masters in place for editability (no `-WxH` strip), optimize in place per `scripts/optimized-picture.js`. | If the AEM Assets instance slips, serve the curated set from the pipeline/CDN (Adobe CDN, D14) and cut over later. |
| **Locale** (D1) | **EN + CS for M1**; DE/SK/SR/SL on-demand for M2. | **Import EN only** now; per-locale query-index plumbing already locale-extensible. | Prove CS **structurally** (chrome + language-selector + one page) if CS content is late, rather than full parity. |
| **Consent / OneTrust** (D10) | Out of Adobe delivery scope. | Strip `#onetrust-*` on import (existing cleanup gotcha); no consent build. | Stub only. |
| **Load-more / rails** | In scope, built (`stories` block has load-more + category filter; verified this session). | Corpus sized to ≥18 paginated / ≥12 rail per `SKODA-RAIL-FEED-MAP.md`. | n/a — this is the core demo proof. |

**Net effect on this plan:** the plan artifact's "media-cart **client-side happy-path** (D2)" is superseded.
Per the user decision (2026-09-17), the media-cart block delivers **UI-side device-ID collect/persist +
individual per-asset download** (no zip, no server-side reduction) — the real reduction service is M2
(SKODA-902). All other fallbacks (D5 pipeline/CDN, D1 CS-structural, D10 stub) stand.

## Build sequencing (2026-09-17, user)

**Tier-1 first.** Build + import the irreducible-core demo path before Tier-2:

- **Tier 1 (build/import first):** Storyboard home (done, polish), story detail, model page (5 rails),
  Series directory + hub, Media Room home, category + tag/model listings. These prove the rails +
  load-more that are the heart of the demo.
- **Tier 2 (after Tier-1 is green):** full Images/Videos faceted listings, press-kit hub/chapter/resource,
  press-release detail, company/Page sub-types, newsletter archive+signup.

Rationale: de-risks the demo — the core rail/load-more narrative lands even if Tier-2 time runs short.
