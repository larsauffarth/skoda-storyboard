/*
 * stories-tag.js — a DA (da.live) / Experience Workspace library plugin that inserts
 * a `stories` block PRE-CONFIGURED to a chosen category (or categories), so an author
 * picks the tag from a list instead of typing a config row.
 *
 * No App Builder / Developer Console: a hosted static page registered in a `library`
 * config sheet, talking to the editor over the DA_SDK postMessage bridge
 * (https://docs.da.live/developers/guides/developing-apps-and-plugins).
 *
 * Flow: render immediately -> connect to DA in the background -> author ticks one or
 * more categories -> Insert emits a `stories` block whose `category` row carries the
 * selection, via actions.sendHTML(). The stories block (blocks/stories/stories.js)
 * reads that `category` row as a positive include filter.
 */

import CATEGORIES from './categories.js';

const SDK_URL = 'https://da.live/nx/utils/sdk.js';
const CONNECT_TIMEOUT_MS = 1500;

/**
 * Connect to the DA host, or return null when not inside DA. `DA_SDK` (mod.default)
 * only settles after the parent da.live frame completes its postMessage handshake, so
 * standalone it never resolves — we short-circuit with no parent frame and race a
 * timeout, so the UI is never blocked on it.
 */
async function connect() {
  if (window.parent === window) return null;
  try {
    // eslint-disable-next-line import/no-unresolved
    const mod = await import(SDK_URL);
    const timeout = new Promise((resolve) => {
      setTimeout(() => resolve(null), CONNECT_TIMEOUT_MS);
    });
    return await Promise.race([mod.default, timeout]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('stories-tag: DA_SDK unavailable (running standalone?)', e);
    return null;
  }
}

/** The category values currently ticked, in list order. */
function selectedValues(root) {
  return [...root.querySelectorAll('input[type="checkbox"]:checked')].map((cb) => cb.value);
}

/**
 * Build a `stories` block pre-configured to the chosen categories. First row is the
 * block name; the `category` row is a comma-joined include list the stories block
 * reads (blocks/stories/stories.js readConfig).
 */
function buildStoriesBlockHTML(values) {
  const category = values.join(', ');
  return `<table><tbody><tr><td>stories</td></tr><tr><td>category</td><td>${category}</td></tr></tbody></table>`;
}

/**
 * Render the category list + toolbar. `state.sdk` may be null now and set once the DA
 * connection lands; the returned `refresh` re-reads it to enable Insert and update the
 * help text. The UI paints without waiting for DA.
 */
function render(root, list, state) {
  root.textContent = '';

  const help = document.createElement('p');
  help.className = 'tp-help';
  root.append(help);

  const fieldset = document.createElement('div');
  fieldset.className = 'tp-list';
  list.forEach(({ value, label }) => {
    const item = document.createElement('label');
    item.className = 'tp-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = value;
    const text = document.createElement('span');
    text.textContent = label;
    item.append(cb, text);
    fieldset.append(item);
  });
  root.append(fieldset);

  const bar = document.createElement('div');
  bar.className = 'tp-bar';

  const count = document.createElement('span');
  count.className = 'tp-count';

  const refresh = () => {
    const n = selectedValues(root).length;
    count.textContent = n ? `${n} selected` : 'None selected';
    help.textContent = state.sdk
      ? 'Pick one or more categories, then Insert a Stories feed filtered to them.'
      : 'Preview only — open this inside da.live / Experience Workspace to insert.';
    // eslint-disable-next-line no-use-before-define
    insert.disabled = !state.sdk || n === 0;
  };
  fieldset.addEventListener('change', refresh);

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'tp-btn';
  clear.textContent = 'Clear';
  clear.addEventListener('click', () => {
    fieldset.querySelectorAll('input').forEach((cb) => { cb.checked = false; });
    refresh();
  });

  const insert = document.createElement('button');
  insert.type = 'button';
  insert.className = 'tp-btn tp-btn-primary';
  insert.textContent = 'Insert Stories block';
  insert.addEventListener('click', async () => {
    const values = selectedValues(root);
    if (!state.sdk || !values.length) return;
    await state.sdk.actions.sendHTML(buildStoriesBlockHTML(values));
    state.sdk.actions.closeLibrary?.();
  });

  bar.append(clear, count, insert);
  root.append(bar);
  refresh();

  return { refresh };
}

async function init() {
  const root = document.querySelector('#app');
  const state = { sdk: null };
  const ui = render(root, CATEGORIES, state);
  state.sdk = await connect();
  ui.refresh();
}

init();
