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
        "phase": "Understanding the site",
        "headline": "Sized up the full site and confirmed the move to the new platform is achievable.",
        "notes": [
            "Counted the whole site so scope is based on facts, not guesses: about 13,100 articles and "
            "pages across 6 languages, and roughly 28,300 images.",
            "Checked how the site is built today and confirmed nothing blocks the move — the current "
            "image setup will actually get faster on the new platform.",
            "Reviewed every story page: they follow a small, consistent set of layouts, and English and "
            "Czech are built the same way — so adding Czech is more volume, not more effort.",
            "Looked at the interactive features (media cart, banners, newsletter, search) to understand "
            "what each will take to rebuild.",
            "Wrote up the findings for leadership and agreed the overall approach.",
            "Bottom line: the work is well understood; the main thing to manage is the fixed 15 October "
            "demo date, not the technology.",
        ],
    },
    {
        "week": "Week 2",
        "dates": "8–11 Sep 2026",
        "phase": "First page rebuilt — English home page",
        "headline": "Rebuilt the English home page on the new platform so it looks like the original.",
        "image": os.path.join(ASSETS, "week2-en-render.png"),
        "notes": [
            "Rebuilt the English home page end-to-end on the new platform, including the top navigation "
            "and footer.",
            "Set up a repeatable way to bring pages across automatically, so the rest of the site can "
            "follow the same path.",
            "Captured essentially all of the original content — every story headline made it across.",
            "Applied Škoda's brand look (colours, fonts, spacing) so pages match the design, not a "
            "generic template.",
            "Matched the original layout closely — the featured story grid, the story lists, the dark "
            "brand sections, the header and the footer all line up with the live site.",
            "Reviewed the result in the browser and fixed the issues we found so it renders cleanly.",
            "A few interactive pieces are intentionally left for later (media cart, banners, live "
            "newsletter and social feeds, search, the other languages) — the goal this week was to prove "
            "the look and the page structure.",
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
