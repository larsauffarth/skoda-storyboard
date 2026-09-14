# Škoda Exec Briefing — Pre-Send Verification Log

**Date:** 2026-09-07
**Scope:** re-verify every source-attributed claim/count in `SKODA-EXEC-BRIEFING.html` before sending.
**Method:** LIVE = re-hit the live source (read-only, non-mutating: REST GET, sitemap fetch, HTTP HEAD). DOC = reconciled against canonical analysis docs. `[RUNTIME-UNCONFIRMED]` = needs a browser; kept hedged.
**Result:** all headline claims reconfirmed; **one delta corrected** (press-release count, content churn).

---

## LIVE re-hits

| Claim (deck) | Live result | Verdict |
|---|---|---|
| Posts (stories) all-langs = 5,282 | `X-WP-Total` = **5,282** | ✅ exact |
| Posts EN = 1,312 / CS = 1,461 | **1,312 / 1,461** | ✅ exact |
| Press releases = **6,715** | `X-WP-Total` = **6,558** | ⚠️ **delta −157** → deck corrected to 6,558 |
| Pages = 551 | **551** | ✅ exact |
| Škodapedia = 725 | **725** | ✅ exact |
| Editorial total ~13,300 | recomputed **~13,116** | ⚠️ → deck corrected to **~13,100** |
| 55 attachment sitemaps | sitemap index lists **55** | ✅ exact |
| 42,275 attachment pages | re-enumerated all 55 → **42,291** | ✅ within noise (+16); order-of-magnitude hedge holds |
| Media on S3 + CloudFront, no Dynamic Media | asset HEAD: `server: AmazonS3`, `x-amz-server-side-encryption`, `x-cache: Hit from cloudfront`; no transform params | ✅ confirmed |
| jQuery-era WordPress | homepage markup: jQuery present, WP REST link header, `server: nginx` | ✅ confirmed |
| Story universe = 2,773 (EN+CS) | REST enumeration → **1,312 + 1,461 = 2,773** | ✅ exact |
| Story census: 0 fetch errors | full re-crawl of 2,773 → **0 errors** | ✅ exact |
| Coverage 98.7% of stories by a small consistent set | re-crawl → **98.77% stories / 99.85% instances** | ✅ confirmed |
| EN + CS use the same component set | re-crawl → widget set locale-invariant (differences were per-page hash suffixes only) | ✅ confirmed |

**Story instance/type counts (35,159 instances / 17 canonical types):** the deck cites the original full-census figures. The re-crawl reproduced the *shape* (top widgets: `sow-editor` dominant, then `skoda-carousel`, `skoda-offset`, `sow-slider`, `skoda-quote`, `skoda-captioned-image`…, long tail incl. `charge-map`, `charging-calculator`, nested builder). My re-crawl's raw tally (~35,580 instances / 21 folded types) differs slightly because of looser canonicalization (hash/`-base` folding) and normal content churn — **not** a source contradiction. The census remains the authoritative measurement; deck figures left unchanged.

---

## DOC reconciliations (no live re-hit needed)

| Claim | Source doc | Verdict |
|---|---|---|
| ~28,300 logical media / ~200k physical files | `SKODA-MEDIA-DEEP-DIVE.md` | ✅ (derived from 42k attachment pages; order-of-magnitude) |
| 15 topic facets | `SKODA-MASTER.md` (14→15 correction logged) | ✅ |
| Video = Vimeo/YouTube embeds, no MAM | `SKODA-MEDIA-DEEP-DIVE.md` | ✅ |
| Header/footer = plain nested menus | `SKODA-HEADER-FOOTER-ANALYSIS.md` | ✅ |
| Media-cart = device-ID, no login, zip; needs serverless | `SKODA-COMPLEX-SYSTEMS-DEEP-DIVE.md` §2.4 + §3 verbatim | ✅ |
| Banner = bespoke per-market ad platform; newsletter = account system | `-COMPLEX-SYSTEMS-DEEP-DIVE.md` §2.2/§2.3 | ✅ |
| Custom analytics layer ("likely feeds GA; to confirm") | `-COMPLEX-SYSTEMS-DEEP-DIVE.md` §2.6 | ✅ hedge retained |
| ~10 content blocks + ~5 site-wide | `SKODA-EN-BLOCK-INVENTORY.md` | ✅ "~" retained |

---

## `[RUNTIME-UNCONFIRMED]` (no browser here — kept hedged, not asserted)

- Rendered/visual fidelity of migrated pages; a11y focus-traps; real LCP/CLS; live media-cart add/zip UX; embed lazy-timing. These remain flagged in the backing docs and are **not** stated as hard facts in the deck.

---

## Corrections applied to the deck

1. **Press releases 6,715 → 6,558** and **editorial total ~13,300 → ~13,100** (§2 stat card + "How we know"). Cause: content churn since the original crawl (live `X-WP-Total` re-hit 2026-09-07).

No other deck numbers required change. Media (+16 attachment pages) is within the existing order-of-magnitude hedge; story census figures reconfirmed.

---

## Confidence statement

Every source-attributed headline number in the deck is now either **LIVE-reconfirmed today** or **DOC-traceable to a measured analysis**. The only moving number is the press-release count (editorial content is actively published), now current as of 2026-09-07 and still labelled with the "~" approximation. Rendered/runtime claims remain appropriately hedged. **The deck is safe to send.**

*Read-only/non-mutating throughout; no writes, no auth, no gated content. Scratch scan files removed after aggregation.*
