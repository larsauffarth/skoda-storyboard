# Component Spec: Card / Teaser

Status: **CAPTURED** (measured 2026-09-15 via Chrome DevTools MCP; awaiting screenshots + final QA).
Foundations: [`_FOUNDATIONS.md`](_FOUNDATIONS.md). Method: [`_CAPTURE-PROTOCOL.md`](_CAPTURE-PROTOCOL.md).

## 1. Identity

- **Component:** Card / Teaser (the universal content unit, 91% page coverage).
- **EDS block(s):** `cards-overlay`, `cards-media`, `cards-toolbar` (and base `cards`). Reused by
  `stories`, `story-rail`, and by tickets 207 / 402 / 810.
- **Client PDF IDs:** COM-08 (Content Card); STO-C03 / S03 / M04 / D06 (Story Card, Series Card,
  Related Stories); MR-L05 (Result Card).
- **Ticket:** SKODA-201 (reused across 207/402/stories/story-rail/810).
- **Source reference:** `https://www.skoda-storyboard.com/en/` (featured promo grid + category rails).
- **Top-level selectors:** `.article-teaser` (the card), `.article-teaser-media` (image layer),
  `.article-teaser-overlay` (caption layer), `.article-teaser-toolbar` (action row).

## 2. Source anatomy

Critical correction to earlier analysis: `.article-teaser` is **one composite card**, not three
variants. Its three layers are:

```
.article-teaser  (the card; also carries category-*, media-cart-item, promo-box-item modifiers)
├── .article-teaser-media      image layer  (position:relative; overflow:hidden; radius 8px)
│   ├── <img>                  object-fit:fill, clipped to a ~16:9 box
│   └── .article-teaser-media:after   hover icon (icon-font \e02f), fades in
├── .article-teaser-overlay    caption layer (position:absolute; inset:0; gradient scrim; white text)
│   ├── .entry-title           title
│   └── .article-teaser-toolbar   (in overlay context: background transparent)
└── .article-teaser-toolbar    action row (flex; space-between; base background #fff)
```

The EDS build **decomposes** this composite into three reusable blocks: `cards-overlay`
(text over image = the overlay layer), `cards-media` (image above text = media layer + body), and
`cards-toolbar` (card + action row). A single source teaser therefore maps to a *combination* of EDS
variants depending on context.

**Libraries to retire (do not port):** Isotope (masonry), `dotdotdot` (JS line clamp; replace with
CSS `line-clamp`), the icon-font `:after` (replace with an SVG icon), jQuery. Media-cart affordances
carry `data-action` / `data-id` / `data-size` (see `media-cart.md` / SKODA-505).

## 3. Measured visual spec

All values: `measured (source-url · selector · viewport) -> token`. Source URL for all rows below is
`https://www.skoda-storyboard.com/en/`.

### Card container (`.article-teaser`)
- border-radius: `8px` (· `.article-teaser` · 1280) -> `--card-radius`.
- box-shadow: `0 1px 10px 0 rgb(0 0 0 / .07), 0 2px 2px -2px rgb(0 0 0 / .1)` (· 1280)
  -> `--card-shadow` (exact match).
- position: `relative`; background: transparent.

### Media layer (`.article-teaser-media`)
- position `relative`; overflow `hidden`; border-radius `8px` -> `--card-radius`.
- `<img>` object-fit: **`fill`** (source stretches the image). Intrinsic ratios vary (promo
  `1440/960` = 3:2; standard `768/432` = 16:9); the visible box is height-constrained to ~16:9
  (standard card box ratio `1.78` at every viewport; promo `1.72-1.74`).
  - **Deviation to fix in EDS:** `object-fit:fill` distorts non-16:9 masters. The rebuild should use
    `object-fit:cover` on a `16 / 9` box (quality upgrade, no visual regression on 16:9 sources).

### Overlay layer (`.article-teaser-overlay`)
- position `absolute`; inset `0`; color `#fff` -> `--skoda-white`.
- scrim (background-image): `linear-gradient(270deg, transparent, rgb(0 0 0 / .25))`,
  `linear-gradient(180deg, transparent, rgb(0 0 0 / .1))` (· `.article-teaser-overlay` · 1280).
  No token for scrim gradients -> **candidate tokens** `--scrim-h`, `--scrim-v`.

### Title (`.entry-title`)
- standard: font-size `18px`, line-height `21.6px` (1.2), weight `400`, color `#fff`
  (· `.article-teaser-overlay .entry-title` · all viewports) -> `18px` = `--heading-font-size-s`,
  weight -> `--weight-regular`.
- **promo first item:** font-size `29.6px` (`1.85em`), line-height `35.52px`, weight `400`, **only at
  `min-width: 768px`** (rule `.promo-box .items .item:first-child .article-teaser .entry-title` inside
  `@media (min-width:768px)`; · confirmed in source CSS). Below 768 it falls back to the 18px base.
  `29.6px` has no token -> **candidate** `--heading-font-size-promo` (or compute `1.85em`).

### Toolbar (`.article-teaser-toolbar`)
- display `flex`; justify-content `space-between`; align-items `center`.
- base background `#fff` -> `--skoda-white`; in overlay + attachment/gallery contexts background
  `transparent`.
- base padding `.625rem` (`10px`); homepage overlay context padding `0 16px 16px`
  (`16px` -> `--spacing-m`).
- buttons: pill, border-radius `50px` (no token -> **candidate** `--pill-radius: 50px`), background
  `#fff`, color `#161718` -> `--skoda-ink`.
- **Homepage hides cart actions in the toolbar** (`body.page-template-template-homepage
  .article-teaser-toolbar .media-cart-action{display:none!important}`); cart actions appear only in
  Media Room / listing contexts.

## 4. Responsive behavior

- **Card box aspect** stays ~16:9 at every band (measured `1.78` standard at 1280/1024/768/mobile).
- **The only title breakpoint is `768px`:** promo first-item title is `29.6px` at `>=768`, `18px`
  below. All other titles are `18px` at every band. This is the source's real breakpoint (matches the
  `_FOUNDATIONS` 768 primary), not the boilerplate `900px` the current EDS blocks hardcode.
- Column counts belong to the grid context (promo-box big+small, latest grid, rails), specified in
  [`carousel-rails.md`](carousel-rails.md) and the `stories` block, not to the card itself.
- Capture note: the DevTools window floored at ~500px; a true 375 mobile check needs device emulation
  (follow-up), but the <768 layout state was captured at 500px.

## 5. Interaction states

- **Card link hover/focus:** the whole card is a link (`href` on the media/title). Add a visible
  `:focus-visible` ring (source relies on browser default; a11y upgrade).
- **Media hover:** `.article-teaser-media:after` icon (icon-font `\e02f`) fades in from `opacity:0`,
  transition `all .3s cubic-bezier(.68,-.55,.27,1.55)`. EDS: reproduce with an SVG overlay icon +
  opacity transition. **This icon-fade is the visible hover affordance on rail/listing/promo-box cards.**
- **Image zoom system (measured 2026-09-15, matters, easy to get wrong):** every `.image-holder img`
  carries `scale: 1.02 !important` at rest inside an `overflow:hidden` holder, with
  `transition: scale .5s cubic-bezier(.165,.85,.45,1)`. On the shared `.items` cards (rails, listings,
  **and the promo-box**) the `:hover` rule sets the **same `scale:1.02`**, so there is **no net zoom** on
  those, the `1.02` is a constant overscan to hide sub-pixel edge gaps, and the transition is effectively
  idle. A real hover **zoom to `scale(1.1)`** exists **only on model-page related cards**
  (`.single-skoda_model .models .items article:hover .image-holder`). EDS: keep the `1.02` overscan +
  the `.5s` scale transition on the base card so the zoom variant is a drop-in; apply the `1.1` hover
  zoom **only** on the model-page card variant, not on generic listing/promo cards.
- **Toolbar / gallery context:** toolbar transitions `opacity .25s ease`.
- **Toolbar buttons hover/focus/active:** background `#a8ffcc` (emerald hover tint), `outline:0`,
  `text-decoration:none` (source CSS, shared with `.btn`/media-cart actions). `#a8ffcc` has no token
  -> **candidate** `--skoda-green-emerald-hover: #a8ffcc` (tint of `--skoda-green-emerald #78faae`).

## 6. Accessibility

- Card is a single link: ensure one accessible name (title text), not duplicate links (image + title
  both linking) creating two tab stops for one card. Prefer one `<a>` wrapping, or `aria-hidden` on
  the redundant one.
- Add `:focus-visible` outline (source has `outline:0` on interactive states, an a11y regression to
  reverse).
- Toolbar buttons: real `<button>`/`<a>` with accessible labels (icon-only buttons need
  `aria-label`).
- `alt` text carries from source (96% coverage per analysis); enforce non-empty `alt` or empty for
  decorative.

## 7. EDS target

Blocks: `cards-overlay`, `cards-media`, `cards-toolbar`. Follow the existing repo patterns
(`blocks/cards*/*.js`): rows -> `<ul>/<li>`, cells classified by **content sniffing** (image cell =
single child with `<picture>`; toolbar cell = all `<p>`-with-`<a>`; icon cell = `:name:`; else body),
defensive decoration (drop empty image cells, fall through to body), `optimizeImageInPlace` on
authored `<picture> > img`, tokens-only CSS scoped to `.cards-overlay` / `.cards-media` /
`.cards-toolbar`.

### DA authoring table (worked examples)

`Cards (overlay)`, text over image:
| (image cell)            | (body cell)                    |
|-------------------------|--------------------------------|
| ![](./media_hero.jpg)   | ### Story title \n 12. 3. 2026 |

`Cards (media)`, image above text (add `social` class for the static social variant).

`Cards (toolbar)`, card + action row: a third cell whose children are all `<p>` each containing an
`<a>` becomes the toolbar.

Variants: authored as `Cards (overlay)` etc.; count-based auto-variants already exist
(`cards-overlay.js`: 3 cards -> promo, 5 -> latest). Promo first card gets the 29.6px title at >=768
(add a `cards-overlay-promo` rule).

## 8. Open decisions + recommended default

- **Image fit:** recommend `object-fit:cover` on a `16/9` box (assumption to confirm; source uses
  `fill`, which distorts). No visual regression on 16:9 masters.
- **New tokens** to add (assumption to confirm): `--pill-radius: 50px`,
  `--skoda-green-emerald-hover: #a8ffcc`, `--heading-font-size-promo` (or use `1.85em`), scrim
  gradients, and define the missing `--skoda-grey-500`.

## 9. Pixel-perfect acceptance criteria

Compare EDS `/en` render to source at each viewport. Format: WHAT / WHERE / viewport / expected / actual.

- [ ] Card radius: `.cards-overlay li` / all / border-radius = `8px` (`--card-radius`).
- [ ] Card shadow: `.cards-overlay li` / all / box-shadow = `--card-shadow` exactly.
- [ ] Media aspect: `.cards-* img` / all / rendered box = `16:9` (±1px height), `object-fit:cover`.
- [ ] Overlay scrim: `.cards-overlay` / all / dual gradient present (270deg to `rgb(0 0 0 /.25)` +
      vertical to `.1`); title legible (contrast >= 4.5:1).
- [ ] Standard title: `.entry-title equivalent` / all / `18px` / `21.6px` / weight `400` / white.
- [ ] Promo title: promo first card / **>=768** / `29.6px` / `35.52px`; **<768** / `18px`.
- [ ] Toolbar: `.cards-toolbar` / all / flex space-between, align center; base bg white; overlay
      context transparent; pill buttons radius `50px`.
- [ ] Button hover: toolbar button / all / background `#a8ffcc` on hover/focus/active.
- [ ] Media hover: icon overlay fades in over `.3s`.
- [ ] Homepage cart actions hidden in toolbar; visible in Media Room/listing.
- [ ] A11y: one tab stop per card; visible `:focus-visible` ring; icon buttons have `aria-label`;
      non-empty `alt`. Keyboard: card reachable + activatable by Enter.
- [ ] Visual diff vs source at 1280/1024/768/mobile <= 2% per-pixel (excluding image content).

## 10. Reference screenshots

`assets/card-teaser/`, `1280.png`, `1024.png`, `768.png`, `mobile.png` (promo grid + a category rail
in context). Pending capture.
