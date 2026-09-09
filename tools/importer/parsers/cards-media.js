/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-media. Base: cards.
 * Source: https://www.skoda-storyboard.com/en/
 * Generated: 2026-09-09
 *
 * Instances (page-templates.json) — image-above / title-below rails:
 *   - div.cover-box.dark.socials-static .search-results.type-social   (social channels: svg icon + @handle, link is the wrapping <a>)
 *   - div.cover-box .search-results.type-skoda_model                  (Models rail: entry-thumbnail img + model name link)
 *   - div.cover-box.dark .search-results.type-skoda_series            (Series rail: entry-thumbnail img + title link)
 *   - div.cover-box .search-results.type-press_release                (Latest News rail: article-teaser-media img + title link)
 *
 * Per item shapes:
 *   social:        <article><a.article-teaser-media href><div.article-teaser-overlay><img><h3.entry-title>@handle</h3></div></a></article>
 *   model/series:  <article><div.entry-thumbnail><...><img></div><h3.entry-title><a href>Name</a></h3><a.link-more></a></article>
 *   press_release: <article>.article-teaser-media .entry-thumbnail img + .article-teaser-overlay h3.entry-title>a
 *
 * Output: Cards, 2 columns. One row per card: [ image cell | body cell ].
 * Body cell holds the title as a heading link (for social, the whole card links via the wrapping anchor).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.search-results-item, article'));
  // Prefer the wrapper items; fall back to bare articles if items class is absent.
  const cards = items.filter((el) => el.matches('.search-results-item') || el.matches('article'));
  // De-dupe: if we matched .search-results-item wrappers, drop nested articles.
  const wrappers = cards.filter((el) => el.matches('.search-results-item'));
  const list = wrappers.length ? wrappers : cards;

  const cells = [];

  list.forEach((item) => {
    const article = item.matches('article') ? item : item.querySelector('article');
    const scope = article || item;

    // --- image cell (image must be a direct child of a div) ---
    const img = scope.querySelector('.entry-thumbnail img, .article-teaser-media img, img');
    const imageCell = document.createElement('div');
    if (img) imageCell.append(img);

    // --- body cell: title link ---
    const bodyCell = [];

    // Existing heading with an inner link (model / series / press_release).
    let heading = scope.querySelector('h3.entry-title, .entry-title');

    if (heading) {
      const innerLink = heading.querySelector('a[href]');
      if (innerLink) {
        // Reuse the heading as-is (heading wrapping a link).
        bodyCell.push(heading);
      } else {
        // Social case: heading text (@handle) with no inner link; the card link is the wrapping anchor.
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
        bodyCell.push(h);
      }
    }

    if (img || bodyCell.length) {
      cells.push([imageCell, bodyCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-media', cells });
  element.replaceWith(block);
}
