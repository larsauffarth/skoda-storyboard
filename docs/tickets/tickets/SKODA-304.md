# SKODA-304 — Footer fragment (nav repeat + social + app badges + legal + brand SVG)
- **Epic:** E03 — Chrome Fragments
- **Type:** fragment
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 3 SP · AI-assisted 1–2d / manual 2–4d *(planning estimate, not a quote)*

## Summary
Author the `footer` DA fragment and load it via the Block Collection Footer block into `<footer>`: a repeat of the nav menu plus social links, app-store badges, a legal bar, and the brand SVG.

## Description
`SKODA-HEADER-FOOTER-ANALYSIS.md` §3 found the footer is **content, not code** — largely a **repeat of the same nav menu** (the full nav tree reused, ~32 items) plus social icons, app-store badges, RSS/feeds, and a legal bar. It's authored as a `footer` DA fragment and loaded by `footer.js`. Notable press-specific detail: the app badges point to the **"Škoda Media Room" journalist app** (iOS + Android) and there is a WhatsApp channel. Social icons are an icon-font in the source and must be converted to inline SVG per EDS convention.

## Requirements / Spec
- **Footer block** (Block Collection Footer) loaded into `<footer>`; `footer` DA fragment as the content source.
- **Nav-menu repeat** — the site nav tree reused as footer navigation.
- **Social links:** Facebook, Instagram, YouTube, WhatsApp — rendered as **inline SVG** (convert from source icon-font `icon-*` classes).
- **App-store badges:** "Škoda Media Room" app — iOS (`apps.apple.com/.../id420627875`) + Android (`play.google.com/.../com.icomvision.skodamediaservices`); plus WhatsApp channel (`go.skoda.eu/whatsapp`).
- **Legal bar:** Data Protection, Copyright, Cookies, Whistleblower system links + copyright notice.
- **Brand SVG** in the footer brand region (per `BRAND_LOGO` pattern).
- RSS/feed links preserved (RSS from the EDS index).
- Per-locale fragment (one `footer` doc per language); EN for the pilot.

## Acceptance Criteria
- [ ] `<footer>` renders the Footer block from the `footer` fragment.
- [ ] The nav menu is repeated in the footer.
- [ ] Social links (FB/IG/YT/WhatsApp) render as inline SVG (no icon-font).
- [ ] App-store badges link to the Škoda Media Room iOS + Android apps; WhatsApp channel link present.
- [ ] Legal bar (Data Protection/Copyright/Cookies/Whistleblower) + copyright notice present.
- [ ] Brand SVG renders; `npm run lint` passes.

## Dependencies
- Upstream: SKODA-102 (boilerplate scaffold), SKODA-106 (design tokens + global CSS) / Downstream: SKODA-904 (newsletter/subscriber service references footer links)

## Risks / Flags
- 🟢 Low–Med effort; footer is a fragment, not bespoke IA.
- Icon-font → inline SVG conversion is a small but required conversion.
- Preserve the press-specific Škoda Media Room app + WhatsApp channel links (brand/press assets to retain).
- **Media Room footer is DIFFERENT from the Storyboard footer** *(client walkthrough 2026-09-14, provisional pending transcript)* — this ticket delivers the **Storyboard** footer only. A **distinct MR footer variant** (a second `footer` fragment + block variant) is net-new scope; the exact deltas (links/legal/app-badge set) are unconfirmed until the transcript is reviewed. **Likely a separate ticket** — hold for transcript before scoping/estimating. Cross-ref COM18.
