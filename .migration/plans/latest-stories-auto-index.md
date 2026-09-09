# Latest Stories — Import & Auto-Index Plan

Convert the static "Latest Stories" section on `/en/` into a **dynamic, index-driven block** that renders story cards automatically from a published EDS query-index, sorted by creation date descending. Import the 8 linked story articles as **lightweight but real** EDS pages so the index has content and the card links resolve to working internal pages.

## Decisions (confirmed)
- **Import scope:** the 5 Latest Stories articles **plus** the 3 top featured promo cards = **8 article pages**.
- **Article fidelity:** intentionally **minimal** — pages do **not** need to visually match the source. Success = (a) the card **links resolve to a working internal page**, and (b) the component is **auto-populated** from the index. Each page carries a hero image + title + description + body text (enough to be a valid, non-empty page); pixel-matching article layout is explicitly out of scope.
- **Index mechanism:** standard **EDS query-index + `ffetch`** — each imported page carries metadata (publish date, card image, description, category); a published `query-index.json` is fetched at runtime; the block renders cards **sorted by date descending**.
- **Block target:** **replace** the existing static Latest Stories `cards-overlay` block with the new dynamic block; keep the current visual layout (5-up latest grid).

## Current state (verified)
- `content/en/index.plain.html` has two `cards-overlay` blocks: a 3-item **promo/featured** grid and a 5-item **latest-articles** grid ("Latest Stories").
- Story links currently point at the live source (`https://www.skoda-storyboard.com/en/...`), not internal pages.
- **No query-index / `ffetch` infrastructure exists** yet (`scripts/` has only aem.js, scripts.js, consent-check.js, consented.js).
- Importer supports single-page templates via `page-templates.json` (`en-landing`), parsers in `tools/importer/parsers/`, run through the bundled `run-bulk-import.js`.
- The 8 target article URLs (with dates) are captured from the source landing page.

## The 8 pages to import
Featured (promo, 3):
1. Škoda Classic Tour Through the Eyes of a Spectator — 8. 9. 2026
2. "An electric car approaching," says the license plate… — 3. 9. 2026
3. Peaq Sets a Record: From the Heart of Europe to the Sea… — 2. 9. 2026

Latest Stories (5):
4. Ouninpohja: Finland's roller-coaster stage — 27. 8. 2026
5. Spacious, comfortable, and striking. Five reasons to want the Škoda Peaq — 25. 8. 2026
6. Explore the New Škoda Models in Mixed Reality — 20. 8. 2026
7. The new Škoda Slavia features a refreshed look and an exclusive colour — 18. 8. 2026
8. Practical, fun, stylish. 5 reasons to choose the Epiq — 13. 8. 2026

## Design / architecture
- **Story pages** land under `/en/stories/<slug>`, each a lightweight page: hero image + `<h1>` title + intro/description + whatever body text imports cleanly. Focus is on **valid page that resolves**, not fidelity. Page metadata (the important part) must include: `title`, `description`, `image` (og/card image), `publisheddate` (ISO, from displayed date), `category`, `template: story`.
- **Query-index:** an EDS indexer (configured at tools.aem.live per AGENTS.md; `helix-query.yaml` is retired) produces `/en/query-index.json` exposing those fields for pages under `/en/stories/**`, sorted/served for the block to consume.
- **New block `stories`**: JS `decorate()` that `ffetch`es `/en/query-index.json`, filters to stories, sorts by `publisheddate` desc, slices to N (5), and renders the existing `cards-overlay-latest` markup/classes so CSS is reused. First card keeps the LCP eager+high-priority treatment already in place. Each card links to the internal `/en/stories/<slug>` page.
- **`scripts/ffetch.js`** added (vendored EDS helper) since none exists.
- **Authoring:** in `index.plain.html`, the Latest Stories `cards-overlay` block is replaced by a one-cell `stories` block (config: limit=5, path filter), so the section is generated, not hand-listed.

## Risks / open considerations
- **Article body import may be messy** — since fidelity isn't required, accept imperfect body markup as long as the page renders and isn't empty; do not spend effort on article-page CSS.
- **Images:** reference-in-place from `cdn.skoda-storyboard.com` (per [[skoda-masters-only-vs-reference-in-place]] — do not strip `-WxH` suffix; avoid oversized masters that 409 the content bus). The card image must be present in metadata for the index.
- **Index availability:** `query-index.json` only returns **published** pages — story pages must be previewed/published before the block shows them; until then the block renders empty. Verify against published content.
- **Date parsing:** source dates are `D. M. YYYY` (e.g. `27. 8. 2026`) → convert to ISO `YYYY-MM-DD` for reliable sort.
- **Config location:** query-index is configured at tools.aem.live — this step may be an admin action, not a committed file, and may need you to perform it.
- **Empty-state fallback:** block should degrade gracefully (render nothing / keep section heading) if the index is unreachable, so the page never breaks.

## Checklist
- [ ] Confirm story path scheme is `/en/stories/<slug>` and set the index path filter to `/en/stories/**`
- [ ] Add importer template `en-stories` (or extend page-templates.json) listing the 8 article URLs
- [ ] Write a **minimal** story parser + cleanup transformer: keep hero image, title, intro/body; strip nav/footer/OneTrust/sidebars (fidelity not required)
- [ ] Ensure each story page emits metadata: title, description, image, publisheddate (ISO), category, template=story
- [ ] Regenerate the importer bundle (`aem-import-bundle.sh --importjs …`)
- [ ] Run the bulk import for the 8 pages via `run-bulk-import.js` (WORKSPACE_PATH=/workspace/current)
- [ ] Spot-check imported pages: each resolves, has a title + hero + non-empty body + correct metadata (visual polish NOT required)
- [ ] Add `scripts/ffetch.js` (vendored EDS fetch helper)
- [ ] Configure the query-index (tools.aem.live admin) to index `/en/stories/**` exposing the required fields
- [ ] Create new `stories` block: fetch query-index, filter, sort by date desc, slice to 5, render `cards-overlay-latest` markup; internal card links; keep first-image LCP eager+fetchpriority; graceful empty-state
- [ ] Reuse/extend `cards-overlay.css` (or a small `stories.css`) so layout matches current Latest Stories
- [ ] Replace the static Latest Stories `cards-overlay` block in `index.plain.html` with the `stories` block (limit=5)
- [ ] Upload/publish the 8 story pages + updated `/en/` page to Document Authoring
- [ ] Publish content and query-index; verify the block **auto-populates** the newest 5 stories in date-desc order and **every card link opens its internal page**
- [ ] Sanity-check no layout regression vs previous Latest Stories grid (desktop 1440 + mobile) — landing page only
- [ ] Update migration memory (stories imported as lightweight pages, index-driven block, RSS still deferred)

> Execution requires **Execute mode** — this plan makes no file changes yet. Approve to proceed. One item may need your action outside the repo: configuring the query-index at tools.aem.live.
