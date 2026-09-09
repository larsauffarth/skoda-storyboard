import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICON_TOKEN = /^:([a-z0-9-]+):$/i;

// Convert a link whose text is a bare :name: token into an icon link.
function decorateSocialIcons(root) {
  root.querySelectorAll('a').forEach((a) => {
    const match = a.textContent.trim().match(ICON_TOKEN);
    if (!match) return;
    const span = document.createElement('span');
    span.className = `icon icon-${match[1].toLowerCase()}`;
    a.replaceChildren(span);
    a.setAttribute('aria-label', match[1]);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Name the three sections: social intro, nav columns, legal/copyright.
  const classes = ['footer-social', 'footer-nav', 'footer-legal'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(c);
  });

  // Social row: label / icon row / app links, then turn :icon: tokens into glyphs.
  // Paragraphs live under an EDS .default-content-wrapper, so match by descendant.
  const social = footer.querySelector('.footer-social');
  if (social) {
    const paras = social.querySelectorAll('p');
    if (paras[0]) paras[0].classList.add('footer-social-title');
    if (paras[1]) paras[1].classList.add('footer-social-icons');
    if (paras[2]) paras[2].classList.add('footer-social-apps');
    decorateSocialIcons(social);
  }

  block.append(footer);
  decorateIcons(block);
}
