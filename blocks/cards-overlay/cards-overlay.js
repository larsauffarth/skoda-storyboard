import { createOptimizedPicture } from '../../scripts/aem.js';

// cards-overlay: teaser cards with text overlaid on top of the image.
// Each row -> one card. First cell with a single picture = image; remaining = overlaid body.
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-overlay-card-image';
      else div.className = 'cards-overlay-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Featured-grid layouts (match the source's promo-box / latest-articles):
  //  - 3 items  -> promo grid: 1 large (left) + 2 stacked (right)
  //  - 5 items  -> latest grid: 2 large (top row) + 3 medium (bottom row)
  // any other count keeps the default uniform card grid.
  const count = ul.children.length;
  if (count === 3) block.classList.add('cards-overlay-featured', 'cards-overlay-promo');
  else if (count === 5) block.classList.add('cards-overlay-featured', 'cards-overlay-latest');

  block.replaceChildren(ul);
}
