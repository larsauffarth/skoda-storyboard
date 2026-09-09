/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Škoda Storyboard site-wide cleanup.
 *
 * All selectors verified against migration-work/cleaned.html (Škoda Storyboard
 * WordPress home page). Removes non-authorable site chrome and dynamic/interactive
 * hooks so the import contains only page-level authorable content, and normalizes
 * media to masters-only.
 *
 * Confirmed absent from the scraped DOM (scraper already stripped them): <script>,
 * <style>, <noscript>, <iframe>, cookie/consent banners, srcset/sizes, promo ad
 * banners (skoda-banners / banner-injected), load-more / .ys-ajax-loader controls,
 * and cart data-* attributes. We therefore do NOT add guessed selectors for those;
 * the safe element removals below (link/iframe/noscript) are harmless no-ops if absent.
 */

const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // --- OneTrust cookie/consent banner + preference center. Present only when the page
    //     is fetched live (not in the static scrape). Remove the whole SDK shell so its
    //     "We value your privacy" / "Privacy Preference Center" copy never leaks in. ---
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '#ot-sdk-container',
      '.onetrust-pc-dark-filter',
      '.ot-sdk-container',
    ]);

    // --- Newsletter forms / popups (verified: section#newsletter-popups > .newsletter-popup;
    //     header dropdown .topbar__dropdown__newsletter). Removed before parsing so they
    //     never get picked up as content. ---
    WebImporter.DOMUtils.remove(element, [
      '#newsletter-popups',
      '.newsletter-popup',
      '.topbar__dropdown__newsletter',
      'form.mailguide-subscribe',
      'form.newsletter-form',
    ]);

    // --- Promote rail headings to default content. Each teaser rail nests its title in
    //     `.search-results > .search-results-container > header.search-results-heading`.
    //     The block parser replaces the whole `.search-results` element, which would
    //     discard the heading, so lift the <h3> out as a sibling *before* the block runs.
    //     Drop the header's "All" listing link (no backend listing in the pilot). ---
    element.querySelectorAll('.search-results-header').forEach((header) => {
      const block = header.closest('.search-results');
      const heading = header.querySelector('h1, h2, h3, h4');
      if (block && block.parentNode && heading) {
        heading.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
        block.parentNode.insertBefore(heading, block);
      }
      header.remove();
    });

    // --- media-cart "add" controls (verified: a.media-cart-action.add inside
    //     .article-teaser-toolbar > .entry-buttons). The toolbar contains only the
    //     cart add button, so it is non-authorable in its entirety. ---
    WebImporter.DOMUtils.remove(element, [
      'a.media-cart-action',
      '.article-teaser-toolbar',
    ]);
  }

  if (hookName === H.after) {
    // --- Non-authorable site chrome. Target the specific shell classes, NOT bare
    //     <header>/<footer>: the content contains nested <header class="search-results-header">
    //     rail headings that must be KEPT. ---
    WebImporter.DOMUtils.remove(element, [
      'header.header',
      'footer.footer',
    ]);

    // --- Strip cart hook CLASSES from content elements (media-cart-item on <article>,
    //     media-cart-image on the thumbnail wrapper and <img>). These classes ride on
    //     real content, so remove the class only — never the element. Also drop any
    //     cart data-* interaction attributes if present. ---
    element.querySelectorAll('.media-cart-item, .media-cart-image').forEach((el) => {
      el.classList.remove('media-cart-item', 'media-cart-image');
      if (el.classList.length === 0) el.removeAttribute('class');
    });
    element.querySelectorAll('[data-event-type], [data-action], [data-original-only]').forEach((el) => {
      el.removeAttribute('data-event-type');
      el.removeAttribute('data-action');
      el.removeAttribute('data-original-only');
    });

    // --- MEDIA: reference-in-place for the demo render. Keep the source-referenced
    //     responsive derivative (e.g. ...-768x512.jpg) as the <img src> and only drop
    //     srcset/sizes so EDS regenerates a single optimized <picture>. Preserve alt.
    //     Leave inline data: SVG icons (static social channel icons) untouched.
    //
    //     NOTE — "masters-only" is a PRODUCTION-INGEST rule (one master per logical
    //     image uploaded into DA/Assets, letting EDS regenerate the ladder). It must
    //     NOT be applied to reference-in-place CDN URLs: stripping the WordPress
    //     -{W}x{H} suffix resolves to the full-resolution original, which on this site
    //     runs 20–34 MB per photo — too large for the content-bus preview to fetch
    //     (causes `error from content-bus` / HTTP 409). When real ingestion happens,
    //     de-derivative + upload the master there, not in this reference-in-place path. ---
    element.querySelectorAll('img[src]').forEach((img) => {
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    });

    // --- Defensive safe-element removal (no-ops if already absent). ---
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'style',
      'script',
    ]);
  }
}
