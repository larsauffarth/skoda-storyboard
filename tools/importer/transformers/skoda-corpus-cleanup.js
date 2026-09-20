/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Škoda Storyboard rail-feed CORPUS cleanup + metadata.
 *
 * Generalizes skoda-story-cleanup.js across all seven rail-feed families
 * (models, series, press releases, press kits, tagged stories, images, videos).
 * Each imported page is LIGHTWEIGHT — a valid, resolving page with a clean body
 * plus rich <head>-derived Metadata so the single query-index at
 * /en/query-index.json auto-populates every rail (MR home, model pages, Series).
 *
 * The per-family `template` + `tags` + `series` values are derived from the
 * source URL (the authoritative signal — see categoryFromUrl rationale in the
 * story transformer). Everything else mirrors skoda-story-cleanup.js.
 */

const H = { before: 'beforeTransform', after: 'afterTransform' };

function meta(document, key) {
  const el = document.querySelector(`head meta[property="${key}"], head meta[name="${key}"]`);
  return el ? (el.getAttribute('content') || '').trim() : '';
}

function cleanTitle(raw) {
  return raw.replace(/\s*[-|–]\s*Škoda Storyboard\s*$/i, '').trim();
}

function segmentsOf(url) {
  try {
    return new URL(url).pathname.split('/').filter(Boolean);
  } catch (e) {
    return [];
  }
}

function findPublishedDate(document) {
  const metaDate = meta(document, 'article:published_time');
  if (metaDate) return metaDate.slice(0, 10);
  const dataEl = document.querySelector('[data-publish-date]');
  const dataDate = dataEl && dataEl.getAttribute('data-publish-date');
  if (dataDate) {
    const m = /(\d{4}-\d{2}-\d{2})/.exec(dataDate);
    if (m) return m[1];
  }
  const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
  for (let i = 0; i < scripts.length; i += 1) {
    const m = /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/.exec(scripts[i].textContent || '');
    if (m) return m[1];
  }
  const span = document.querySelector('.entry-published');
  if (span) {
    const m = /(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/.exec(span.textContent || '');
    if (m) {
      const [, d, mo, y] = m;
      return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }
  return '';
}

/**
 * Derive the content template + secondary signals from the source URL.
 * Returns { template, category, tags, series }.
 *  - /en/skoda-model/<slug>/            → skoda_model  (tags=<slug>)
 *  - /en/series/<slug>/                 → series       (series=<slug>)
 *  - /en/press-releases/<slug>/         → press_release (category=press-releases)
 *  - /en/press-kits/<slug>/…            → press_kit
 *  - attachment / image-ish paths       → image
 *  - video-ish paths                    → video
 *  - else /en/<category>/<slug>/        → story        (category=<folder>)
 */
function classify(url, document) {
  const seg = segmentsOf(url);
  const enIdx = seg.indexOf('en');
  const after = enIdx >= 0 ? seg.slice(enIdx + 1) : seg;
  const folder = (after[0] || '').toLowerCase();
  const slug = (after[after.length - 1] || '').toLowerCase();
  const out = { template: 'story', category: '', tags: '', series: '' };

  // Known editorial category folders (a story lives under one of these).
  const STORY_FOLDERS = ['emobility', 'lifestyle', 'skoda-world', 'models'];
  // attachment_id query pages / nested attachment paths → image assets.
  const isAttachment = /[?&]attachment_id=/.test(url) || after.includes('attachment');
  // Video slug/path signals — kept in sync with pathFor() in import-corpus.js.
  const looksVideo = /(video|mp4|1080p|_uhd|footage|_rs\d|combi_rs|_mpeg|tiger_on_ice|rally_test|maxova)/i.test(url)
    || !!document.querySelector('meta[property="og:video"], link[type="video/mp4"]');

  if (folder === 'skoda-model') {
    out.template = 'skoda_model';
    out.tags = slug; // model pages are tagged by their own slug
  } else if (folder === 'series') {
    out.template = 'series';
    out.series = slug;
  } else if (folder === 'press-releases') {
    out.template = 'press_release';
    out.category = 'press-releases';
  } else if (folder === 'press-kits') {
    out.template = 'press_kit';
    // a press kit nested under /videos/attachment/ is a video asset
    if (after.includes('videos') || after.includes('attachment')) out.template = 'video';
  } else if (STORY_FOLDERS.includes(folder)) {
    // editorial story under a real category folder
    out.template = 'story';
    out.category = folder;
  } else if (looksVideo) {
    out.template = 'video';
  } else if (isAttachment) {
    out.template = 'image';
  } else {
    // bare /en/<slug> asset pages default to image (matches pathFor fallback)
    out.template = 'image';
  }
  return out;
}

/** Collect model/topic tags from the source tag list + URL model hints. */
function collectTags(document, url, seed) {
  const tags = new Set();
  if (seed) tags.add(seed);
  // source per-article tags: ol.entry-tags a.label → tag text (model slugs, years…)
  document.querySelectorAll('.entry-tags a, .tag-list a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const m = /\/tag\/[^/]+\/([^/]+)\//.exec(href);
    if (m) tags.add(m[1].toLowerCase());
  });
  // URL model hints (peaq/elroq/… present in slug)
  const slug = segmentsOf(url).pop() || '';
  ['peaq', 'elroq', 'enyaq', 'epiq', 'octavia', 'fabia', 'scala', 'kamiq', 'karoq', 'kodiaq', 'superb']
    .forEach((model) => { if (slug.includes(model)) tags.add(model); });
  return [...tags].filter(Boolean).join(', ');
}

export default function transform(hookName, element, payload) {
  const { document, params } = payload;
  const url = params && params.originalURL;

  if (hookName === H.before) {
    WebImporter.DOMUtils.remove(element, [
      'header', 'footer', 'nav', '.header', '.footer', '.navigation',
      '#onetrust-consent-sdk', '#onetrust-banner-sdk', '#onetrust-pc-sdk',
      '#ot-sdk-container', '.onetrust-pc-dark-filter',
      '#newsletter-popups', '.newsletter-popup', '.topbar__dropdown__newsletter',
      'form.mailguide-subscribe', 'form.newsletter-form',
      '.article-share', '.social-share', '.share',
      '.related-articles', '.related-posts', '.article-related',
      '.search-results', '.cover-box', '.breadcrumbs', '.breadcrumb',
      '.article-toolbar', '.article-teaser-toolbar', 'a.media-cart-action',
      '.comments', '#comments', 'aside', '.sidebar',
      'iframe', 'noscript', 'link', 'style', 'script',
    ]);
    const root = document.querySelector(
      'article, main article, .single-article, .post-content, .entry-content, main',
    );
    if (root && root !== element) element.replaceChildren(...root.childNodes);
  }

  if (hookName === H.after) {
    // masters-only safety: keep referenced derivative, drop srcset/sizes
    element.querySelectorAll('img[src]').forEach((img) => {
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    });

    const { template, category, tags: seedTag, series } = classify(url, document);
    // Model pages are tagged by their own slug (classify sets tags=slug for them)
    // so the model's own rails + the MR Models rail resolve; other families seed
    // from their in-page tag list + URL model hints.
    const tags = collectTags(document, url, seedTag);
    const title = cleanTitle(meta(document, 'og:title') || document.title || '');
    const description = meta(document, 'og:description') || meta(document, 'description');
    const image = meta(document, 'og:image');
    const publishedDate = findPublishedDate(document);

    const cells = [];
    if (title) cells.push(['Title', title]);
    if (description) cells.push(['Description', description]);
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = title;
      cells.push(['Image', img]);
    }
    if (publishedDate) cells.push(['publisheddate', publishedDate]);
    if (category) cells.push(['category', category]);
    // NB: `tags` is a RESERVED EDS metadata key — the pipeline consumes it and
    // does NOT emit <meta name="tags">, so the query-index can't read it. Emit
    // under `modeltags` instead (custom keys like category/template DO emit).
    if (tags) cells.push(['modeltags', tags]);
    if (series) cells.push(['series', series]);
    cells.push(['template', template]);

    const metadataBlock = WebImporter.Blocks.createBlock(document, { name: 'Metadata', cells });
    element.appendChild(metadataBlock);
  }
}
