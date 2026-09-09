/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel. Base: cards.
 * Source: https://www.skoda-storyboard.com/en/
 *
 * Follows the EDS Carousel convention: a 2-column table whose first row is the block
 * name and each subsequent row is ONE slide — [ image cell | text cell ]. The image is
 * the only content in the first cell; the text cell holds an optional date, the title as
 * a Heading link, and (implicitly) the CTA via that title link.
 *
 * Instances (page-templates.json) — the horizontal draggable teaser rails (Flickity on source):
 *   - div.cover-box .search-results.type-skoda_model       (Models rail)
 *   - div.cover-box.dark .search-results.type-skoda_series (Series rail — dark section)
 *   - div.cover-box .search-results.type-press_release     (Latest News rail)
 *   - div.cover-box .search-results.type-post              (eMobility / Lifestyle / Škoda World story rails)
 *
 * Per item: <article> with an image (.entry-thumbnail img / .article-teaser-media img),
 * an optional date (.entry-published) and a title heading link (h3.entry-title > a).
 * The media-cart 'add' toolbar is stripped by skoda-cleanup before this runs.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.search-results-item, article'));
  const wrappers = items.filter((el) => el.matches('.search-results-item'));
  const list = wrappers.length ? wrappers : items.filter((el) => el.matches('article'));

  const cells = [];

  list.forEach((item) => {
    const article = item.matches('article') ? item : item.querySelector('article');
    const scope = article || item;

    // --- slide image cell (image only) ---
    const img = scope.querySelector('.entry-thumbnail img, .article-teaser-media img, img');
    const imageCell = document.createElement('div');
    if (img) imageCell.append(img);

    // --- slide text cell: date (optional) + title heading link ---
    const textCell = [];

    const date = scope.querySelector('.entry-meta .entry-published, .entry-published');
    if (date && date.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textCell.push(dateP);
    }

    const heading = scope.querySelector('h3.entry-title, .entry-title');
    if (heading) {
      const innerLink = heading.querySelector('a[href]');
      if (innerLink) {
        textCell.push(heading);
      } else {
        // fall back to the wrapping card anchor if the heading has no inner link
        const wrapLink = scope.querySelector('a.article-teaser-media[href], a[href]:not([href="#"]):not([href=""])');
        const h = document.createElement('h3');
        if (wrapLink && wrapLink.getAttribute('href')) {
          const a = document.createElement('a');
          a.setAttribute('href', wrapLink.getAttribute('href'));
          a.textContent = heading.textContent.trim();
          h.append(a);
        } else {
          h.textContent = heading.textContent.trim();
        }
        textCell.push(h);
      }
    }

    if (img || textCell.length) {
      cells.push([imageCell, textCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
