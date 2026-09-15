#!/usr/bin/env python3
"""Aggregate the block-recount dataset into counts.

Produces aggregate.json: totals, per-template counts, and per-block appearance
counts split by side (STO/MR) and template. Also flags new/unmatched blocks and
specced blocks with zero appearances.
"""
import csv, json, collections

WD = "/backups/larsauffarth/skoda-storyboard/repo/.migration/block-recount"
DS = f"{WD}/dataset.csv"
OUT = f"{WD}/aggregate.json"

# full ui-specs block universe (content blocks we expect to find via signatures)
UNIVERSE = ["hero","card_teaser","carousel_rails","gallery_lightbox","faceted_listing",
            "downloads","tags","skodapedia","faq_accordion","siteorigin_body","row_toggle",
            "model_nav","media_cart_page","promo_banner","cover_box","press_kit_media",
            "two_column"]

def main():
    rows = list(csv.DictReader(open(DS)))
    ok = [r for r in rows if r["http"].startswith("200")]
    err = [r for r in rows if not r["http"].startswith("200")]

    total = len(rows)
    tmpl = collections.Counter(r["template"] for r in ok)
    side = collections.Counter(r["side"] for r in ok)
    tmpl_by_side = collections.defaultdict(collections.Counter)
    for r in ok:
        tmpl_by_side[r["side"]][r["template"]] += 1

    block_pages = collections.Counter()
    block_by_side = collections.defaultdict(collections.Counter)  # block -> side -> n
    block_by_tmpl = collections.defaultdict(collections.Counter)  # block -> template -> n
    variant_pages = collections.Counter()
    embed_pages = collections.Counter()
    for r in ok:
        for b in filter(None, r["blocks"].split(";")):
            block_pages[b] += 1
            block_by_side[b][r["side"]] += 1
            block_by_tmpl[b][r["template"]] += 1
        for v in filter(None, r["variants"].split(";")):
            variant_pages[v] += 1
        for e in filter(None, r["embeds"].split(";")):
            embed_pages[e] += 1

    zero = [b for b in UNIVERSE if block_pages.get(b, 0) == 0]
    seen_not_universe = [b for b in block_pages if b not in UNIVERSE]

    out = {
        "total_urls": total,
        "scanned_ok": len(ok),
        "fetch_errors": len(err),
        "sides": dict(side),
        "template_counts": dict(tmpl.most_common()),
        "template_by_side": {s: dict(c.most_common()) for s, c in tmpl_by_side.items()},
        "block_pages": dict(block_pages.most_common()),
        "block_by_side": {b: dict(block_by_side[b]) for b in block_pages},
        "block_by_template": {b: dict(block_by_tmpl[b].most_common()) for b in block_pages},
        "variant_pages": dict(variant_pages.most_common()),
        "embed_pages": dict(embed_pages.most_common()),
        "specced_but_zero_appearances": zero,
        "detected_outside_named_universe": seen_not_universe,
        "error_samples": [(r["url"], r["http"]) for r in err[:20]],
    }
    json.dump(out, open(OUT, "w"), indent=2)
    print(json.dumps({k: out[k] for k in
          ["total_urls","scanned_ok","fetch_errors","sides","template_counts",
           "block_pages","embed_pages","specced_but_zero_appearances"]}, indent=2))

if __name__ == "__main__":
    main()
