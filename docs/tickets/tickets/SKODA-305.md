# SKODA-305 — Media Room footer variant
- **Epic:** E03 — Chrome Fragments
- **Type:** fragment
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (demo)
- **Estimate:** 2 SP · AI-assisted 1d / manual 1–2d *(planning estimate, not a quote)*

## Summary
Build the **Media Room footer** as a distinct `footer` fragment variant. The 2026-09-14 walkthrough call confirmed the Media Room footer **differs** from the Storyboard footer (SKODA-304 delivers only the Storyboard variant). Closes traceability gap **G1** (COM18). Requirement: COM18.

## Description
COM18 requires the footer to remain aligned with the standard Škoda footer pattern, but the client confirmed Storyboard and Media Room currently run **different footers**. SKODA-304 built the Storyboard footer; this ticket adds the Media Room variant as a second `footer` DA fragment loaded by the same Footer block, selected per section.

The client is **open to unifying** footer + navigation across both sites if it simplifies the build — so the first task is a quick decision: **(a) one unified footer** (simplest for us; propose to client) or **(b) two distinct fragments** (as-is fidelity). Default to (b) for as-is fidelity unless the client agrees to unify.

## Requirements / Spec
- Second `footer` DA fragment for the Media Room section (or a unified fragment if the client agrees).
- Loaded by the existing Footer block; section-resolved (Stories → Storyboard footer, Media Room → MR footer).
- Reuse the SKODA-304 patterns (inline-SVG social, app-store badges, legal bar, brand SVG); only the content/links/sitemap differ.
- Confirm the exact deltas (link set, legal, app-badge presence) against the live Media Room footer before locking.

## Acceptance Criteria
- [ ] Media Room pages render the MR footer; Storyboard pages render the Storyboard footer.
- [ ] Deltas vs the Storyboard footer confirmed against the live site and reflected in the fragment.
- [ ] If unified: a single fragment serves both, signed off by the client.
- [ ] `npm run lint` passes.

## Dependencies
- Upstream: SKODA-304 (Storyboard footer + Footer-block patterns), SKODA-301 (section resolution)
- Downstream: SKODA-1001 (per-locale footer fragments)

## Risks / Flags
- 🟢 Low effort; a fragment variant, not new block code.
- **Open (client):** unify vs keep-distinct footer/nav across both sites — resolve before build (the client is open to unifying).
- Exact MR-footer deltas to confirm against the live page.
