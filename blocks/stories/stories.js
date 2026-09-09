import { createOptimizedPicture } from '../../scripts/aem.js';
import ffetch from '../../scripts/ffetch.js';

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
  return config;
}

/** Parse an index entry's date to a sortable number (newest = largest). */
function toTime(entry) {
  const raw = entry.publisheddate || entry.date || entry.lastModified || '';
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
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
    // display as-authored ISO date; sorting already used the parsed value
    dateP.textContent = entry.publisheddate;
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
    const all = await ffetch(config.index).all();
    stories = all
      .filter((e) => (e.template
        ? e.template === 'story'
        : (e.path || '').startsWith(config.path)))
      // drop stories already featured in the static promo box (by slug/path fragment)
      .filter((e) => !config.excludeList.some((frag) => (e.path || '').includes(frag)))
      .sort((a, b) => toTime(b) - toTime(a))
      .slice(0, config.limit);
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
  stories.forEach((entry, i) => ul.append(buildCard(entry, i === 0)));
  block.append(ul);
}
