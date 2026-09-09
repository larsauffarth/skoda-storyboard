/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-overlay. Base: cards.
 * Source: https://www.skoda-storyboard.com/en/
 * Generated: 2026-09-09
 *
 * Instances (page-templates.json):
 *   - main.main > section.promo-box                          (featured 1+2 promo grid, has entry-summary)
 *   - div.cover-box .search-results.latest-articles          (Latest Stories grid, no entry-summary)
 *
 * Each source teaser is an <article class="article-teaser"> with:
 *   .article-teaser-media img                (card image)
 *   .article-teaser-overlay .entry-published (date, optional)
 *   .article-teaser-overlay h3.entry-title>a (heading link)
 *   .article-teaser-overlay p.entry-summary  (summary, optional — only on promo-box)
 *   .article-teaser-toolbar .media-cart-action.add  (dynamic media-cart hook — OMITTED)
 *
 * Output: Cards, 2 columns. One row per card: [ image cell | body cell ].
 * Body cell holds date (optional) + heading link + summary (optional).
 */
export default function parse(element, { document }) {
  const teasers = Array.from(element.querySelectorAll('article.article-teaser'));
  const cells = [];

  teasers.forEach((teaser) => {
    // --- image cell (image must be a direct child of a div) ---
    const img = teaser.querySelector('.article-teaser-media img, .entry-thumbnail img, img');
    const imageCell = document.createElement('div');
    if (img) imageCell.append(img);

    // --- body cell ---
    const bodyCell = [];

    const date = teaser.querySelector('.entry-meta .entry-published, .entry-published');
    if (date && date.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      bodyCell.push(dateP);
    }

    const heading = teaser.querySelector('h3.entry-title, .entry-title');
    if (heading) bodyCell.push(heading);

    const summary = teaser.querySelector('p.entry-summary, .entry-summary');
    if (summary && summary.textContent.trim()) bodyCell.push(summary);

    // Media-cart 'add' toolbar hooks (.article-teaser-toolbar .media-cart-action) are intentionally omitted.

    // Only emit a row if the card carries an image or body content.
    if (img || bodyCell.length) {
      cells.push([imageCell, bodyCell]);
    }
  });

  // Empty-block guard: nothing extracted → unwrap.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-overlay', cells });
  element.replaceWith(block);
}
