/*
 * categories.js — the story categories the picker offers for the stories block.
 *
 * These are the positive `category` values the stories/story-rail blocks filter on,
 * i.e. the distinct `category` values in the published query-index (not the 15-facet
 * taxonomy). Hardcoded for a zero-setup demo; swap for a fetch of a published DA
 * sheet (or derive from query-index) to keep it in sync automatically.
 *
 * `value` is written into the block's `category` config row; `label` is shown.
 */

const CATEGORIES = [
  { value: 'emobility', label: 'eMobility' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'skoda-world', label: 'Škoda World' },
  { value: 'press-releases', label: 'Press Releases' },
];

export default CATEGORIES;
