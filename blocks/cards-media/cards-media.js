import { createOptimizedPicture } from '../../scripts/aem.js';

// cards-media: teaser cards with image on top and title/text below (classic media card).
// Each row -> one card. First cell with a single picture = image; remaining = body.
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-media-card-image';
      else if (!div.textContent.trim() && !div.querySelector('picture')) div.remove(); // drop empty image cell (e.g. dropped social icons)
      else div.className = 'cards-media-card-body';
    });
    // flag cards with no image so CSS can render them without the media-card frame
    if (!li.querySelector('picture')) li.classList.add('cards-media-card-textonly');
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
