/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Škoda Storyboard story-article cleanup + metadata.
 *
 * Story pages are imported as LIGHTWEIGHT pages: hero image + <h1> title + intro
 * + whatever body text survives cleanup. Visual fidelity is intentionally out of
 * scope — the goal is a valid, non-empty page that RESOLVES (so the card link
 * works) plus rich page metadata so a query-index can auto-populate the Latest
 * Stories block.
 *
 * Two hooks:
 *  - beforeTransform: strip all non-article chrome (nav/header/footer, cookie SDK,
 *    newsletter, related-articles rails, social share, media-cart, comments) so the
 *    body markdown stays small and clean. Reduce the article to its content root.
 *  - afterTransform: build a Metadata block (title, description, image,
 *    publisheddate ISO, category, template=story) read from the source <head>.
 *    WebImporter.rules.createMetadata (called by the import script) merges any
 *    Metadata block we add here into the page's front matter.
 */

const H = { before: 'beforeTransform', after: 'afterTransform' };

/** Read a meta tag's content by property/name (returns '' if absent). */
function meta(document, key) {
  const el = document.querySelector(
    `head meta[property="${key}"], head meta[name="${key}"]`,
  );
  return el ? (el.getAttribute('content') || '').trim() : '';
}

/** Strip the " - Škoda Storyboard" suffix WordPress appends to og:title. */
function cleanTitle(raw) {
  return raw.replace(/\s*[-|–]\s*Škoda Storyboard\s*$/i, '').trim();
}

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === H.before) {
    // Non-authorable site chrome + interactive/dynamic hooks. Bare header/footer
    // are safe to drop on an article page (unlike the landing page there are no
    // nested content headers to preserve).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.header',
      '.footer',
      '.navigation',
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '#ot-sdk-container',
      '.onetrust-pc-dark-filter',
      '#newsletter-popups',
      '.newsletter-popup',
      '.topbar__dropdown__newsletter',
      'form.mailguide-subscribe',
      'form.newsletter-form',
      // article page furniture that isn't the story body
      '.article-share',
      '.social-share',
      '.share',
      '.related-articles',
      '.related-posts',
      '.article-related',
      '.search-results',        // teaser rails ("read next")
      '.cover-box',
      '.breadcrumbs',
      '.breadcrumb',
      '.entry-tags',
      '.tags',
      '.article-toolbar',
      '.article-teaser-toolbar',
      'a.media-cart-action',
      '.comments',
      '#comments',
      'aside',
      '.sidebar',
      'iframe',
      'noscript',
      'link',
      'style',
      'script',
    ]);

    // Reduce to the article content root so html2md sees only the story. Fall back
    // to <main>/<body> when the theme's article wrapper isn't found.
    const root = document.querySelector(
      'article, main article, .single-article, .post-content, .entry-content',
    );
    if (root && root !== element) {
      // Keep only the article root's content inside the transform element.
      element.replaceChildren(...root.childNodes);
    }
  }

  if (hookName === H.after) {
    // De-derivative safety: keep referenced CDN derivatives as-is (do NOT strip the
    // -WxH suffix — full masters are 20-34 MB and 409 the content bus). Just drop
    // srcset/sizes so EDS regenerates a single optimized <picture>.
    element.querySelectorAll('img[src]').forEach((img) => {
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    });

    // --- Metadata block (merged into front matter by createMetadata) ---
    const title = cleanTitle(meta(document, 'og:title') || document.title || '');
    const description = meta(document, 'og:description') || meta(document, 'description');
    const image = meta(document, 'og:image');
    // article:published_time is a full ISO timestamp; keep the date portion for a
    // clean, sortable publisheddate (block sorts desc on this).
    const published = meta(document, 'article:published_time');
    const publishedDate = published ? published.slice(0, 10) : '';
    const category = meta(document, 'article:section');

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
    cells.push(['template', 'story']);

    const metadataBlock = WebImporter.Blocks.createBlock(document, {
      name: 'Metadata',
      cells,
    });
    element.appendChild(metadataBlock);
  }
}
