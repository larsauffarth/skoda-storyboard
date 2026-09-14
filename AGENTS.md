# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

**New to this repo?** Start at [`ONBOARDING.md`](ONBOARDING.md) → [`docs/DEVELOPER-GUIDE.md`](docs/DEVELOPER-GUIDE.md) → [`docs/architecture/IMPORT-PIPELINE.md`](docs/architecture/IMPORT-PIPELINE.md).

**Operating model (durable — reread on every execution cycle + after any context compaction/reset):** the migration runs as an Architect → Developer → QA team loop defined in [`AGENTS-TEAM.md`](AGENTS-TEAM.md). Do not rely on conversation history for the team structure, parallelism/collision rules, QA/visual-fidelity requirements, or the convergence/termination conditions — reread `AGENTS-TEAM.md` before continuing work. It defines *how the team operates*; project knowledge stays under `docs/*` and the ticket backlog under `docs/tickets/`.

## Avoid
- `scripts/aem.js` is vendored. Never edit.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- `buildAutoBlocks` rewrites content before your block runs.
- Authors omit and add cells. Decorate defensively.
- No build step; devDependencies only.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- `fragment/fragment.js` is the only cross-block import. Otherwise use `/scripts/`.

## Outdated
- `fstab.yaml`, `helix-query.yaml`, `paths.json` are retired. Config lives at tools.aem.live.

## Analysis & planning (read before scoping/estimating)
`docs/` is organized into topic subfolders (see `docs/README.md`): `analysis/` (findings + block/widget data), `architecture/`, `media/`, `planning/`, `reviews/`, `source/` (client input), `archive/` (superseded, kept as reference), plus `tickets/`, `deck/`, `meetings/`.
- `docs/analysis/SKODA-MASTER.md` is the canonical findings doc; its §16 map indexes every source report.
- `docs/planning/SKODA-DELIVERY-PLAN.md` — milestones (M1 demo 15 Oct 2026 / M2 go-live 02 Jan 2027) + decision log D1–D19.
- `docs/planning/SKODA-CLIENT-REQUIREMENTS-MAPPING.md` — client requirement IDs → build status → tickets.
- `docs/planning/SKODA-M1-DEMO-TARGET.md` — tiered demo scope; `docs/planning/SKODA-REQUIREMENTS-REPORT.html` — filterable status/split report.
- `docs/planning/SKODA-AGENT-HANDOFF-CANDIDATES.md` — parts fit for autonomous-agent handoff.
- `docs/tickets/OVERVIEW.md` — 56-ticket / 237-SP backlog (epics + SKODA-* tickets).

## Remember
- `npx -y @adobe/aem-cli up`: local code, previewed content.
- Merging `main` ships code; content publishes separately.
- A PR without a `{branch}--{repo}--{owner}.aem.page/{path}` link is rejected.
- All committed files are served. Use `.hlxignore`.
- Skills: `/plugin marketplace add adobe/skills`, then `aem-edge-delivery-services` (24 skills, incl. `docs-search`).
