/* eslint-disable */
/* global WebImporter */

// Corpus import — the 96-URL rail-feed set across 7 families
// (models, series, press releases, press kits, tagged stories, images, videos).
// Lightweight pages: clean body + <head>-derived Metadata (template/category/
// tags/series/publisheddate/image/title) so the single /en/query-index.json
// auto-populates every rail (MR home, model pages, Series). No block parsers —
// all shaping is in skoda-corpus-cleanup.js.

import corpusCleanupTransformer from './transformers/skoda-corpus-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'corpus',
  description: 'Rail-feed corpus: models/series/press-releases/press-kits/stories/images/videos as lightweight indexed pages.',
  blocks: [],
};

const transformers = [corpusCleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try {
      fn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/** last non-empty path segment (its slug), attachment_id fallback. */
function slugFromUrl(u) {
  const url = new URL(u);
  const segs = url.pathname.replace(/\/$/, '').split('/').filter(Boolean);
  let slug = segs[segs.length - 1] || '';
  if (!slug || slug === 'en') {
    const att = url.searchParams.get('attachment_id');
    slug = att ? `asset-${att}` : 'item';
  }
  return slug;
}

/**
 * Route each source URL to a predictable DA path by family, so links + rails
 * resolve and the index include glob (/en/**) picks them up:
 *   /en/skoda-model/<slug>          models
 *   /en/series/<slug>               series hubs
 *   /en/press-releases/<slug>       press releases
 *   /en/press-kits/<slug>           press kits
 *   /en/images/<slug>               image assets
 *   /en/videos/<slug>               video assets
 *   /en/stories/<slug>              editorial stories (flat, matches en-stories)
 */
function pathFor(u) {
  const url = new URL(u);
  const segs = url.pathname.split('/').filter(Boolean);
  const enIdx = segs.indexOf('en');
  const after = enIdx >= 0 ? segs.slice(enIdx + 1) : segs;
  const folder = (after[0] || '').toLowerCase();
  const slug = slugFromUrl(u);

  if (folder === 'skoda-model') return `/en/skoda-model/${slug}`;
  if (folder === 'series') return `/en/series/${slug}`;
  if (folder === 'press-releases') return `/en/press-releases/${slug}`;
  if (folder === 'press-kits') {
    // press-kit video attachments are video assets, not kits
    if (after.includes('videos') || after.includes('attachment')) return `/en/videos/${slug}`;
    return `/en/press-kits/${slug}`;
  }
  // attachment_id query pages + known video/image slug patterns
  const isAttachment = /[?&]attachment_id=/.test(u) || after.includes('attachment');
  const looksVideo = /(video|mp4|1080p|_uhd|footage|_rs\d|combi_rs|_mpeg|tiger_on_ice|rally_test|maxova)/i.test(u);
  if (looksVideo) return `/en/videos/${slug}`;
  if (isAttachment) return `/en/images/${slug}`;
  if (folder && ['emobility', 'lifestyle', 'skoda-world', 'models'].includes(folder)) {
    return `/en/stories/${slug}`;
  }
  // bare /en/<slug> asset pages → images by default
  return `/en/images/${slug}`;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    executeTransformers('afterTransform', main, payload);

    // The corpus transformer appends a single canonical Metadata block; do NOT
    // call createMetadata (would duplicate keys from raw head). Resolve images.
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(pathFor(params.originalURL));
    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: [] },
    }];
  },
};
