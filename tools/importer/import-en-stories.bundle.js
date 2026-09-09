/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-en-stories.js
  var import_en_stories_exports = {};
  __export(import_en_stories_exports, {
    default: () => import_en_stories_default
  });

  // tools/importer/transformers/skoda-story-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function meta(document, key) {
    const el = document.querySelector(
      `head meta[property="${key}"], head meta[name="${key}"]`
    );
    return el ? (el.getAttribute("content") || "").trim() : "";
  }
  function cleanTitle(raw) {
    return raw.replace(/\s*[-|–]\s*Škoda Storyboard\s*$/i, "").trim();
  }
  function findPublishedDate(document) {
    const metaDate = meta(document, "article:published_time");
    if (metaDate) return metaDate.slice(0, 10);
    const dataEl = document.querySelector("[data-publish-date]");
    const dataDate = dataEl && dataEl.getAttribute("data-publish-date");
    if (dataDate) {
      const m = /(\d{4}-\d{2}-\d{2})/.exec(dataDate);
      if (m) return m[1];
    }
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    for (let i = 0; i < scripts.length; i += 1) {
      const m = /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/.exec(scripts[i].textContent || "");
      if (m) return m[1];
    }
    const span = document.querySelector(".entry-published");
    if (span) {
      const m = /(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/.exec(span.textContent || "");
      if (m) {
        const [, d, mo, y] = m;
        return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    return "";
  }
  function categoryFromUrl(originalURL) {
    try {
      const segments = new URL(originalURL).pathname.split("/").filter(Boolean);
      const enIdx = segments.indexOf("en");
      const category = enIdx >= 0 ? segments[enIdx + 1] : segments[0];
      return (category || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function transform(hookName, element, payload) {
    const { document, params } = payload;
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".header",
        ".footer",
        ".navigation",
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        "#ot-sdk-container",
        ".onetrust-pc-dark-filter",
        "#newsletter-popups",
        ".newsletter-popup",
        ".topbar__dropdown__newsletter",
        "form.mailguide-subscribe",
        "form.newsletter-form",
        // article page furniture that isn't the story body
        ".article-share",
        ".social-share",
        ".share",
        ".related-articles",
        ".related-posts",
        ".article-related",
        ".search-results",
        // teaser rails ("read next")
        ".cover-box",
        ".breadcrumbs",
        ".breadcrumb",
        ".entry-tags",
        ".tags",
        ".article-toolbar",
        ".article-teaser-toolbar",
        "a.media-cart-action",
        ".comments",
        "#comments",
        "aside",
        ".sidebar",
        "iframe",
        "noscript",
        "link",
        "style",
        "script"
      ]);
      const root = document.querySelector(
        "article, main article, .single-article, .post-content, .entry-content"
      );
      if (root && root !== element) {
        element.replaceChildren(...root.childNodes);
      }
    }
    if (hookName === H.after) {
      element.querySelectorAll("img[src]").forEach((img) => {
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      });
      const title = cleanTitle(meta(document, "og:title") || document.title || "");
      const description = meta(document, "og:description") || meta(document, "description");
      const image = meta(document, "og:image");
      const publishedDate = findPublishedDate(document);
      const category = categoryFromUrl(params && params.originalURL) || meta(document, "article:section");
      const cells = [];
      if (title) cells.push(["Title", title]);
      if (description) cells.push(["Description", description]);
      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        cells.push(["Image", img]);
      }
      if (publishedDate) cells.push(["publisheddate", publishedDate]);
      if (category) cells.push(["category", category]);
      cells.push(["template", "story"]);
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: "Metadata",
        cells
      });
      element.appendChild(metadataBlock);
    }
  }

  // tools/importer/import-en-stories.js
  var PAGE_TEMPLATE = {
    name: "en-stories",
    description: "\u0160koda Storyboard English story articles. Lightweight pages under /en/stories/<slug> with metadata for the query-index.",
    // Story articles carry NO named blocks — they are plain content pages
    // (hero + title + intro + body). All shaping happens in the transformer.
    blocks: []
  };
  var transformers = [
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function slugFromUrl(originalURL) {
    const segments = new URL(originalURL).pathname.replace(/\/$/, "").split("/").filter(Boolean);
    return segments[segments.length - 1] || "story";
  }
  var import_en_stories_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const slug = slugFromUrl(params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(`/en/stories/${slug}`);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_en_stories_exports);
})();
