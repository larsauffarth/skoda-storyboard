import { getMetadata, decorateIcons } from '../../scripts/aem.js';

// social-share: page-level share control (spec: docs/ui-specs/social-share.md).
//
// A floating trigger that expands into a row of per-network share links for the
// CURRENT page. Content is URL-driven, so the block needs almost no authored
// input — just an optional network subset. Distinct from the footer FOLLOW
// links (brand profiles); this is SHARE-intent for this URL.
//
// Progressive enhancement: where navigator.share exists, the trigger performs a
// native share; the per-network menu remains as the fallback / explicit choice.
//
// Authoring:
//   | Social share |                                  |
//   | networks | x, pinterest, linkedin, facebook, whatsapp |
// (empty cell → default set). Variant `Social share (inline)` renders in-flow
// under the article header instead of floating.

const DEFAULT_NETWORKS = ['x', 'pinterest', 'linkedin', 'facebook', 'whatsapp'];

const LABELS = {
  x: 'X',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
};

/** Build the share-intent URL for a network for the current page. */
function intentURL(network, { url, title, img }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const i = encodeURIComponent(img || '');
  switch (network) {
    case 'x': return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case 'pinterest': return `https://pinterest.com/pin/create/bookmarklet?url=${u}&media=${i}&description=${t}`;
    case 'linkedin': return `https://linkedin.com/shareArticle?mini=true&url=${u}&title=${t}&summary=${t}`;
    case 'facebook': return `https://www.facebook.com/dialog/share?href=${u}`;
    case 'whatsapp': return `whatsapp://send?text=${t} - ${u}`;
    default: return url;
  }
}

/** Read the optional comma-separated `networks` config row. */
function readNetworks(block) {
  let list = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    const val = (cells.length > 1 ? cells[1] : cells[0])?.textContent.trim() || '';
    if (key === 'networks' || cells.length === 1) {
      list = val.split(',').map((s) => s.trim().toLowerCase()).filter((s) => LABELS[s]);
    }
  });
  return list.length ? list : DEFAULT_NETWORKS;
}

export default function decorate(block) {
  const inline = block.classList.contains('inline');
  const networks = readNetworks(block);
  const url = window.location.href;
  const title = getMetadata('og:title') || document.title;
  const img = getMetadata('og:image');

  block.textContent = '';

  const menuId = `social-share-menu-${Math.floor(performance.now())}`;

  // Trigger — a real button with full ARIA.
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'social-share-trigger';
  trigger.setAttribute('aria-label', 'Share this page');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', menuId);
  const triggerIcon = document.createElement('span');
  triggerIcon.className = 'icon icon-share';
  trigger.append(triggerIcon);

  // Menu — list of per-network share links.
  const menu = document.createElement('ul');
  menu.className = 'social-share-menu';
  menu.id = menuId;
  networks.forEach((n) => {
    const li = document.createElement('li');
    li.className = `social-share-item social-share-${n}`;
    const a = document.createElement('a');
    a.href = intentURL(n, { url, title, img });
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', `Share on ${LABELS[n]}`);
    a.dataset.ctatype = LABELS[n];
    const ic = document.createElement('span');
    ic.className = `icon icon-${n}`;
    a.append(ic);
    li.append(a);
    menu.append(li);
  });

  const close = () => {
    block.classList.remove('expanded');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    block.classList.add('expanded');
    trigger.setAttribute('aria-expanded', 'true');
  };

  trigger.addEventListener('click', async () => {
    // Progressive enhancement: native share where available.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        // user cancelled or unsupported payload — fall back to the menu
      }
    }
    if (block.classList.contains('expanded')) close(); else open();
  });

  // Esc closes and returns focus to the trigger.
  block.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('expanded')) {
      close();
      trigger.focus();
    }
  });
  // Click-away closes.
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) close();
  });

  block.classList.add(inline ? 'social-share-inline' : 'social-share-floating');
  block.append(trigger, menu);
  decorateIcons(block);
}
