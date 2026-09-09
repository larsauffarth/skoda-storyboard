import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

// cards-media: teaser cards with image on top and title/text below (classic media card).
// Also serves the "social" variant: rows of [ icon cell | body cell ] where the first cell
// holds a `:name:` icon token (round-trips through DA) that we convert to an EDS icon span.
// Each row -> one card. First cell with a single picture = image; first cell with an icon
// token = icon; remaining cells = body.
const ICON_TOKEN = /^:([a-z0-9-]+):$/i;

function iconTokenToSpan(div) {
  const match = div.textContent.trim().match(ICON_TOKEN);
  if (!match) return false;
  const span = document.createElement('span');
  span.className = `icon icon-${match[1].toLowerCase()}`;
  div.replaceChildren(span);
  return true;
}

export default function decorate(block) {
  const social = block.classList.contains('social');
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-media-card-image';
      } else if (div.querySelector('span.icon') || iconTokenToSpan(div)) {
        // icon cell: either already a decorated icon span (DA converts :name: server-side)
        // or a raw :name: token we convert here.
        div.className = 'cards-media-card-icon';
      } else if (!div.textContent.trim() && !div.querySelector('picture') && !div.querySelector('span.icon')) {
        div.remove(); // drop empty image cell (e.g. dropped social icons)
      } else {
        div.className = 'cards-media-card-body';
      }
    });
    // flag cards with no image and no icon so CSS can render them without the media-card frame
    if (!li.querySelector('picture') && !li.querySelector('span.icon')) li.classList.add('cards-media-card-textonly');
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
  decorateIcons(block);
  if (social) block.classList.add('cards-media-social');
}
