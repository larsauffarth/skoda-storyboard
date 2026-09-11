import { createOptimizedPicture } from '../../scripts/aem.js';
import loadQueryIndex from '../../scripts/query-index.js';

// stories: auto-populated, index-driven story grids.
//
// Reads a published query-index (default /en/query-index.json), keeps only story
// pages (template === 'story' when present, else path-scoped), sorts by
// publisheddate DESCENDING, and renders card markup + classes shared with
// cards-overlay so its CSS is reused.
//
// Two layouts (config `variant`):
//   - (default) "latest": 2 large (top) + 3 medium (bottom) grid, + Load more.
//   - "promo": the top featured box — 1 large (left) + 2 stacked (right) on
//     desktop; on mobile it becomes a timed carousel (one card at a time,
//     10s auto-advance, pause on hover) matching the source promo-box.
//
// Authoring: a one-cell block whose optional rows override defaults:
//   | stories  |                      |
//   | variant  | promo                |
//   | index    | /en/query-index.json |
//   | path     | /en/stories/         |
//   | limit    | 3                    |
//   | offset   | 0                    |
//   | exclude  | some-slug, other-slug |
//   | excludecategory | press-releases |
//
// `offset` skips the first N matching stories — so the featured promo (offset 0,
// limit 3) and Latest Stories (offset 3) draw from the SAME sorted index without
// overlap and without a hand-maintained `exclude` list. `exclude` still works as
// a substring drop-list for one-off cases.
//
// Graceful: if the index is unreachable or empty, the block renders nothing and
// leaves the section heading intact (the page never breaks).

const DEFAULTS = {
  variant: '',
  index: '/en/query-index.json',
  path: '/en/stories/',
  limit: 5,
  offset: 0,
  exclude: '',
  excludecategory: '',
};

// Below this width the promo becomes a timed carousel; at/above it is the
// static 1-big + 2-small grid. Matches the grid breakpoint in stories.css
// (and mirrors the source's Flickity watchCSS: rotate on mobile, static grid on
// desktop).
const PROMO_CAROUSEL_QUERY = '(width < 900px)';
const PROMO_ROTATE_MS = 10000;

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
  config.variant = config.variant.toLowerCase();
  config.limit = parseInt(config.limit, 10) || DEFAULTS.limit;
  config.offset = parseInt(config.offset, 10) || 0;
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

/**
 * Build one card <li> mirroring cards-overlay markup.
 * `withSummary` adds the entry description (used by the large promo card).
 */
function buildCard(entry, eager, withSummary) {
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

  // body cell: date + linked title (+ optional summary)
  const body = document.createElement('div');
  body.className = 'cards-overlay-card-body';
  if (entry.publisheddate) {
    const dateP = document.createElement('p');
    dateP.className = 'cards-overlay-card-date';
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
  if (withSummary && entry.description) {
    const summary = document.createElement('p');
    summary.className = 'cards-overlay-card-summary';
    summary.textContent = entry.description;
    body.append(summary);
  }
  li.append(body);

  return li;
}

/**
 * Wire up the mobile-only timed carousel for the promo variant.
 * One card visible at a time, auto-advances every PROMO_ROTATE_MS, pauses on
 * hover/focus. Only runs while PROMO_CAROUSEL_QUERY matches (static grid above);
 * mirrors the source's Flickity watchCSS behaviour. Adds page dots.
 */
function initPromoCarousel(block, ul) {
  const cards = [...ul.children];
  if (cards.length < 2) return;

  const mq = window.matchMedia(PROMO_CAROUSEL_QUERY);
  let index = 0;
  let timer = null;
  let dots = [];

  const apply = () => {
    ul.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
  };
  const goTo = (i) => {
    index = (i + cards.length) % cards.length;
    apply();
  };
  const next = () => goTo(index + 1);

  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };
  const start = () => {
    stop();
    timer = setInterval(next, PROMO_ROTATE_MS);
  };

  // page dots (source Flickity shows them on mobile)
  const nav = document.createElement('div');
  nav.className = 'stories-promo-dots';
  dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'stories-promo-dot';
    dot.setAttribute('aria-label', `Go to featured story ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); start(); });
    nav.append(dot);
    return dot;
  });

  const enable = () => {
    block.classList.add('stories-promo-carousel');
    if (!nav.isConnected) block.append(nav);
    index = 0;
    apply();
    start();
  };
  const disable = () => {
    stop();
    block.classList.remove('stories-promo-carousel');
    ul.style.transform = '';
    if (nav.isConnected) nav.remove();
  };

  // pause on hover / keyboard focus, resume on leave
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', () => { if (mq.matches) start(); });
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', () => { if (mq.matches) start(); });

  const sync = () => (mq.matches ? enable() : disable());
  mq.addEventListener('change', sync);
  sync();
}

export default async function decorate(block) {
  const config = readConfig(block);
  const isPromo = config.variant === 'promo';
  block.textContent = '';

  let stories = [];
  try {
    const all = await loadQueryIndex(config.index);
    stories = all
      .filter((e) => (e.template
        ? e.template === 'story'
        : (e.path || '').startsWith(config.path)))
      // one-off drop-list (substring match on path) — usually empty now that
      // featured/latest split by `offset` from the same sorted list.
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

  // Skip the first `offset` matches (featured promo shows them instead).
  if (config.offset) stories = stories.slice(config.offset);
  if (!stories.length) return;

  if (isPromo) {
    // Featured promo: reuse the cards-overlay promo grid styling.
    block.classList.add('cards-overlay', 'cards-overlay-featured', 'cards-overlay-promo');
    const ul = document.createElement('ul');
    block.append(ul);
    // Exactly `limit` cards (default 3). All eager — the promo is the LCP region.
    stories.slice(0, config.limit)
      .forEach((entry, i) => ul.append(buildCard(entry, true, i === 0)));
    ul.querySelector('img')?.setAttribute('fetchpriority', 'high');
    initPromoCarousel(block, ul);
    return;
  }

  // Latest Stories: reuse the cards-overlay "latest" featured grid styling.
  block.classList.add('cards-overlay', 'cards-overlay-featured', 'cards-overlay-latest');

  const ul = document.createElement('ul');
  block.append(ul);

  // Render an initial batch of `limit`, then reveal the rest in equal batches
  // via a "Load more" button (source treatment). Only the very first card is
  // eager (it's the LCP candidate in this section).
  let shown = 0;
  const renderBatch = () => {
    stories.slice(shown, shown + config.limit)
      .forEach((entry, i) => ul.append(buildCard(entry, shown === 0 && i === 0, false)));
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
