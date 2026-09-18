/*
 * tag-picker.js — a DA (da.live) / Experience Workspace library plugin that lets an
 * author MULTI-SELECT from a controlled tag list and writes the choice back into the
 * document. No App Builder, no Adobe Developer Console: this is a plain hosted static
 * page registered in a `library` config sheet, talking to the editor over the DA_SDK
 * postMessage bridge (https://docs.da.live/developers/guides/developing-apps-and-plugins).
 *
 * Flow:
 *   1. render the picker immediately (so the UI never depends on the DA handshake)
 *   2. connect to DA in the background; enable Insert once connected
 *   3. author ticks any number of tags
 *   4. Insert -> build a `Tags` block and actions.sendHTML() it into the document
 *
 * Confirmed DA_SDK actions: sendText / sendHTML / closeLibrary. Writing directly to a
 * metadata FIELD isn't documented, so we emit a Tags block (the SKODA-205 content
 * model) via sendHTML, which the existing tags/query-index blocks already consume.
 */

import TAXONOMY from './taxonomy.js';

const SDK_URL = 'https://da.live/nx/utils/sdk.js';

// Optional: a published DA sheet to source the vocabulary from instead of the
// hardcoded list, e.g. '/config/taxonomy.json'. Leave null to use TAXONOMY.
const TAXONOMY_SHEET = null;

// How long to wait for the DA connection handshake before assuming standalone.
const CONNECT_TIMEOUT_MS = 1500;

/**
 * Connect to the DA host and return the resolved SDK ({ context, token, actions }),
 * or null when not inside DA. `DA_SDK` (mod.default) is a promise that only settles
 * once the parent da.live frame completes the postMessage handshake, so opened
 * standalone it never resolves — we short-circuit when there's no parent frame and
 * race a timeout as a backstop, so the UI is never blocked on it.
 */
async function connect() {
  if (window.parent === window) return null; // no DA host framing this page
  try {
    // eslint-disable-next-line import/no-unresolved
    const mod = await import(SDK_URL);
    const timeout = new Promise((resolve) => {
      setTimeout(() => resolve(null), CONNECT_TIMEOUT_MS);
    });
    return await Promise.race([mod.default, timeout]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('tag-picker: DA_SDK unavailable (running standalone?)', e);
    return null;
  }
}

/**
 * Resolve the vocabulary. When TAXONOMY_SHEET is set, fetch it (authenticated with
 * the SDK token when present) so the client can govern the list from a sheet; on any
 * failure fall back to the hardcoded TAXONOMY.
 */
async function loadTaxonomy(sdk) {
  if (!TAXONOMY_SHEET) return TAXONOMY;
  try {
    const headers = sdk?.token ? { Authorization: `Bearer ${sdk.token}` } : {};
    const res = await fetch(TAXONOMY_SHEET, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rows = json.data || json; // DA sheet-as-JSON wraps rows under `data`
    const list = rows
      .map((r) => ({ value: (r.value || r.slug || '').trim(), label: (r.label || r.title || r.value || '').trim() }))
      .filter((r) => r.value);
    return list.length ? list : TAXONOMY;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('tag-picker: taxonomy sheet fetch failed, using built-in list', e);
    return TAXONOMY;
  }
}

/** The values currently ticked, in list order. */
function selectedValues(root) {
  return [...root.querySelectorAll('input[type="checkbox"]:checked')].map((cb) => cb.value);
}

/**
 * Build the `Tags` block markup DA will paste into the document: one row, one cell
 * per chosen tag, each an anchor to its tag archive (/en/tag/<slug>/). Matches the
 * Tags block spec (docs/ui-specs/tags.md) so downstream decoration renders pills.
 */
function buildTagsBlockHTML(values) {
  const cells = values
    .map((v) => `<td><a href="/en/tag/${v}/">${v}</a></td>`)
    .join('');
  return `<table><tbody><tr><th>Tags</th></tr><tr>${cells}</tr></tbody></table>`;
}

/**
 * Render the checkbox list + toolbar into `root`. `state.sdk` may be null now and set
 * later once the DA connection lands; the returned `refresh` re-reads it to enable
 * Insert and update the help text. Everything paints without waiting for DA.
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
      ? 'Select one or more tags, then Insert.'
      : 'Preview only — open this inside da.live / Experience Workspace to insert.';
    // eslint-disable-next-line no-use-before-define
    insert.disabled = !state.sdk || n === 0;
  };
  fieldset.addEventListener('change', refresh);

  const selectAll = document.createElement('button');
  selectAll.type = 'button';
  selectAll.className = 'tp-btn';
  selectAll.textContent = 'Select all';
  selectAll.addEventListener('click', () => {
    fieldset.querySelectorAll('input').forEach((cb) => { cb.checked = true; });
    refresh();
  });

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
  insert.textContent = 'Insert';
  insert.addEventListener('click', async () => {
    const values = selectedValues(root);
    if (!state.sdk || !values.length) return;
    await state.sdk.actions.sendHTML(buildTagsBlockHTML(values));
    state.sdk.actions.closeLibrary?.();
  });

  bar.append(selectAll, clear, count, insert);
  root.append(bar);
  refresh();

  return { refresh };
}

async function init() {
  const root = document.querySelector('#app');
  const state = { sdk: null };
  // Paint the picker straight away; the DA connection (needed only for Insert) lands
  // asynchronously and flips Insert on when ready.
  const list = await loadTaxonomy(state.sdk);
  const ui = render(root, list, state);
  state.sdk = await connect();
  ui.refresh();
}

init();
