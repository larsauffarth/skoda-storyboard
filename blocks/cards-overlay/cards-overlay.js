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
  // Eager-load the first card's image: on the landing page the first featured
  // card is the LCP element, so build it high-priority (eager + fetchpriority)
  // and lazy-load the rest. Discovering the LCP image late (blocks decorate
  // after fetch) is the main mobile-throttled score cost, so hint it hard.
  ul.querySelectorAll('picture > img').forEach((img, i) => {
    const eager = i === 0;
    const optimized = createOptimizedPicture(img.src, img.alt, eager, [{ width: '750' }]);
    if (eager) optimized.querySelector('img')?.setAttribute('fetchpriority', 'high');
    img.closest('picture').replaceWith(optimized);
  });

  // Featured-grid layouts (match the source's promo-box / latest-articles):
  //  - 3 items  -> promo grid: 1 large (left) + 2 stacked (right)
  //  - 5 items  -> latest grid: 2 large (top row) + 3 medium (bottom row)
  // any other count keeps the default uniform card grid.
  const count = ul.children.length;
  if (count === 3) block.classList.add('cards-overlay-featured', 'cards-overlay-promo');
  else if (count === 5) block.classList.add('cards-overlay-featured', 'cards-overlay-latest');

  block.replaceChildren(ul);
}
