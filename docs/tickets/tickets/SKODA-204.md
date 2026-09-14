# SKODA-204 — Embeds block (Vimeo/YouTube/Buzzsprout/Spotify, dnt=1, lazy)
- **Epic:** E02 — Core Blocks
- **Type:** block
- **Phase:** A  ·  **Pilot:** Yes · **Milestone:** M1 (15 Oct demo)
- **Estimate:** 3 SP · AI-assisted 1–2d / manual 2–4d *(planning estimate, not a quote)*

## Summary
Build the rich-media Embeds block covering Vimeo/YouTube/Buzzsprout/Spotify via URL autoblocking, preserving `dnt=1` and using native lazy iframes. **Also carries the generic third-party script embed used by MR-PR03 — the AI-generated audio-reading widget** on press releases (see below).

## Description
Embeds appear across story + press-release pages (Vimeo 246, YouTube 201, Buzzsprout 195, Spotify 36 — `SKODA-EN-BLOCK-INVENTORY.md` §2A; §7 #5). Fully static, no backend (`SKODA-SYSTEM-BUILD-SPECS.md` §6). Replace the source's `IntersectionObserver` `data-src` swap with native `loading="lazy"`; autoblock a bare provider URL on its own line (`/docs/aem-embed`, auto-blocking in markup-sections-blocks). Preserve Vimeo `dnt=1` (do-not-track) privacy param.

**Why this is low-risk (de-risking note):** all video/audio is **externally hosted** (Vimeo / YouTube / Buzzsprout / Spotify) and merely embedded — client-confirmed there is **no MAM / no AEM Assets video / no self-hosted media**. Therefore this block has **zero video-migration workstream**: no video files to move, transcode, or host; **no video counts toward the ~28,300-item / ~200k-file media footprint**; and **no player to rebuild** (playback, streaming, adaptive bitrate, captions all handled by the provider). We only reproduce the embed markup + `dnt=1` + lazy-load + consent gate. This narrows the demo's media effort to **images (masters-only ingest) + the media-cart** — video is essentially free.

## Requirements / Spec
**DA content model:** author pastes a provider URL on its own line → auto-blocked into Embed (no table needed for the common case). Table form supported for options.

**`decorate(block)` outline:**
1. Detect provider from URL host (Vimeo / YouTube / Buzzsprout / Spotify).
2. Build the correct iframe embed URL:
   - Vimeo: `player.vimeo.com/video/{id}?dnt=1&app_id=…` — **preserve `dnt=1`**.
   - YouTube: privacy/nocookie embed URL.
   - Buzzsprout / Spotify: audio embed URL (audio variant of the same block).
3. `loading="lazy"` (native) — replaces IntersectionObserver `data-src` swap.
4. Aspect-ratio CSS wrapper (no CLS); `<iframe title>` set.
5. Optional poster / click-to-load for perf + consent gating.
6. **Consent:** gate third-party iframes behind OneTrust when required (click-to-load); third-party loads in delayed phase.
7. **Generic / AI-audio embed (MR-PR03):** the press-release AI-generated audio-reading is an **arbitrary third-party JS widget** (not one of the four named oEmbed providers) — reproduce the vendor's embed as-is (no rebuild, per §11.2 / D-none). Route it through the project's **`widget` autoblock** (`buildWidgetAutoBlocks`, DEVELOPER-GUIDE §3) if a raw `<script>` widget rather than an iframe, or as a generic-provider branch of this block if iframe-based. Per-language; consent-gated like the other embeds (consent is OUT of Adobe scope per D10, so the M1 gate is a stub).

## Acceptance Criteria
- [ ] All four providers render from a pasted URL (autoblock).
- [ ] Vimeo embeds carry `dnt=1`.
- [ ] iframes use native `loading="lazy"` and have a `title`.
- [ ] Aspect-ratio wrapper → no layout shift.
- [ ] Audio providers (Buzzsprout/Spotify) render correctly.
- [ ] The MR-PR03 AI-audio vendor widget renders as-is (via the `widget` autoblock or a generic-embed branch), per-language, without rebuilding the vendor.
- [ ] Consent-gating hook present (click-to-load / delayed phase); `npm run lint` clean.

## Dependencies
- Upstream: SKODA-102
- Downstream: SKODA-603 (pilot pages with embeds), SKODA-703 (a11y), SKODA-804/905 (consent + analytics wiring, later phase)

## Risks / Flags
- Consent/analytics coupling: third-party iframes must respect OneTrust and re-emit `skoda-analytics` events (specs §7) — full wiring is Phase B/C (SKODA-804/905), pilot uses the gate hook.
- [RUNTIME-UNCONFIRMED]: embed lazy-load timing (specs §8) — verify in browser.
