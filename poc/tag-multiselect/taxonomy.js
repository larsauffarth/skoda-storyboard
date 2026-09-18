/*
 * taxonomy.js — the controlled vocabulary the picker offers.
 *
 * This is the project's fixed 15-facet taxonomy (docs/tickets/tickets/SKODA-401.md,
 * docs/architecture/SKODA-EDS-DA-ARCHITECTURE.md). It's hardcoded here so the PoC
 * runs with zero setup. In production this same shape can instead be fetched from a
 * published DA sheet so the client governs the vocabulary without a code change —
 * see loadTaxonomy() in tag-picker.js.
 *
 * `value` is the slug written into the document / tag URL; `label` is what the
 * author sees in the picker.
 */

const TAXONOMY = [
  { value: 'model', label: 'Model' },
  { value: 'bodywork', label: 'Bodywork' },
  { value: 'derivative', label: 'Derivative' },
  { value: 'motorsport', label: 'Motorsport' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'technology', label: 'Technology' },
  { value: 'years', label: 'Years' },
  { value: 'view', label: 'View' },
  { value: 'company', label: 'Company' },
  { value: 'concept', label: 'Concept' },
  { value: 'environment', label: 'Environment' },
  { value: 'happening', label: 'Happening' },
  { value: 'history', label: 'History' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'vip', label: 'VIP' },
];

export default TAXONOMY;
