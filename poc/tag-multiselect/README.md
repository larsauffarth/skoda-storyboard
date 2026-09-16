# PoC: multi-select tag picker for DA / Experience Workspace (no App Builder)

## What this proves

The client asked whether the WYSIWYG editor can handle a "complex config task": show an
author a controlled tag list and let them pick several at once, instead of typing
comma-separated text. This PoC answers yes, and does it the DA/EW-native way, with no
App Builder and no Adobe Developer Console.

It's a **DA library plugin**: a plain hosted static page (`index.html` + `tag-picker.js`
+ `tag-picker.css`) registered in a `library` config sheet. It talks to the editor over
the `DA_SDK` postMessage bridge, renders the project's fixed 15-facet taxonomy as a
real multi-select, and on Insert writes a `Tags` block into the document via
`actions.sendHTML()`.

This is authoring only. It's not a rendered end-user block. Once the tags are in the
document, the existing `tags` / query-index / `story-rail` / `stories` blocks consume
them as they already do.

## Why this route (and the D13 tie-in)

The authoring-model choice is open decision **D13 (DA/EW vs Universal Editor)**. Here's
how the routes to a multi-select tag picker compare:

| Route | Multi-select | App Builder / Dev Console | Dynamic list | Notes |
|---|---|---|---|---|
| **DA library plugin** (this PoC) | Yes, full control | **No** | Yes (fetch a sheet) | DA/EW-native, keeps D13 open |
| Native structured-content `enum` | Single-select confirmed; array-of-enum **undocumented** | No | No (static) | Great for one value per field |
| Universal Editor `multiselect` | Yes | No, but means adopting UE | No (static) | Pushes D13 toward UE |
| UE custom field-type extension | Yes | **Yes, required** | Yes | The App-Builder path we're avoiding |

The plugin wins because it's the only route that gives real multi-select, needs no App
Builder, stays on the DA/EW stack (so it doesn't force D13), and can source the list
dynamically later.

## Files

- `index.html`, the plugin page the `library` sheet points at.
- `tag-picker.js`, connects to `DA_SDK`, renders the multi-select, writes back a `Tags` block.
- `taxonomy.js`, the 15 facets (single source; swap for a sheet fetch to govern the list).
- `tag-picker.css`, palette styling (self-contained, no repo tokens).

## Wire it up in a DA/EW tenant

1. **Host the plugin.** Push this branch and use the preview URL,
   `https://{branch}--{repo}--{owner}.aem.page/poc/tag-multiselect/index.html`, or drop
   the folder on any HTTPS static host.
2. **Register it.** In the site's DA config, add a sheet named `library` with a row:

   | title | path | icon | format | ref |
   |---|---|---|---|---|
   | Tag picker | `<hosted-url>/index.html` |  |  |  |

   (Confirm the exact `format` value for a palette/dialog plugin against a working
   example, the DA docs are slightly inconsistent on it. See
   https://docs.da.live/administrators/guides/setup-library and
   https://docs.da.live/developers/guides/developing-apps-and-plugins.)
3. **Use it.** Open a document, launch **Tag picker** from the library palette, tick
   several facets, and hit **Insert**. A `Tags` block lands in the doc.

## Governed / dynamic vocabulary (optional)

To source the list from a sheet the client owns instead of the hardcoded 15, set
`TAXONOMY_SHEET` in `tag-picker.js` to a published DA sheet path (e.g.
`/config/taxonomy.json`) with `value` and `label` columns. The plugin fetches it
(authenticated with the SDK `token` when present) and falls back to the built-in list
on any error. No code change is then needed to add or rename tags.

## Two things to verify in-tenant

1. **Metadata write.** The confirmed `DA_SDK.actions` are `sendText` / `sendHTML` /
   `closeLibrary`, so this PoC injects a `Tags` block (the SKODA-205 content model).
   Check the live SDK for an action that writes a metadata field directly; if one
   exists, prefer it and change `buildTagsBlockHTML()` accordingly.
2. **EW surfacing.** DA library plugins are expected to appear inside Experience
   Workspace's panels (EW sits on the same DA stack) but that isn't explicitly
   documented. Confirm the picker shows up in EW, not just classic da.live.

## Local smoke test

Opening `index.html` directly (or via `npx -y @adobe/aem-cli up` then
`/poc/tag-multiselect/index.html`) renders the multi-select standalone. The `DA_SDK`
import fails gracefully outside DA, so Insert is disabled and the help text says
"Preview only". That confirms the UI without a tenant; the real Insert path needs the
plugin loaded inside DA/EW per the steps above.
