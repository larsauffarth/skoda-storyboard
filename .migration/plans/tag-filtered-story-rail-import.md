I have the current homepage content and query-index config. Let me check the carousel block and whether a tag-driven/search-results block already exists.I have a clear picture of the current state. Before finalizing the plan, I need to confirm scope and volume, since this involves importing a potentially large number of article pages.# Tag-Filtered Search-Result Rails Migration Plan

## Goal

On the original `skoda-storyboard.com/en/`, the **eMobility**, **Lifestyle**, and **Škoda World** rails are not hand-curated — they are search-result components pre-filtered by a category tag, and **Latest News** is the press-releases feed. Reproduce that behavior on our page: import the linked articles, tag every page with its category, and auto-populate each rail from the query-index filtered by its pre-selected tag — exactly as we already did for **Latest Stories** (which filters `template === story` and sorts by date).

Currently these four rails are hard-coded `carousel` blocks with static article lists in `content/en/index.plain.html`. We convert them to index-driven blocks. **Models** and **Series** stay static — they link to taxonomy/series landing pages, not article searches.

## Approach

- Reuse the existing pattern: importer → per-page `category` tag in metadata → published pages → `query.yaml` index → a decorate block that reads the index and filters by tag.
- Extend the existing `stories` block into a tag-aware `search-results` (working name) block that accepts a `tag`/`category` config row and a `style: carousel` row, so it renders the same carousel UI (overlay cards, prev/next arrows, drag) the rails use today — driven by the index instead of static markup.
- One shared index already exists (`/en/query-index.json`, include `/en/stories/**`). We widen its `include` and rely on the per-page `category` meta to partition rails. Import targets stay under `/en/stories/` so one index covers everything.

## Scope (confirmed)

- **Convert to dynamic:** eMobility, Lifestyle, Škoda World (filter by `category`), Latest News (filter by `category` = press-releases / news).
- **Keep static:** Models, Series (taxonomy/landing links), the featured promo box, Social media.
- **Volume:** ~10 articles per rail (full parity) → up to ~40 article pages, minus any already imported.

## Detail

### 1. Enumerate & import the linked articles (per rail)
- Harvest the ~10 article URLs currently shown in each of the 4 rails directly from `content/en/index.plain.html` (they are the existing `<a href>` targets). Several eMobility/Lifestyle/Škoda World articles are already imported for Latest Stories — dedupe against `tools/importer/urls-en-stories.txt` so we only import net-new pages.
- Add the net-new URLs to a rail-aware URL list (extend `urls-en-stories.txt` or add `urls-en-rails.txt`), grouped/annotated by rail so the correct `category` tag can be assigned.
- Regenerate the importer bundle and run the bulk import (reusing `import-en-stories.js` + `skoda-story-cleanup.js`), writing pages under `/en/stories/{slug}`.

### 2. Tag every page correctly
- Ensure the story-cleanup transformer emits a `category` meta value on each imported page matching its rail: `emobility`, `lifestyle`, `skoda-world`, and `press-releases` (news). Derive it from the source URL path segment.
- Verify the Metadata block on each page carries a single canonical `category` (and `template: story`) — no duplicate metadata keys (the known createMetadata pitfall).
- Spot-check a sample of imported pages' `.plain.html` for the correct `category`.

### 3. Widen the query-index to expose the tag
- The index already selects a `category` property. Confirm `query.yaml` still includes all imported pages (`/en/stories/**`) and re-submit via `PUT https://admin.hlx.page/config/larsauffarth/sites/skoda-storyboard/content/query.yaml` if the include changed.
- Publish (preview + live) every imported page first — the indexer only sees published pages — then trigger reindex and confirm each `category` appears in `/en/query-index.json`.

### 4. Build the tag-filtered rail block
- Generalize `blocks/stories/` into (or add) a block that:
  - reads config rows: `index`, `category` (the pre-selected tag), `limit`, optional `exclude`, and `style` (`carousel` vs `grid`);
  - fetches the index, filters `template === story` **and** `category === <tag>`, sorts by `publisheddate` desc, slices to `limit`;
  - renders carousel markup + reuses `carousel.js`/`carousel.css` behavior (overlay card style, arrows, drag) so dynamic rails look identical to the static ones.
- Degrade gracefully (render nothing, keep heading) if the index is unreachable or a tag yields no results.

### 5. Swap the static rails in content
- In `content/en/index.plain.html`, replace each of the 4 static `carousel` blocks with the new tag-filtered block, keeping the existing heading + "All" pill link untouched. Models/Series/promo/social unchanged.
- Upload the page doc to DA (wrapped in `<body><main>`), preview, publish.

### 6. Verify against the original
- Fresh-browser check at 1440px: each rail auto-populates from the index, shows correct articles for its tag, newest-first, arrows/drag work, card styling matches, "All" pills intact, dark Series band unaffected.
- Confirm links resolve and no rail is empty.

### 7. Lint, PR, publish, update memory
- Run lint; open PR with the `{branch}--{repo}--{owner}.aem.page/en/` preview link (required).
- Merge to main (ships code), publish content.
- Update memory: extend `[[skoda-stories-query-index]]` with the tag-filtering approach and the `category`-per-rail convention.

## Risks / Notes
- **Index only sees published pages** — publish before reindex, or rails render empty.
- **Duplicate-metadata pitfall** — ensure a single canonical `category`/`template` per page.
- **CSS/deploy lag** — code deploys can lag ~15 min (2h cache); content edits publish immediately. Verify deployed assets with cache-busted `curl --compressed`.
- **Category naming** must match exactly between the transformer output and the block's `category` config row (case/slug).
- Large import (~40 pages) — batch and monitor; reuse cached imports where slugs already exist.

## Checklist

- [ ] Harvest the ~10 article URLs per rail (eMobility, Lifestyle, Škoda World, Latest News) from current index content; dedupe against already-imported stories
- [ ] Add net-new URLs to the importer list, annotated by rail/category
- [ ] Regenerate importer bundle and run bulk import for the net-new article pages
- [ ] Ensure the cleanup transformer assigns the correct `category` tag (emobility / lifestyle / skoda-world / press-releases) + `template: story` per page
- [ ] Verify a sample of imported pages carry a single canonical `category` (no duplicate metadata)
- [ ] Confirm/re-submit `query.yaml` include so all imported pages are indexed with `category`
- [ ] Preview + publish all imported pages, then reindex
- [ ] Confirm each `category` value appears in `/en/query-index.json`
- [ ] Build/generalize the tag-filtered rail block (config: index, category, limit, exclude, style=carousel) reusing carousel UI
- [ ] Add graceful-degradation for missing index / empty tag
- [ ] Replace the 4 static carousel rails in `index.plain.html` with the tag-filtered block (keep headings + "All" pills)
- [ ] Upload page to DA (`<body><main>` wrapper), preview, publish
- [ ] Fresh-browser 1440px verification: each rail auto-populates by tag, newest-first, arrows/drag/styling match original
- [ ] Confirm Models/Series/promo/social remain unchanged
- [ ] Run lint
- [ ] Open PR with `.aem.page/en/` preview link; merge to main; publish content
- [ ] Update memory (`skoda-stories-query-index`) with the tag-per-rail convention

> **Note:** This plan is read-only in plan mode. Executing the import, block changes, content swaps, and publish steps requires switching to Execute mode.
