#!/usr/bin/env python3
"""Block-universe recount crawler.

Fetches each EN URL once, classifies side (STO/MR) + template from the WordPress
<body> class, detects the ui-specs block universe via DOM signatures, and emits one
CSV row per page: url,side,template,rest_type,http,blocks,variants,embeds,unmatched.

Read-only against the source; writes only the CSV. Concurrency-bounded.
"""
import csv, re, sys, concurrent.futures as cf, urllib.request, gzip, io

WD = "/backups/larsauffarth/skoda-storyboard/repo/.migration/block-recount"
IN = f"{WD}/urls-combined.csv"
OUT = f"{WD}/dataset.csv"
WORKERS = 12
TIMEOUT = 30
UA = "Mozilla/5.0 (compatible; skoda-block-recount/1.0)"

# --- template from body class (order matters; first match wins) ---
TEMPLATE_RULES = [
    ("template-homepage",              "home"),
    ("template-search-results",        "faceted_listing"),
    ("post-type-archive-skodapedia",   "skodapedia_archive"),
    ("single-press_release",           "press_release"),
    ("single-press_kit",               "press_kit"),
    ("single-skoda_model",             "model"),
    ("single-skoda_series",            "series_hub"),
    ("template-tiles",                 "tiles_dir"),      # series dir / press-kit hub
    ("template-media-room-page",       "company_page"),
    ("template-404",                   "error404"),
    ("template-custom-full-width",     "custom_microsite"),  # event-gallery / campaign pages
    ("template-carousel-listing",      "carousel_listing"),  # newsletter/carousel listing page
    ("single-post",                    "story"),
    ("single-skodapedia",              "skodapedia_term"),
    ("error404",                       "error404"),
    ("page-template-default",          "page"),
]

# --- block signatures: name -> list of substrings; ANY present => block detected.
# Regexes kept as plain substrings (lowercased HTML) for speed + robustness.
# Signatures validated live 2026-09-15 by Explore agents (STO editorial, MR listings/PR,
# press-kit/company/special). Comments record what was rejected as global CHROME so the
# counts reflect authored content, not site furniture.
BLOCK_SIGS = {
    # real editorial hero needs the ratio-container/caption; bare "hero-image" is a template
    # placeholder present even on /copyright/, so qualify it.
    "hero":            ["hero-image ratio-container", "hero-caption"],
    # article-teaser(-media) = the universal card; ys-so-widget-post-teaser = series/hub teaser grid
    "card_teaser":     ["article-teaser-media", "ys-so-widget-post-teaser"],
    # content rails only: related band on stories/PR + MR/model "search-results type-*" bands.
    # REJECTED: skoda-carousel-widget / bare "carousel" (site furniture on every page).
    "carousel_rails":  ["related-stories", "search-results type-"],
    # image gallery w/ colorbox lightbox
    "gallery_lightbox":["gallery-item", "search-results-gallery"],
    # the real faceted engine (news/images/videos/search). REJECTED: bare search-filter form.
    "faceted_listing": ["filter-module-js", "filter-input-options"],
    # media/download grid. REJECTED: bare "download" (= media-cart-action download chrome).
    "downloads":       ["search-results media-box", "search-results-annual-reports"],
    "tags":            ["entry-tags", "tag-list"],
    "skodapedia":      ["term-detail", "sp__list-nav", "sp__term", "az-glossary"],
    "faq_accordion":   ["faq-accordion", "faqpage", "faq-item"],
    # SiteOrigin rich-text body (story/model "Model Description"); a real authored content region
    "siteorigin_body": ["so-widget-sow-editor", "widget_sow-editor", "so-widget-skoda-offset"],
    # collapsible primitive: exec-bio "show more", content sections, FAQ backing
    "row_toggle":      ["ys-row-toggle", "row-toggle"],
    # model page in-page icon anchor nav
    "model_nav":       ["model-nav"],
    # cart application body (distinct from the global sticky cart button chrome)
    "media_cart_page": ["mr-media-cart"],
    # STO story side banner (the only real promo banner; app-download footer is chrome)
    "promo_banner":    ["side-banner"],
    "cover_box":       ["cover-box"],
    # press-kit sub-blocks
    "press_kit_media": ["chapter-nav"],            # persistent chapter sub-nav on PK sub-pages
    "two_column":      ["column-primary", "column-secondary"],
}
# NOTE (chrome — deliberately NOT counted as content blocks, present site-wide):
#   media-cart button (media-cart-icon/sticky-button), newsletter/mailguide footer,
#   app-download badges, social share bar (btn-group social), skoda-carousel-widget furniture,
#   Lightbox JS token, ys-parallax asset refs, sa-bnr ad slot, buzzsprout footer link.
# press_kit_variant: no rendered variant/bodywork SELECTOR exists (bodywork-* are taxonomy
#   classes, not a control) — dropped from the content set.

# variants (sub-signatures we still want to count)
VARIANT_SIGS = {
    "teaser_overlay":  ["teaser-overlay"],
    "teaser_media":    ["teaser-media"],
    "teaser_toolbar":  ["teaser-toolbar"],
    "gallery_lightbox_viewer": ["sb-gallery-lightbox"],
    "cover_box_dark":  ["cover-box dark", "cover-box.dark", "section-dark"],
}

# embed providers via iframe/data-src
# Embeds matched only against iframe/embed src|data-src attributes (not footer <a> links).
EMBED_SIGS = {
    "vimeo":      ["vimeo.com"],
    "youtube":    ["youtube.com/embed", "youtube-nocookie.com", "youtu.be"],
    "buzzsprout": ["buzzsprout.com"],
    "spotify":    ["spotify.com/embed", "open.spotify.com"],
    "dailymotion":["dailymotion.com/embed"],
}
IFRAME_SRC_RE = re.compile(r'<iframe[^>]*?(?:data-src|src)="([^"]*)"', re.I)

def detect_embeds(html_low):
    srcs = " ".join(IFRAME_SRC_RE.findall(html_low))
    return [name for name, subs in EMBED_SIGS.items() if any(s in srcs for s in subs)]

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        final = r.geturl()
        code = r.getcode()
    return code, final, raw.decode("utf-8", "ignore")

def body_class(html):
    m = re.search(r'<body[^>]*class="([^"]*)"', html, re.I)
    return (m.group(1).lower() if m else "")

def classify_template(bodycls):
    for token, name in TEMPLATE_RULES:
        if token in bodycls:
            return name
    return "unknown"

def detect(sigmap, hay):
    return [name for name, subs in sigmap.items() if any(s in hay for s in subs)]

def process(row):
    url, rest_type = row
    try:
        code, final, html = fetch(url)
    except Exception as e:
        return [url, "?", "FETCH_ERR", rest_type, str(e)[:40], "", "", "", ""]
    low = html.lower()
    bcls = body_class(low)
    side = "MR" if "media-room" in bcls else "STO"
    template = classify_template(bcls)
    blocks = detect(BLOCK_SIGS, low)
    variants = detect(VARIANT_SIGS, low)
    embeds = detect_embeds(low)
    # redirect drift note
    redirected = "R" if final.rstrip("/") != url.rstrip("/") else ""
    return [url, side, template, rest_type, str(code) + redirected,
            ";".join(sorted(blocks)), ";".join(sorted(variants)), ";".join(sorted(embeds)), ""]

def main():
    with open(IN) as f:
        rd = csv.reader(f); next(rd)
        rows = [(r[0], r[1]) for r in rd if r]
    print(f"crawling {len(rows)} urls with {WORKERS} workers ...", file=sys.stderr)
    results = []
    done = 0
    with cf.ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for res in ex.map(process, rows):
            results.append(res); done += 1
            if done % 250 == 0:
                print(f"  {done}/{len(rows)}", file=sys.stderr)
    with open(OUT, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["url","side","template","rest_type","http","blocks","variants","embeds","unmatched"])
        w.writerows(results)
    print(f"wrote {OUT} ({len(results)} rows)", file=sys.stderr)

if __name__ == "__main__":
    main()
