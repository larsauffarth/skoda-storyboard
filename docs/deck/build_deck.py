#!/usr/bin/env python3
"""
Škoda Storyboard → EDS — project-development tracker deck generator.

Produces docs/deck/skoda-storyboard-project-tracker.pptx:
  - one slide per project week
  - each slide shows a one-line progress headline
  - speaker notes carry the detailed talk-track bullets for that week

Re-runnable: add a dict to WEEKS and re-run. Weeks render in list order.

Run:  python3 docs/deck/build_deck.py
Deps: python-pptx  (pip install --user python-pptx)
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# ---- Škoda brand ----
GREEN = RGBColor(0x0E, 0x3A, 0x2F)      # brand dark green
EMERALD = RGBColor(0x4B, 0xA8, 0x2E)    # accent
INK = RGBColor(0x16, 0x17, 0x18)        # near-black text
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x9C, 0xB3, 0xAA)      # muted green-grey for eyebrows on dark

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")

# 16:9
SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

META = {
    "title": "Škoda Storyboard → Edge Delivery Services",
    "subtitle": "Project development tracker — weekly progress",
    "footer": "Škoda Storyboard → AEM Edge Delivery · internal progress tracker",
}

# One entry per week. `headline` = the on-slide one-liner. `notes` = talk-track bullets.
WEEKS = [
    {
        "week": "Week 1",
        "dates": "1–7 Sep 2026",
        "phase": "Discovery & analysis",
        "headline": "Measured the whole site and proved the migration is feasible.",
        "notes": [
            "Enumerated the full editorial corpus via the WordPress REST API: ~13,100 pages "
            "(5,282 stories · 6,558 press releases · 551 pages · 725 Škodapedia) across 6 languages.",
            "Parsed all 55 attachment sitemaps → ~28,300 logical media items / ~200k physical files; "
            "confirmed images sit on S3 + CloudFront with no Dynamic Media (EDS pipeline will be an upgrade).",
            "Scanned 100% of stories (2,773 EN+CS, 0 fetch errors): 98.7% covered by a small, consistent "
            "component set that is identical in EN and CS — so Czech adds volume, not complexity.",
            "Mapped the dynamic back-ends read-only (media-cart, banners, newsletter, search) to size the rebuild; "
            "only the media-cart zip needs a small serverless function.",
            "Produced the leadership exec briefing (source-of-truth) and the DA/EDS target architecture; "
            "every headline number LIVE-reconfirmed before send.",
            "Verdict: technical complexity moderate and well-understood; the real risk is the fixed 15 Oct date, "
            "not the build.",
        ],
    },
    {
        "week": "Week 2",
        "dates": "8–11 Sep 2026",
        "phase": "Capability pilot — /en landing page",
        "headline": "Migrated the English landing page end-to-end and pixel-matched it to the original.",
        "image": os.path.join(ASSETS, "week2-en-render.png"),
        "notes": [
            "Stood up the reusable capability on one page: scraped & analysed /en, then built the block set "
            "(hero, cards overlay/media/toolbar, carousel, social, newsletter stub).",
            "Built content-driven import infrastructure (parsers + transformers + orchestrator) and ran it via the "
            "bulk importer; pushed the page + nav + footer fragments to Document Authoring.",
            "Content completeness ~97%, 0 source teaser titles missing; live at "
            "main--skoda-storyboard--larsauffarth.aem.page/en/.",
            "Extracted the design system from the live site into brand.css (SKODA Next stack, brand green #0e3a2f, "
            "type scale, spacing, radii, shadows, 1248px container) and applied it globally.",
            "Pixel-matched at 1440px: rebuilt the promo-box as the source's 1-large + 2-stacked featured grid, "
            "matched Latest Stories' 2+3 grid, dark Social/Series sections, header wordmark + topbar, and the "
            "dark-green footer with submenus.",
            "Fixed real defects found in-browser: restored section-metadata handling the vendored aem.js omitted; "
            "kept sized derivatives (not 20–34MB masters) so preview stops 409-ing; added a query-index-driven "
            "Latest Stories block and tag-filtered rails.",
            "Shipped as a series of reviewed PRs (#2–#25), all merged to main.",
            "Intentionally deferred/stubbed: media-cart, banners, live newsletter/social feed, search, the other "
            "5 locales, RSS feed.",
        ],
    },
]


def _set_bg(slide, color):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def _text(slide, left, top, width, height, runs, *, align=PP_ALIGN.LEFT,
          anchor=MSO_ANCHOR.TOP, line_spacing=None):
    """runs: list of (text, size, bold, color) → each its own paragraph."""
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, (txt, size, bold, color) in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if line_spacing:
            p.line_spacing = line_spacing
        r = p.add_run()
        r.text = txt
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.color.rgb = color
        r.font.name = "Arial"
    return tb


def _bar(slide, left, top, width, height, color):
    from pptx.enum.shapes import MSO_SHAPE
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shp.fill.solid()
    shp.fill.fore_color.rgb = color
    shp.line.fill.background()
    shp.shadow.inherit = False
    return shp


def add_title_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    _set_bg(slide, GREEN)
    _bar(slide, 0, Inches(3.05), Inches(1.4), Inches(0.07), EMERALD)
    _text(slide, Inches(0.9), Inches(1.4), Inches(11.5), Inches(0.5),
          [("PROJECT DEVELOPMENT TRACKER", 13, True, EMERALD)])
    _text(slide, Inches(0.9), Inches(3.25), Inches(11.5), Inches(2.2),
          [(META["title"], 40, True, WHITE),
           (META["subtitle"], 18, False, MUTED)],
          line_spacing=1.1)
    _text(slide, Inches(0.9), Inches(6.7), Inches(11.5), Inches(0.4),
          [("One slide per week · headline = progress · notes = talk track", 12, False, MUTED)])
    return slide


def add_week_slide(prs, wk):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    _set_bg(slide, WHITE)

    # green header band
    _bar(slide, 0, 0, SLIDE_W, Inches(1.55), GREEN)
    _text(slide, Inches(0.9), Inches(0.28), Inches(8.0), Inches(0.4),
          [(f"{wk['week'].upper()}  ·  {wk['dates']}", 12, True, EMERALD)])
    _text(slide, Inches(0.9), Inches(0.62), Inches(11.5), Inches(0.8),
          [(wk["phase"], 24, True, WHITE)], anchor=MSO_ANCHOR.MIDDLE)

    has_img = wk.get("image") and os.path.exists(wk["image"])
    text_w = Inches(6.6) if has_img else Inches(11.5)

    # accent tick + one-line headline (the slide's main message)
    _bar(slide, Inches(0.9), Inches(2.15), Inches(0.9), Inches(0.06), EMERALD)
    _text(slide, Inches(0.9), Inches(2.4), text_w, Inches(3.4),
          [(wk["headline"], 26, True, INK)], line_spacing=1.12)

    # a short "in the notes" cue so the slide reads on its own
    _text(slide, Inches(0.9), Inches(6.55), text_w, Inches(0.5),
          [("Detailed talk track in speaker notes ▸", 12, False, GREEN)])

    if has_img:
        # place the render on the right, framed
        img_left = Inches(7.75)
        img_top = Inches(2.15)
        img_w = Inches(4.7)
        slide.shapes.add_picture(wk["image"], img_left, img_top, width=img_w)

    # footer
    _text(slide, Inches(0.9), Inches(7.05), Inches(11.5), Inches(0.35),
          [(META["footer"], 9, False, MUTED)])

    # speaker notes = detailed bullet talk track
    notes = slide.notes_slide.notes_text_frame
    notes.text = f"{wk['week']} — {wk['dates']} — {wk['phase']}"
    for b in wk["notes"]:
        p = notes.add_paragraph()
        p.text = f"• {b}"
    return slide


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    add_title_slide(prs)
    for wk in WEEKS:
        add_week_slide(prs, wk)
    out = os.path.join(HERE, "skoda-storyboard-project-tracker.pptx")
    prs.save(out)
    print(f"wrote {out} ({len(WEEKS)} week slides + title)")


if __name__ == "__main__":
    build()
