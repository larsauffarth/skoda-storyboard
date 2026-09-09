/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Škoda Storyboard section styling.
 *
 * The en-landing template records its two dark sections as block entries carrying a
 * `section: "dark"` property (block-mapping-manager encodes them this way rather than
 * as a `template.sections` array), so this transformer keys off DOM selectors directly
 * instead of `payload.template.sections`. Both selectors verified against
 * migration-work/cleaned.html:
 *   - Social media section: div.cover-box.dark.socials-static > .search-results.type-social (line 550)
 *   - Series section:       div.cover-box.dark > .search-results.type-skoda_series (line 1791)
 *
 * Both target elements are exactly what the cards-media parser replaces via
 * element.replaceWith(block). Following the reference two-hook pattern, we insert
 * marker <hr> boundaries in beforeTransform (while the elements still exist), then
 * anchor the Section Metadata block to the surviving trailing marker in afterTransform.
 * Bare <hr> is not a <div>, so inserting it never disturbs any parser's :nth-of-type
 * selectors, and the site cleanup transformer removes only specific selectors (never
 * bare hr), so these breaks survive.
 *
 * Resulting section shape (document order): <hr> · [dark rail block] · Section Metadata · <hr>
 */

const START_ATTR = 'data-excat-section-start';
const END_ATTR = 'data-excat-section-end';

// Selectors + style from page-templates.json block entries with a `section` property.
const DARK_SECTIONS = [
  { id: 'social', selector: 'div.cover-box.dark.socials-static .search-results.type-social', style: 'dark' },
  { id: 'series', selector: 'div.cover-box.dark .search-results.type-skoda_series', style: 'dark' },
];

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Insert boundary markers now, before parsers can replaceWith() the rail elements.
    DARK_SECTIONS.forEach((section) => {
      const el = element.querySelector(section.selector);
      if (!el) return; // selector didn't match on this page — skip, never guess

      const startHr = document.createElement('hr');
      startHr.setAttribute(START_ATTR, section.id);
      el.before(startHr);

      const endHr = document.createElement('hr');
      endHr.setAttribute(END_ATTR, section.id);
      el.after(endHr);
    });
  }

  if (hookName === 'afterTransform') {
    // Parsers have run; the rail element was replaced by a block table, but our marker
    // <hr> elements survive. Insert the Section Metadata block just before the trailing
    // marker so it becomes the last node of the dark section.
    DARK_SECTIONS.forEach((section) => {
      const endMarker = element.querySelector(`[${END_ATTR}="${section.id}"]`);
      if (!endMarker) return; // marker didn't survive — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      endMarker.before(metadataBlock);

      // Strip helper attributes; keep the bare <hr> elements as real section breaks.
      endMarker.removeAttribute(END_ATTR);
      const startMarker = element.querySelector(`[${START_ATTR}="${section.id}"]`);
      if (startMarker) startMarker.removeAttribute(START_ATTR);
    });
  }
}
