/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsOverlayParser from './parsers/cards-overlay.js';
import cardsMediaParser from './parsers/cards-media.js';
import cardsToolbarParser from './parsers/cards-toolbar.js';
import cardsSocialParser from './parsers/cards-social.js';
import carouselParser from './parsers/carousel.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/skoda-cleanup.js';
import sectionsTransformer from './transformers/skoda-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-overlay': cardsOverlayParser,
  'cards-media': cardsMediaParser,
  'cards-toolbar': cardsToolbarParser,
  'cards-social': cardsSocialParser,
  carousel: carouselParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'en-landing',
  description: 'Škoda Storyboard English landing/home page. Hero/featured promo grid + thematic teaser rails. Dynamic systems omitted or rendered as static stubs.',
  urls: [
    'https://www.skoda-storyboard.com/en/',
  ],
  blocks: [
    {
      name: 'cards-overlay',
      instances: [
        'main.main > section.promo-box',
        'div.cover-box .search-results.latest-articles',
      ],
    },
    {
      name: 'cards-social',
      instances: [
        'div.cover-box.dark.socials-static .search-results.type-social',
      ],
    },
    {
      name: 'carousel',
      instances: [
        'div.cover-box .search-results.type-skoda_model',
        'div.cover-box.dark .search-results.type-skoda_series',
        'div.cover-box .search-results.type-press_release',
        'div.cover-box .search-results.type-post',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
// Cleanup runs first (strips chrome / dynamic hooks / de-derivatives images);
// the section transformer inserts dark-section boundary markers + metadata.
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
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
 * Find all block instances on the page based on the embedded template.
 * @param {Document} document
 * @param {Object} template
 * @returns {Array}
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + dark-section metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. built-in importer rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. sanitized path (root/homepage maps to <locale>/index; guard empty path)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : `${rawPath}/index`);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
