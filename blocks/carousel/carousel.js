import { createOptimizedPicture } from '../../scripts/aem.js';

// carousel: horizontal, draggable teaser rail (matches the source Flickity rails).
// Each block row -> one cell. First cell with a single picture = image; the rest = body
// (date + title link). Cards are frameless and sit directly on the section, exactly like
// cards-media/cards-toolbar. A viewport wraps the scrollable track; prev/next arrows and
// pointer-drag scroll it. Native overflow-x gives touch swipe + scroll-snap for free.

function updateArrows(track, prev, next) {
  const max = track.scrollWidth - track.clientWidth;
  const x = track.scrollLeft;
  prev.disabled = x <= 1;
  next.disabled = x >= max - 1;
}

function enableDrag(track) {
  let down = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('pointerdown', (e) => {
    // ignore right/middle click
    if (e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });

  const end = (e) => {
    if (!down) return;
    down = false;
    if (track.hasPointerCapture?.(e.pointerId)) track.releasePointerCapture(e.pointerId);
    // suppress the click that follows a drag so cards don't navigate on swipe
    if (moved) {
      const stop = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
      track.addEventListener('click', stop, { capture: true, once: true });
    }
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'carousel-card-image';
      } else if (!div.textContent.trim() && !div.querySelector('picture')) {
        div.remove(); // drop empty image cell
      } else {
        div.className = 'carousel-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Two source card styles, distinguished by whether a card carries a date:
  //  - POST rails (eMobility / Lifestyle / Škoda World / Latest News): dated teasers
  //    with the title OVERLAID white on the image (like cards-overlay).
  //  - TAXONOMY rails (Models / Series): no date, title sits BELOW the image in bold.
  // Detect by presence of a date paragraph in any card body, then tag the block so
  // CSS can render the matching layout.
  const hasDate = [...ul.querySelectorAll('.carousel-card-body')]
    .some((body) => body.querySelector('p') && body.querySelector('p').textContent.trim());
  block.classList.add(hasDate ? 'carousel-overlay' : 'carousel-caption');

  // structure: viewport > track(ul) + arrows
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.append(ul);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-arrow carousel-arrow-prev';
  prev.setAttribute('aria-label', 'Previous');

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-arrow carousel-arrow-next';
  next.setAttribute('aria-label', 'Next');

  const scrollByCards = (dir) => {
    const card = ul.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    const pages = Math.max(1, Math.floor(track.clientWidth / step));
    track.scrollBy({ left: dir * step * pages, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByCards(-1));
  next.addEventListener('click', () => scrollByCards(1));
  track.addEventListener('scroll', () => updateArrows(track, prev, next), { passive: true });
  window.addEventListener('resize', () => updateArrows(track, prev, next));

  enableDrag(track);

  viewport.append(prev, track, next);
  block.replaceChildren(viewport);

  // set initial arrow state after layout settles
  requestAnimationFrame(() => updateArrows(track, prev, next));
}
