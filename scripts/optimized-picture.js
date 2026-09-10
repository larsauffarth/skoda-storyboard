/*
 * optimizeImageInPlace — emit EDS responsive <picture> renditions while KEEPING
 * the original <picture>/<img> nodes that came from the authored document.
 *
 * Why: this is a Document Authoring / Experience Workspace project. EW decides
 * what is editable in Layout (WYSIWYG) mode STRUCTURALLY — it maps a rendered
 * node back to the source document by correspondence. `createOptimizedPicture`
 * (scripts/aem.js) builds a BRAND-NEW <picture>+<img> and the caller
 * `replaceWith(...)`s the original, which discards the mapped node → the image
 * is no longer editable in place (observed on the featured promo).
 *
 * This helper instead reuses the existing <picture> element and its <img>
 * (the mapped node): it swaps the <source> set and re-points the <img> src to
 * the optimized rendition, so the image stays editable AND still gets
 * webp/responsive optimization. Output mirrors createOptimizedPicture.
 *
 * (Instrumentation attributes — data-aue-* / moveInstrumentation — are a
 * Universal Editor concern and do not apply to this DA/EW project.)
 *
 * @param {HTMLImageElement} img the original <img> (must be inside a <picture>)
 * @param {boolean} eager set loading=eager (LCP) instead of lazy
 * @param {Array<{media?:string,width:string}>} breakpoints rendition widths
 * @returns {HTMLPictureElement|null} the same (mutated) <picture>, or null
 */
export default function optimizeImageInPlace(img, eager = false, breakpoints = [{ width: '750' }]) {
  const picture = img.closest('picture');
  if (!picture) return null;

  const src = img.getAttribute('src') || '';
  const url = !src.startsWith('http') ? new URL(src, window.location.href) : new URL(src);
  const { origin, pathname } = url;
  const ext = pathname.split('.').pop();

  // Drop the document's original <source> set; keep the <img> (the mapped node).
  picture.querySelectorAll('source').forEach((s) => s.remove());

  // webp sources
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${origin}${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.insertBefore(source, img);
  });

  // non-webp fallback sources for all but the last breakpoint
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${origin}${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.insertBefore(source, img);
    }
  });

  // re-point the preserved <img> to the last (smallest) breakpoint rendition
  const last = breakpoints[breakpoints.length - 1];
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  img.setAttribute('src', `${origin}${pathname}?width=${last.width}&format=${ext}&optimize=medium`);

  return picture;
}
