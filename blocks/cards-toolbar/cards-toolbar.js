import { createOptimizedPicture } from '../../scripts/aem.js';

// cards-toolbar: teaser cards that carry a toolbar row (e.g. actions/links) beneath the body.
// The source media-cart "add" hooks are intentionally omitted at import time; this variant
// renders any remaining toolbar links as a static button row.
// Each row -> one card. Single-picture cell = image;
// a cell whose only content is links = toolbar; else body.
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-toolbar-card-image';
      } else if (div.children.length && [...div.children].every((c) => c.tagName === 'P' && c.querySelector('a'))) {
        div.className = 'cards-toolbar-card-toolbar';
      } else {
        div.className = 'cards-toolbar-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
