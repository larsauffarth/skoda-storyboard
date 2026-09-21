import { createOptimizedPicture } from '../../scripts/aem.js';
import loadQueryIndex from '../../scripts/query-index.js';

// series: thin, index-driven wrapper for the two Series surfaces (spec: docs/ui-specs/series.md).
//
// Reuses cards-overlay markup/classes (overlaid white title on the image) — no
// series-only card is built. Two variants (config `variant`):
//   - "directory" (default): a grid of series cards, each image 2:1 with an
//     overlaid title AND a visible excerpt below the image. Editorial order
//     (index order). Reads a `series` index.
//   - "hub": the stories that belong to one series — square (1:1) overlay cards,
//     NO date, sorted newest-first. Reads the `stories` index filtered by
//     `series == {slug}`. The hub hero is a separate hero-image block authored
//     above this one, per the spec.
//
// Authoring (one-cell block, optional override rows):
//   | Series   |                       |
//   | variant  | directory | hub       |
//   | index    | /en/query-index.json  |
//   | slug     | 125-years-of-motorsport |  (hub only — which series' stories)
//   | path     | /en/series/           |  (directory: index scope)
//   | order    | newest | editorial    |
//   | limit    | 25                    |
//
// Graceful: if the index is unreachable or empty, renders nothing and leaves the
// section heading intact (the page never breaks).

const DEFAULTS = {
  variant: 'directory',
  index: '/en/query-index.json',
  slug: '',
  path: '/en/series/',
  order: '',
  limit: 100,
};

/** Read simple key/value config rows, falling back to defaults. */
function readConfig(block) {
  const config = { ...DEFAULTS };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (key in config && value) config[key] = value;
  });
  config.variant = config.variant.toLowerCase() === 'hub' ? 'hub' : 'directory';
  config.limit = parseInt(config.limit, 10) || DEFAULTS.limit;
  config.slug = config.slug.toLowerCase();
  return config;
}

/** Parse an index entry's date to a sortable number (newest = largest). */
function toTime(entry) {
  const raw = entry.publisheddate || entry.date || entry.lastModified || '';
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Build one overlay card <li> mirroring cards-overlay markup.
 * `withExcerpt` adds the description below the image (directory cards only).
 */
function buildCard(entry, eager, withExcerpt) {
  const li = document.createElement('li');

  const imageCell = document.createElement('div');
  imageCell.className = 'cards-overlay-card-image';
  if (entry.image) {
    const picture = createOptimizedPicture(entry.image, entry.title || '', eager, [{ width: '750' }]);
    imageCell.append(picture);
  }
  li.append(imageCell);

  const body = document.createElement('div');
  body.className = 'cards-overlay-card-body';
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = entry.path;
  a.textContent = entry.title || entry.path;
  h3.append(a);
  body.append(h3);
  li.append(body);

  // Directory cards carry a visible excerpt BELOW the image (spec §2 delta 1).
  if (withExcerpt && entry.description) {
    const excerpt = document.createElement('p');
    excerpt.className = 'series-excerpt';
    excerpt.textContent = entry.description;
    li.append(excerpt);
  }
  return li;
}

export default async function decorate(block) {
  const config = readConfig(block);
  const isHub = config.variant === 'hub';
  block.textContent = '';

  let entries = [];
  try {
    const all = await loadQueryIndex(config.index);
    if (isHub) {
      // Hub: the stories in this series, newest-first, no date shown.
      entries = all
        .filter((e) => (e.series || '').toLowerCase() === config.slug
          || (e.tags || '').toLowerCase().includes(config.slug))
        .sort((a, b) => toTime(b) - toTime(a));
    } else {
      // Directory: the series entries, editorial order (index order) unless
      // `order = newest` is explicitly requested.
      entries = all.filter((e) => (e.template
        ? e.template === 'series'
        : (e.path || '').startsWith(config.path)));
      if (config.order === 'newest') entries = entries.slice().sort((a, b) => toTime(b) - toTime(a));
    }
  } catch (e) {
    // Index unreachable — degrade gracefully.
    // eslint-disable-next-line no-console
    console.warn('series: could not load index', config.index, e);
    return;
  }

  entries = entries.slice(0, config.limit);
  if (!entries.length) return;

  // Reuse the cards-overlay listing styling; series.css adds the ratio/excerpt deltas.
  block.classList.add('cards-overlay');
  block.classList.add(isHub ? 'series-hub' : 'series-directory');

  const ul = document.createElement('ul');
  entries.forEach((entry, i) => ul.append(buildCard(entry, i === 0, !isHub)));
  block.append(ul);
}
