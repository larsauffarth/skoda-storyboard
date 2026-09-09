# SKODA-502 — Static Downloads block (from mediakit/v1/mediabox)
- **Epic:** E05 — Media Pipeline
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 3 SP · AI-assisted 1–2d / manual 2–3d *(planning estimate, not a quote)*

## Summary
Build a static Downloads block that renders a press page's downloadable image set as plain download links, baked at import from the `mediakit/v1/mediabox/post/{id}/{lang}` response — no cart, no signed-URL service.

## Description
The source press pages expose a per-post downloadable image set via `mediakit/v1/mediabox/post/{id}/{lang}`, which returns `{images:[{imageUrl, link, translated, title}]}`. The stateful media-cart (`media-cart/v1` state + signed-S3 `/direct-download/` bulk download) is only needed for *cross-page bulk collection* and is deferred to Phase C (SKODA-902). For the pilot, the per-page download list is a purely static block: fetch the mediabox data at import time and render labelled `<a>` download links directly.

## Requirements / Spec
- Content model: a `Downloads` block table — first row `Downloads`; each subsequent row = one asset (image/link + title + size label).
- Populate rows **at import** from the mediabox response (`images[].imageUrl` / `link` / `title`); authored fallback also supported.
- Render as static, accessible download links (labelled `<a>` with meaningful text) — no cart-add, no `data-action`/state, no signed-URL resolution.
- No runtime call to `media-cart/v1` or `/direct-download/`; those are out of scope for the pilot.
- Block-scoped CSS/JS following repo conventions; degrade gracefully if a row lacks fields.

## Acceptance Criteria
- [ ] `Downloads` block renders one labelled download link per mediabox image.
- [ ] Rows are populated at import from the `mediabox` response (`{images:[{imageUrl,link,translated,title}]}`).
- [ ] Links are keyboard-accessible with descriptive text; no cart/state code present.
- [ ] Block handles missing/partial fields without breaking.
- [ ] `npm run lint` clean.

## Dependencies
- Upstream: SKODA-102 (boilerplate scaffold). / Downstream: SKODA-603 (pilot import + validation); SKODA-902 (media-cart service, Phase C) builds on this.

## Risks / Flags
- Cart service (state + signed bulk download) is 🔴 high-risk and **deferred** — do not scope-creep it into the pilot.
- Whether the cart signed-download service can be reused standalone or must be rebuilt is an open question (Phase C).
