import {
  createOptimizedPicture,
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/aem.js';
import loadQueryIndex from '../../scripts/query-index.js';

// story-rail: an auto-populated, tag-filtered teaser rail.
//
// The source homepage rails (eMobility / Lifestyle / Škoda World / Latest News)
// are not hand-curated — they are search-result components pre-filtered by a
// category tag. This block reproduces that: it reads the published query-index,
// keeps story pages whose `category` matches the block's pre-selected tag, sorts
// by `publisheddate` DESCENDING, and renders the SAME horizontal carousel UI the
// static rails use — by building a real `carousel` block and letting EDS decorate
// it (buildBlock + loadBlock), so no carousel code is duplicated or cross-imported.
//
// Authoring: a one-cell block whose rows configure it:
//   | story-rail |
//   | index    | /en/query-index.json |
//   | category | emobility            |   <- the pre-selected tag (required)
//   | limit    | 10                   |
//   | exclude  | teaser, some-slug    |   <- optional slugs/path fragments to drop
//
// Graceful: if the index is unreachable, the tag is missing, or it yields no
// entries, the block renders nothing and leaves the section heading intact.

const DEFAULTS = {
  index: '/en/query-index.json',
  template: 'story', // which content type fills the rail (story | skoda_model | image | video | press_kit | press_release …)
  category: '', // optional secondary filter within the template (e.g. emobility)
  tags: '', // optional substring match on the tags column
  limit: 10,
  exclude: '',
  dropshown: '', // storyboard-home only: 'true' drops stories already shown in Featured/Latest above
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
  config.template = config.template.trim().toLowerCase();
  config.category = config.category.toLowerCase();
  config.tagList = config.tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  // De-dup against Featured/Latest above defaults ON for the storyboard-home
  // story rails (their source behaviour) and OFF for other content types
  // (Models/Images/Videos/Press Kits on the Media Room home). An explicit
  // `dropshown = true|false` row overrides.
  const ds = config.dropshown.trim().toLowerCase();
  config.dropShown = ds ? ds === 'true' : config.template === 'story';
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

/** Last non-empty path segment of a path or absolute URL (its story slug). */
function slugOf(pathOrHref) {
  return (pathOrHref || '')
    .replace(/[#?].*$/, '')
    .replace(/\/$/, '')
    .split('/')
    .pop() || '';
}

/**
 * Wait until an element reports EDS block-status "loaded" (or a timeout).
 * The Latest Stories (`stories`) block populates asynchronously; we must read
 * its rendered links AFTER it finishes, else we'd exclude nothing.
 */
async function waitForLoaded(el, timeout = 3000) {
  if (!el || el.dataset.blockStatus === 'loaded') return;
  const start = performance.now();
  // eslint-disable-next-line no-await-in-loop
  while (el.dataset.blockStatus !== 'loaded' && performance.now() - start < timeout) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 60); });
  }
}

/**
 * Collect the slugs of every story already shown ABOVE the rails — the Featured
 * promo box and the Latest Stories grid — so the category rails don't repeat
 * them (matches the source, where each story appears once). The featured promo
 * is static markup present immediately; the Latest Stories block is dynamic, so
 * we wait for it to load before reading its links.
 */
async function collectShownSlugs() {
  const slugs = new Set();
  // Featured promo box: a cards-overlay that is NOT the stories block itself
  // (the stories block also carries cards-overlay classes).
  document.querySelectorAll('main .cards-overlay:not(.stories) a[href]')
    .forEach((a) => slugs.add(slugOf(a.getAttribute('href'))));
  // Latest Stories grid (wait for it to finish populating).
  const stories = document.querySelector('main .stories');
  if (stories) {
    await waitForLoaded(stories);
    stories.querySelectorAll('a[href]')
      .forEach((a) => slugs.add(slugOf(a.getAttribute('href'))));
  }
  slugs.delete('');
  return slugs;
}

/**
 * Format an ISO date (YYYY-MM-DD) as the source's "D. M. YYYY" (e.g. 3. 9. 2026),
 * no leading zeros, to match every other rail on the page.
 */
function formatDate(raw) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw || '');
  if (!m) return raw || '';
  const [, y, mo, d] = m;
  return `${parseInt(d, 10)}. ${parseInt(mo, 10)}. ${y}`;
}

/**
 * Build the two-column carousel row for one story: [picture] + [date + title].
 * Mirrors the static rail markup exactly so carousel.js classifies it as an
 * overlay (dated) card and carousel.css styles it identically.
 */
function buildRow(entry) {
  const picture = entry.image
    ? createOptimizedPicture(entry.image, entry.title || '', false, [{ width: '750' }])
    : document.createElement('picture');

  const dateP = document.createElement('p');
  if (entry.publisheddate) dateP.textContent = formatDate(entry.publisheddate);

  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = entry.path;
  a.textContent = entry.title || entry.path;
  h3.append(a);

  return [{ elems: [picture] }, { elems: [dateP, h3] }];
}

export default async function decorate(block) {
  const config = readConfig(block);
  block.textContent = '';

  // A rail needs at least one positive selector (template, category, or tags);
  // otherwise it is a config error — degrade silently.
  if (!config.template && !config.category && !config.tagList.length) return;

  // Storyboard-home only: drop stories already shown in the Featured promo +
  // Latest Stories above these rails, so each story appears once (source
  // behaviour). Opt-in via `dropshown = true`; off elsewhere (e.g. Media Room).
  const shownSlugs = config.dropShown ? await collectShownSlugs() : new Set();

  let entries = [];
  try {
    const all = await loadQueryIndex(config.index);
    entries = all
      // template filter (default 'story'); empty template row = any type
      .filter((e) => !config.template || (e.template || '').toLowerCase() === config.template)
      // optional category filter within the template
      .filter((e) => !config.category || (e.category || '').toLowerCase() === config.category)
      // optional tag substring match (OR across the list)
      .filter((e) => !config.tagList.length
        || config.tagList.some((t) => (e.tags || '').toLowerCase().includes(t)))
      .filter((e) => !config.excludeList.some((frag) => (e.path || '').includes(frag)))
      // drop stories already rendered above (featured promo / Latest Stories)
      .filter((e) => !shownSlugs.has(slugOf(e.path)))
      .sort((a, b) => toTime(b) - toTime(a))
      .slice(0, config.limit);
  } catch (e) {
    // Index unreachable — degrade gracefully (leave the section heading, render nothing).
    // eslint-disable-next-line no-console
    console.warn('story-rail: could not load index', config.index, e);
    return;
  }

  if (!entries.length) return;

  // Build a real carousel block from the filtered entries and let EDS decorate it,
  // so the rail behaves + looks exactly like the static carousels (overlay cards,
  // prev/next arrows, pointer-drag).
  const build = async () => {
    const carousel = buildBlock('carousel', entries.map(buildRow));
    block.append(carousel);
    decorateBlock(carousel);
    await loadBlock(carousel);
  };

  // The rails are below the fold. Defer the DOM build + carousel loadBlock until
  // the rail approaches the viewport, so the four+ rails don't all build during
  // initial load (cuts main-thread work / TBT on mobile). Fall back to building
  // immediately where IntersectionObserver is unavailable.
  if (typeof IntersectionObserver === 'undefined') {
    await build();
    return;
  }
  const observer = new IntersectionObserver((entriesList, obs) => {
    if (entriesList.some((en) => en.isIntersecting)) {
      obs.disconnect();
      build();
    }
  }, { rootMargin: '600px 0px' });
  observer.observe(block);
}
