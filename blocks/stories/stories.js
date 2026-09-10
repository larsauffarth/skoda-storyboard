import { createOptimizedPicture } from '../../scripts/aem.js';
import loadQueryIndex from '../../scripts/query-index.js';

// stories: auto-populated "Latest Stories" grid.
//
// Reads a published query-index (default /en/query-index.json), keeps only story
// pages (template === 'story' when present, else path-scoped), sorts by
// publisheddate DESCENDING, and renders the SAME markup + classes as the
// cards-overlay "latest" featured grid (2 large + 3 medium) so its CSS is reused.
//
// Authoring: a one-cell block whose optional rows override defaults:
//   | stories         |
//   | index   | /en/query-index.json |
//   | path    | /en/stories/         |
//   | limit   | 5                    |
//   | exclude | skoda-classic-tour-..., an-electric-car-... |
//
// `exclude` is a comma-separated list of slugs (or path fragments) to drop —
// used to keep stories already shown in the static featured promo box from
// repeating here. Matched as a substring of each story's path.
//
// Graceful: if the index is unreachable or empty, the block renders nothing and
// leaves the section heading intact (the page never breaks).

const DEFAULTS = {
  index: '/en/query-index.json',
  path: '/en/stories/',
  limit: 5,
  exclude: '',
  excludecategory: '',
};

/** Read simple key/value config rows from the block, falling back to defaults. */
function readConfig(block) {
  const config = { ...DEFAULTS };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (key in config && value) config[key] = value;
  });
  config.limit = parseInt(config.limit, 10) || DEFAULTS.limit;
  // Normalize exclude into a list of non-empty, trimmed fragments.
  config.excludeList = config.exclude
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // Categories to drop entirely (e.g. press-releases belong only in Latest News).
  config.excludeCategoryList = config.excludecategory
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return config;
}

/** Parse an index entry's date to a sortable number (newest = largest). */
function toTime(entry) {
  const raw = entry.publisheddate || entry.date || entry.lastModified || '';
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Format an ISO date (YYYY-MM-DD) as the source's "D. M. YYYY" (e.g. 3. 9. 2026),
 * no leading zeros, to match every other rail on the page. Falls back to the raw
 * string if it isn't a plain ISO date.
 */
function formatDate(raw) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw || '');
  if (!m) return raw || '';
  const [, y, mo, d] = m;
  return `${parseInt(d, 10)}. ${parseInt(mo, 10)}. ${y}`;
}

/** Build one card <li> mirroring cards-overlay-latest markup. */
function buildCard(entry, eager) {
  const li = document.createElement('li');

  // image cell
  const imageCell = document.createElement('div');
  imageCell.className = 'cards-overlay-card-image';
  if (entry.image) {
    const picture = createOptimizedPicture(entry.image, entry.title || '', eager, [{ width: '750' }]);
    if (eager) picture.querySelector('img')?.setAttribute('fetchpriority', 'high');
    imageCell.append(picture);
  }
  li.append(imageCell);

  // body cell: date + linked title
  const body = document.createElement('div');
  body.className = 'cards-overlay-card-body';
  if (entry.publisheddate) {
    const dateP = document.createElement('p');
    // format ISO date as source's "D. M. YYYY" to match the other rails
    dateP.textContent = formatDate(entry.publisheddate);
    body.append(dateP);
  }
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = entry.path;
  a.textContent = entry.title || entry.path;
  h3.append(a);
  body.append(h3);
  li.append(body);

  return li;
}

export default async function decorate(block) {
  const config = readConfig(block);
  block.textContent = '';

  let stories = [];
  try {
    const all = await loadQueryIndex(config.index);
    stories = all
      .filter((e) => (e.template
        ? e.template === 'story'
        : (e.path || '').startsWith(config.path)))
      // drop stories already featured in the static promo box (by slug/path fragment)
      .filter((e) => !config.excludeList.some((frag) => (e.path || '').includes(frag)))
      // drop whole categories that belong to a dedicated rail (e.g. press-releases)
      .filter((e) => !config.excludeCategoryList.includes((e.category || '').toLowerCase()))
      .sort((a, b) => toTime(b) - toTime(a));
  } catch (e) {
    // Index unreachable — degrade gracefully (leave the section heading, render nothing).
    // eslint-disable-next-line no-console
    console.warn('stories: could not load index', config.index, e);
    return;
  }

  if (!stories.length) return;

  // Reuse the cards-overlay "latest" featured grid styling.
  block.classList.add('cards-overlay', 'cards-overlay-featured', 'cards-overlay-latest');

  const ul = document.createElement('ul');
  block.append(ul);

  // Render an initial batch of `limit`, then reveal the rest in equal batches
  // via a "Load more" button (source treatment). Only the very first card is
  // eager (it's the LCP candidate in this section).
  let shown = 0;
  const renderBatch = () => {
    stories.slice(shown, shown + config.limit)
      .forEach((entry, i) => ul.append(buildCard(entry, shown === 0 && i === 0)));
    shown += config.limit;
  };
  renderBatch();

  // Only add the button when there's a second batch to reveal.
  if (shown < stories.length) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'stories-load-more';
    more.textContent = 'Load more';
    more.addEventListener('click', () => {
      renderBatch();
      if (shown >= stories.length) more.remove();
    });
    block.append(more);
  }
}
