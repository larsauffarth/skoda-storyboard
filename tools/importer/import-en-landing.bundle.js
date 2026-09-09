/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-en-landing.js
  var import_en_landing_exports = {};
  __export(import_en_landing_exports, {
    default: () => import_en_landing_default
  });

  // tools/importer/parsers/cards-overlay.js
  function parse(element, { document: document2 }) {
    const teasers = Array.from(element.querySelectorAll("article.article-teaser"));
    const cells = [];
    teasers.forEach((teaser) => {
      const img = teaser.querySelector(".article-teaser-media img, .entry-thumbnail img, img");
      const imageCell = document2.createElement("div");
      if (img) imageCell.append(img);
      const bodyCell = [];
      const date = teaser.querySelector(".entry-meta .entry-published, .entry-published");
      if (date && date.textContent.trim()) {
        const dateP = document2.createElement("p");
        dateP.textContent = date.textContent.trim();
        bodyCell.push(dateP);
      }
      const heading = teaser.querySelector("h3.entry-title, .entry-title");
      if (heading) bodyCell.push(heading);
      const summary = teaser.querySelector("p.entry-summary, .entry-summary");
      if (summary && summary.textContent.trim()) bodyCell.push(summary);
      if (img || bodyCell.length) {
        cells.push([imageCell, bodyCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-media.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".search-results-item, article"));
    const cards = items.filter((el) => el.matches(".search-results-item") || el.matches("article"));
    const wrappers = cards.filter((el) => el.matches(".search-results-item"));
    const list = wrappers.length ? wrappers : cards;
    const cells = [];
    list.forEach((item) => {
      const article = item.matches("article") ? item : item.querySelector("article");
      const scope = article || item;
      const img = scope.querySelector(".entry-thumbnail img, .article-teaser-media img, img");
      const imageCell = document2.createElement("div");
      if (img) imageCell.append(img);
      const bodyCell = [];
      let heading = scope.querySelector("h3.entry-title, .entry-title");
      if (heading) {
        const innerLink = heading.querySelector("a[href]");
        if (innerLink) {
          bodyCell.push(heading);
        } else {
          const wrapLink = scope.querySelector('a.article-teaser-media[href], a[href]:not([href="#"]):not([href=""])');
          const h = document2.createElement("h3");
          if (wrapLink && wrapLink.getAttribute("href")) {
            const a = document2.createElement("a");
            a.setAttribute("href", wrapLink.getAttribute("href"));
            a.textContent = heading.textContent.trim();
            h.append(a);
          } else {
            h.textContent = heading.textContent.trim();
          }
          bodyCell.push(h);
        }
      }
      if (img || bodyCell.length) {
        cells.push([imageCell, bodyCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-toolbar.js
  function parse3(element, { document: document2 }) {
    const teasers = Array.from(element.querySelectorAll("article.article-teaser"));
    const isRealToolbarLink = (a) => {
      if (!a) return false;
      if (a.classList.contains("media-cart-action")) return false;
      const href = (a.getAttribute("href") || "").trim();
      return href && href !== "#";
    };
    const hasToolbar = teasers.some((t) => Array.from(
      t.querySelectorAll(".article-teaser-toolbar a[href]")
    ).some(isRealToolbarLink));
    const cells = [];
    teasers.forEach((teaser) => {
      const img = teaser.querySelector(".article-teaser-media img, .entry-thumbnail img, img");
      const imageCell = document2.createElement("div");
      if (img) imageCell.append(img);
      const bodyCell = [];
      const date = teaser.querySelector(".entry-meta .entry-published, .entry-published");
      if (date && date.textContent.trim()) {
        const dateP = document2.createElement("p");
        dateP.textContent = date.textContent.trim();
        bodyCell.push(dateP);
      }
      const heading = teaser.querySelector("h3.entry-title, .entry-title");
      if (heading) bodyCell.push(heading);
      const summary = teaser.querySelector("p.entry-summary, .entry-summary");
      if (summary && summary.textContent.trim()) bodyCell.push(summary);
      const row = [imageCell, bodyCell];
      if (hasToolbar) {
        const toolbarCell = [];
        Array.from(teaser.querySelectorAll(".article-teaser-toolbar a[href]")).filter(isRealToolbarLink).forEach((a) => toolbarCell.push(a));
        row.push(toolbarCell);
      }
      if (img || bodyCell.length) {
        cells.push(row);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-toolbar", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/skoda-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        "#ot-sdk-container",
        ".onetrust-pc-dark-filter",
        ".ot-sdk-container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#newsletter-popups",
        ".newsletter-popup",
        ".topbar__dropdown__newsletter",
        "form.mailguide-subscribe",
        "form.newsletter-form"
      ]);
      element.querySelectorAll(".search-results-header").forEach((header) => {
        const block = header.closest(".search-results");
        const heading = header.querySelector("h1, h2, h3, h4");
        if (block && block.parentNode && heading) {
          heading.querySelectorAll("a").forEach((a) => a.replaceWith(...a.childNodes));
          block.parentNode.insertBefore(heading, block);
        }
        header.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        "a.media-cart-action",
        ".article-teaser-toolbar"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.header",
        "footer.footer"
      ]);
      element.querySelectorAll(".media-cart-item, .media-cart-image").forEach((el) => {
        el.classList.remove("media-cart-item", "media-cart-image");
        if (el.classList.length === 0) el.removeAttribute("class");
      });
      element.querySelectorAll("[data-event-type], [data-action], [data-original-only]").forEach((el) => {
        el.removeAttribute("data-event-type");
        el.removeAttribute("data-action");
        el.removeAttribute("data-original-only");
      });
      element.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("data:")) {
          const master = src.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)(\?.*)?$/, "$1$2");
          if (master !== src) img.setAttribute("src", master);
        }
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      });
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/skoda-sections.js
  var START_ATTR = "data-excat-section-start";
  var END_ATTR = "data-excat-section-end";
  var DARK_SECTIONS = [
    { id: "social", selector: "div.cover-box.dark.socials-static .search-results.type-social", style: "dark" },
    { id: "series", selector: "div.cover-box.dark .search-results.type-skoda_series", style: "dark" }
  ];
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      DARK_SECTIONS.forEach((section) => {
        const el = element.querySelector(section.selector);
        if (!el) return;
        const startHr = document.createElement("hr");
        startHr.setAttribute(START_ATTR, section.id);
        el.before(startHr);
        const endHr = document.createElement("hr");
        endHr.setAttribute(END_ATTR, section.id);
        el.after(endHr);
      });
    }
    if (hookName === "afterTransform") {
      DARK_SECTIONS.forEach((section) => {
        const endMarker = element.querySelector(`[${END_ATTR}="${section.id}"]`);
        if (!endMarker) return;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        endMarker.before(metadataBlock);
        endMarker.removeAttribute(END_ATTR);
        const startMarker = element.querySelector(`[${START_ATTR}="${section.id}"]`);
        if (startMarker) startMarker.removeAttribute(START_ATTR);
      });
    }
  }

  // tools/importer/import-en-landing.js
  var parsers = {
    "cards-overlay": parse,
    "cards-media": parse2,
    "cards-toolbar": parse3
  };
  var PAGE_TEMPLATE = {
    name: "en-landing",
    description: "\u0160koda Storyboard English landing/home page. Hero/featured promo grid + thematic teaser rails. Dynamic systems omitted or rendered as static stubs.",
    urls: [
      "https://www.skoda-storyboard.com/en/"
    ],
    blocks: [
      {
        name: "cards-overlay",
        instances: [
          "main.main > section.promo-box",
          "div.cover-box .search-results.latest-articles"
        ]
      },
      {
        name: "cards-media",
        instances: [
          "div.cover-box.dark.socials-static .search-results.type-social",
          "div.cover-box .search-results.type-skoda_model",
          "div.cover-box.dark .search-results.type-skoda_series",
          "div.cover-box .search-results.type-press_release"
        ]
      },
      {
        name: "cards-toolbar",
        instances: [
          "div.cover-box .search-results.type-post"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_en_landing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : `${rawPath}/index`);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_en_landing_exports);
})();
