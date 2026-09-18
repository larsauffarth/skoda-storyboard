// tags: the per-article tag / category row (spec: docs/ui-specs/tags.md).
//
// Renders authored tag links as grey `.label` pills (measured default), wrapping
// with a flex gap (retires the source float+clearfix). Count-agnostic. Content
// sniffing: a cell/paragraph containing an <a> → a linked tag; plain text → a
// static label. Empty cells are skipped (defensive).
//
// Variant `Tags (chips)`: the green emerald filter-chip style for facet reuse; a
// tag marked active (authored in <strong>) gets .active + aria-current.
//
// Authoring:
//   | Tags |                                        |
//   | [2026](/en/tag/years/2026/) | [Epiq](/en/tag/model/epiq/) |
// or a single cell holding several links (each <a> becomes a pill).

export default function decorate(block) {
  const chips = block.classList.contains('chips');

  // Collect every anchor, else fall back to plain-text cells. Anchors are
  // gathered once from the whole block (avoids double-counting nested cells);
  // only if there are no links do we treat leaf cells as static labels.
  const items = [];
  const anchors = [...block.querySelectorAll('a')];
  if (anchors.length) {
    anchors.forEach((a) => {
      items.push({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
        active: !!a.closest('strong'),
      });
    });
  } else {
    // leaf cells only (a cell that contains no further <div> wrapper)
    block.querySelectorAll(':scope > div > div').forEach((cell) => {
      if (cell.querySelector('div')) return;
      const text = cell.textContent.trim();
      if (text) items.push({ text, href: null, active: !!cell.querySelector('strong') });
    });
  }

  const ul = document.createElement('ul');
  ul.className = 'tags-list';

  items.filter((it) => it.text).forEach((it) => {
    const li = document.createElement('li');
    const el = it.href ? document.createElement('a') : document.createElement('span');
    el.className = 'tag-label';
    el.textContent = it.text;
    if (it.href) el.setAttribute('href', it.href);
    if (chips && it.active) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'true');
    }
    li.append(el);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
