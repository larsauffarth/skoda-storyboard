/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-toolbar. Base: cards.
 * Source: https://www.skoda-storyboard.com/en/
 * Generated: 2026-09-09
 *
 * Instance (page-templates.json):
 *   - div.cover-box .search-results.type-post   (category story rails: eMobility / Lifestyle / Škoda World)
 *
 * Each item is an <article class="article-teaser"> with:
 *   .article-teaser-media img                        (card image)
 *   .article-teaser-overlay .entry-published         (date, optional)
 *   .article-teaser-overlay h3.entry-title>a         (heading link)
 *   .article-teaser-toolbar .media-cart-action.add   (dynamic media-cart 'add' hook — OMITTED, data-event/data-action/data-id)
 *
 * The source toolbar carries ONLY media-cart add hooks (href="#"), which must be omitted.
 * Since no genuine (non-cart) toolbar link remains, NO toolbar cell is emitted →
 * output is Cards, 2 columns. One row per card: [ image cell | body cell ].
 * Body cell holds date (optional) + heading link. A third toolbar cell is added
 * only if a real non-cart link is found (defensive, cross-page).
 */
export default function parse(element, { document }) {
  const teasers = Array.from(element.querySelectorAll('article.article-teaser'));

  // Determine whether ANY teaser carries a genuine, non-cart toolbar link.
  const isRealToolbarLink = (a) => {
    if (!a) return false;
    if (a.classList.contains('media-cart-action')) return false;
    const href = (a.getAttribute('href') || '').trim();
    return href && href !== '#';
  };
  const hasToolbar = teasers.some((t) => Array.from(
    t.querySelectorAll('.article-teaser-toolbar a[href]'),
  ).some(isRealToolbarLink));

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

    const row = [imageCell, bodyCell];

    // Only include a toolbar cell if the block genuinely carries non-cart links.
    if (hasToolbar) {
      const toolbarCell = [];
      Array.from(teaser.querySelectorAll('.article-teaser-toolbar a[href]'))
        .filter(isRealToolbarLink)
        .forEach((a) => toolbarCell.push(a));
      row.push(toolbarCell);
    }

    if (img || bodyCell.length) {
      cells.push(row);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-toolbar', cells });
  element.replaceWith(block);
}
