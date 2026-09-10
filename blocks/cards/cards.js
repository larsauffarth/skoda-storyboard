import optimizeImageInPlace from '../../scripts/optimized-picture.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  // Optimize in place (preserve the document's original <img> node) so images
  // stay editable in EW Layout mode. See scripts/optimized-picture.js.
  ul.querySelectorAll('picture > img').forEach((img) => optimizeImageInPlace(img, false, [{ width: '750' }]));
  block.replaceChildren(ul);
}
