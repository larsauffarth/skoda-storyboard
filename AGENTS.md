# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

**New to this repo?** Start at [`ONBOARDING.md`](ONBOARDING.md) → [`docs/DEVELOPER-GUIDE.md`](docs/DEVELOPER-GUIDE.md) → [`docs/architecture/IMPORT-PIPELINE.md`](docs/architecture/IMPORT-PIPELINE.md).

**Sections (follow in this order when generating code):** [General Guidelines](#general-guidelines) · [JavaScript Guidelines](#javascript-guidelines) · [CSS Guidelines](#css-guidelines) · [Global Guidelines](#global-guidelines)

## General Guidelines

Cross-cutting practices that apply no matter which layer (markup, CSS, or JS) you're touching. Read this before writing any block code.

- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- Authors omit and add cells. Decorate/style defensively — never assume a cell exists.

## JavaScript Guidelines

Write/adapt block behavior next, once you know the real markup shape.

- `scripts/aem.js` is vendored. Never edit.
- `buildAutoBlocks` rewrites content before your block runs.
- `fragment/fragment.js` is the only cross-block import. Otherwise use `/scripts/`.

## CSS Guidelines

Style the block once its markup and decoration logic are in place.

For any frontend CSS, styling, responsive-layout, or UI-component work:

- Read and follow `docs/guardrails/css-guidelines.md`.
- Treat those guidelines as mandatory engineering constraints.
- Prefer fluid CSS, intrinsic layout, and container queries before viewport breakpoints.
- Use the three-layer CSS architecture:
  1. Fluid
  2. Intrinsic/adaptive
  3. Breakpoint/behavioral
- Use CSS variables/design tokens for reusable dimensions, spacing, typography, colors, etc.
- Keep global CSS limited to genuinely global concerns.
- Keep component-specific CSS with the component.
- Do not introduce a breakpoint without a concrete layout/behavior reason.
- Perform the guardrail self-check before returning CSS changes.

## Global Guidelines

Project-wide facts and workflow — apply once the code is written, to preview, ship, and track it.

### Project Setup
- No build step; devDependencies only.
- `fstab.yaml`, `helix-query.yaml`, `paths.json` are retired. Config lives at tools.aem.live.

### Working & Shipping
- `npx -y @adobe/aem-cli up`: local code, previewed content.
- Merging `main` ships code; content publishes separately.
- A PR without a `{branch}--{repo}--{owner}.aem.page/{path}` link is rejected.
- All committed files are served. Use `.hlxignore`.
- Skills: `/plugin marketplace add adobe/skills`, then `aem-edge-delivery-services` (24 skills, incl. `docs-search`).

### Analysis & Planning (read before scoping/estimating)
`docs/` is organized into topic subfolders (see `docs/README.md`): `analysis/` (findings + block/widget data), `architecture/`, `media/`, `planning/`, `reviews/`, `source/` (client input), `archive/` (superseded, kept as reference), plus `tickets/`, `deck/`, `meetings/`.
- `docs/analysis/SKODA-MASTER.md` is the canonical findings doc; its §16 map indexes every source report.
- `docs/planning/SKODA-DELIVERY-PLAN.md` — milestones (M1 demo 15 Oct 2026 / M2 go-live 02 Jan 2027) + decision log D1–D19.
- `docs/planning/SKODA-CLIENT-REQUIREMENTS-MAPPING.md` — client requirement IDs → build status → tickets.
- `docs/planning/SKODA-M1-DEMO-TARGET.md` — tiered demo scope; `docs/planning/SKODA-REQUIREMENTS-REPORT.html` — filterable status/split report.
- `docs/planning/SKODA-AGENT-HANDOFF-CANDIDATES.md` — parts fit for autonomous-agent handoff.
- `docs/tickets/OVERVIEW.md` — 63-ticket / 261-SP backlog (epics + SKODA-* tickets).
- `docs/ui-specs/` — measured component + template spec library (live-DevTools DOM/CSS at 768/992/1080); `_TEMPLATES.md` maps every source page type to its blocks + ticket.
