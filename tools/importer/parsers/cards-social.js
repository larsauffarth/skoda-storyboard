/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Social media block. Base: cards (cards-media variant).
 * Source: https://www.skoda-storyboard.com/en/  (div.cover-box.dark.socials-static .search-results.type-social)
 *
 * Follows the Cards convention: a 2-column table whose first row is the block name and
 * each subsequent row is ONE card — [ image/icon cell | text cell ]. The first cell holds
 * the mandatory icon; the text cell holds the @handle as a Heading link (also the CTA).
 *
 * Each source channel is <a.article-teaser-media href><div.article-teaser-overlay><img data:svg><h3.entry-title>@handle</h3></div></a>.
 * The source icon is an inline base64 data: SVG, which does NOT survive the DA/markdown
 * round-trip — that is why the icons were dropped on the first import. We instead map each
 * channel (by its destination URL) to a committed brand icon under /icons/ and emit the EDS
 * icon-span token (`:facebook:` etc.) so it round-trips cleanly and re-decorates on render.
 *
 * Output: cards-media (social) block, one row per channel: [ icon cell | body cell (@handle link) ].
 */
const ICON_BY_HOST = [
  { match: /facebook\./i, icon: 'facebook' },
  { match: /instagram\./i, icon: 'instagram' },
  { match: /youtube\.|youtu\.be/i, icon: 'youtube' },
];

function iconTokenFor(href) {
  const found = ICON_BY_HOST.find((m) => m.match.test(href || ''));
  return found ? `:${found.icon}:` : '';
}

export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.search-results-item'));
  const list = items.length ? items : Array.from(element.querySelectorAll('article'));

  const cells = [];

  list.forEach((item) => {
    const scope = item.querySelector('article') || item;
    const link = scope.querySelector('a.article-teaser-media[href], a[href]:not([href="#"]):not([href=""])');
    const href = link ? link.getAttribute('href') : '';
    const heading = scope.querySelector('h3.entry-title, .entry-title');
    const handle = heading ? heading.textContent.trim() : '';

    // --- icon cell (mandatory first cell): EDS icon token; survives DA, re-decorated on render ---
    const iconCell = document.createElement('div');
    const token = iconTokenFor(href);
    if (token) iconCell.textContent = token;

    // --- text cell: @handle as a heading link ---
    const bodyCell = [];
    const h = document.createElement('h3');
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = handle;
      h.append(a);
    } else {
      h.textContent = handle;
    }
    bodyCell.push(h);

    if (handle) cells.push([iconCell, bodyCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-media (social)', cells });
  element.replaceWith(block);
}
