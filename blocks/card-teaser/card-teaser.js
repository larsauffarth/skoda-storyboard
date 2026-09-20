import { createOptimizedPicture } from '../../scripts/aem.js';
import loadQueryIndex from '../../scripts/query-index.js';

// card-teaser: the category / tag archive grid (spec: docs/ui-specs/template-category-archive.md).
//
// A plain hero + card grid (NO facet panel — that is the faceted `listing` block,
// Tier 2). This is the paginated grid that fills category, tag and model-related
// listings (#3, #4, #8). It reads the published query-index, keeps entries in the
// requested category/tag/template scope, sorts newest-first, and renders 16:9
// overlay cards in a 3 → 2 → 1 grid with a "Load more" button (source treatment).
//
// Reuses cards-overlay markup/classes so its card CSS is shared.
//
// Authoring (one-cell block, optional override rows):
//   | Card teaser |                     |
//   | index    | /en/query-index.json   |
//   | category | emobility              |  positive include (comma = OR)
//   | tags     | epiq                   |  substring match on the tags column
//   | template | story | press_release  |  restrict by content type
//   | path     | /en/                   |  path scope fallback
//   | pagesize | 24                     |  cards per batch (Load more reveals more)
//   | order    | newest | editorial     |
//
// Graceful: unreachable/empty index → renders nothing, leaves the heading intact.

const DEFAULTS = {
  index: '/en/query-index.json',
  category: '',
  tags: '',
  template: '',
  path: '/en/',
  pagesize: 24,
  order: 'newest',
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
  config.pagesize = parseInt(config.pagesize, 10) || DEFAULTS.pagesize;
  config.categoryList = config.category.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  config.tagList = config.tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  config.template = config.template.trim().toLowerCase();
  return config;
}

/** Parse an index entry's date to a sortable number (newest = largest). */
function toTime(entry) {
  const raw = entry.publisheddate || entry.date || entry.lastModified || '';
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
}

/** Format ISO (YYYY-MM-DD) as the source's "D. M. YYYY" (no leading zeros). */
function formatDate(raw) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw || '');
  if (!m) return raw || '';
  const [, y, mo, d] = m;
  return `${parseInt(d, 10)}. ${parseInt(mo, 10)}. ${y}`;
}

/** Build one overlay card <li> (date + linked title over the image). */
function buildCard(entry, eager) {
  const li = document.createElement('li');

  const imageCell = document.createElement('div');
  imageCell.className = 'cards-overlay-card-image';
  if (entry.image) {
    imageCell.append(createOptimizedPicture(entry.image, entry.title || '', eager, [{ width: '750' }]));
  }
  li.append(imageCell);

  const body = document.createElement('div');
  body.className = 'cards-overlay-card-body';
  if (entry.publisheddate) {
    const dateP = document.createElement('p');
    dateP.className = 'cards-overlay-card-date';
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

  let entries = [];
  try {
    const all = await loadQueryIndex(config.index);
    entries = all
      .filter((e) => !config.template || (e.template || '').toLowerCase() === config.template)
      .filter((e) => !config.categoryList.length
        || config.categoryList.includes((e.category || '').toLowerCase()))
      .filter((e) => !config.tagList.length
        || config.tagList.some((t) => (e.tags || '').toLowerCase().includes(t)))
      .filter((e) => {
        // when no positive filter is set, fall back to a path scope
        if (config.categoryList.length || config.tagList.length || config.template) return true;
        return (e.path || '').startsWith(config.path);
      });
    if (config.order !== 'editorial') entries.sort((a, b) => toTime(b) - toTime(a));
  } catch (e) {
    // Index unreachable — degrade gracefully.
    // eslint-disable-next-line no-console
    console.warn('card-teaser: could not load index', config.index, e);
    return;
  }
  if (!entries.length) return;

  block.classList.add('cards-overlay');
  const ul = document.createElement('ul');
  block.append(ul);

  let shown = 0;
  const renderBatch = () => {
    entries.slice(shown, shown + config.pagesize)
      .forEach((entry, i) => ul.append(buildCard(entry, shown === 0 && i === 0)));
    shown += config.pagesize;
  };
  renderBatch();

  if (shown < entries.length) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'card-teaser-load-more';
    more.textContent = 'Load more';
    more.addEventListener('click', () => {
      renderBatch();
      if (shown >= entries.length) more.remove();
    });
    block.append(more);
  }
}
