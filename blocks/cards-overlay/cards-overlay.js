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
  // Featured-grid layouts (match the source's promo-box / latest-articles):
  //  - 3 items  -> promo grid: 1 large (left) + 2 stacked (right)
  //  - 5 items  -> latest grid: 2 large (top row) + 3 medium (bottom row)
  // any other count keeps the default uniform card grid.
  const count = ul.children.length;
  const isPromo = count === 3;
  if (isPromo) block.classList.add('cards-overlay-featured', 'cards-overlay-promo');
  else if (count === 5) block.classList.add('cards-overlay-featured', 'cards-overlay-latest');

  // LCP handling. The featured promo sits at the top of the page; on desktop all
  // three cards are above the fold, and on mobile they STACK single-column so any
  // of them can be the LCP element. So for the promo, build EVERY card image
  // eager (there are only 3) and hint the first `fetchpriority=high`. For other
  // layouts keep only the first eager, rest lazy. Discovering the LCP image late
  // (blocks decorate after fetch) is the main mobile-throttled score cost.
  ul.querySelectorAll('picture > img').forEach((img, i) => {
    const eager = isPromo || i === 0;
    const optimized = createOptimizedPicture(img.src, img.alt, eager, [{ width: '750' }]);
    if (i === 0) optimized.querySelector('img')?.setAttribute('fetchpriority', 'high');
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
