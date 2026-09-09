/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import storyCleanupTransformer from './transformers/skoda-story-cleanup.js';

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json → en-stories)
const PAGE_TEMPLATE = {
  name: 'en-stories',
  description: 'Škoda Storyboard English story articles. Lightweight pages under /en/stories/<slug> with metadata for the query-index.',
  // Story articles carry NO named blocks — they are plain content pages
  // (hero + title + intro + body). All shaping happens in the transformer.
  blocks: [],
};

// TRANSFORMER REGISTRY
const transformers = [
  storyCleanupTransformer,
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName 'beforeTransform' | 'afterTransform'
 * @param {Element} element DOM element to transform
 * @param {Object} payload { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Derive the story slug from the source URL's last path segment, so every story
 * lands under a flat /en/stories/<slug> — independent of its source category
 * folder (skoda-world / emobility / lifestyle). This keeps a single index include
 * glob (/en/stories/**) and predictable internal links.
 * @param {string} originalURL
 * @returns {string} slug
 */
function slugFromUrl(originalURL) {
  const segments = new URL(originalURL).pathname
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);
  return segments[segments.length - 1] || 'story';
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform: strip chrome, reduce to article root
    executeTransformers('beforeTransform', main, payload);

    // 2. no block parsing — story pages are plain content

    // 3. afterTransform: normalize images + append Metadata block
    executeTransformers('afterTransform', main, payload);

    // 4. built-in importer rules. We intentionally DO NOT call
    //    WebImporter.rules.createMetadata here: the story-cleanup transformer
    //    already appends a single, canonical Metadata block (clean title +
    //    description + image + publisheddate + category + template). Calling
    //    createMetadata would emit a SECOND metadata block from the raw head
    //    tags (with the " - Škoda Storyboard" title suffix), producing duplicate
    //    conflicting keys. adjustImageUrls still runs to resolve image URLs.
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. flat story path: /en/stories/<slug>
    const slug = slugFromUrl(params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(`/en/stories/${slug}`);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
