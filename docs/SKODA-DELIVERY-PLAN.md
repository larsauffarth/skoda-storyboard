# Škoda Storyboard → Edge Delivery — Date-Driven Delivery Plan

**Companion to `SKODA-MASTER.md`.** Supersedes the earlier phase-only roadmap with a **milestone-driven plan** built around the two client-mandated dates. Reflects **client-confirmed scope** (Sept 2026 briefing).
**Date:** 2026-09-07 · **Target:** DA / Experience Workspace + EDS.

---

## 0. The Two Fixed Dates (mission-critical)

| Milestone | Date | Bar to clear |
|---|---|---|
| **M1 — Functioning demo** | **15 Oct 2026** (~5.5 weeks) | Front end functioning · approved **AEM Assets** in use · **blog posts replicated** · **media-cart replicated** · this is the **"blueprint" for future VW EDS projects** — **politically mission-critical** (miss = the AEM programme is in jeopardy) |
| **M2 — Go-live** | **02 Jan 2027** (~16 weeks) | Content fully migrated · authoring workflows set up & running · live in EDS |

**These dates reframe everything.** The prior "capability pilot" ≈ M1, but M1's required scope is **larger** than our earlier pilot (adds media-cart + a second language + AEM Assets) — see §2. M1 is achievable but **tight**; it is the top risk (§6).

---

## 1. What Changed vs the Prior Plan

| Prior position | Client-confirmed reality | Impact |
|---|---|---|
| Media-cart = Phase C (deferred, post-demo) | **Media-cart required in the Oct 15 demo** | Pulled into M1 — but simpler than feared: **device-ID based, no login/account** → collect + zip-download, not an auth system |
| Pilot = EN only | **EN + CS** are the primary localized pair (HQ authors → localized to EN & CS) | M1 should prove **2 locales**, not 1 |
| DAM ownership open (D5) | **AEM Assets is the source of approved assets** | **D5 resolved**; ingest approved assets from AEM Assets |
| Newsletter/subscriber = high-risk account system | *(unchanged — but not in demo scope; and note media-cart is NOT the newsletter — different system, no auth)* | De-risks media-cart specifically |
| Analytics = bespoke 140 KB `skoda-analytics` cross-cutting rebuild | Client says **GA + Facebook pixel + Yoast SEO** | Likely the bespoke layer just **feeds GA/GTM** → analytics rebuild is probably **lighter** (wire GA + FB pixel + preserve metadata). **Confirm.** |
| Components = jQuery/Owl/Isotope/React (observed) | Client maintains **Material UI** library + **Figma** design system | The MUI/Figma library is the *maintained* system; the deployed site is the older jQuery theme. Rebuild-vanilla-for-EDS still holds; **Figma-to-AEM is a showcase opportunity**. |
| — (not captured) | **Content embargoes**: "confidential" media-room items visible only to select authors until a release date | **NEW hard requirement** — not in any prior doc; needs a staged-publish + access solution (§4) |
| — | **Nav is metadata-tag-driven** (WordPress tags dictate nav placement) | Confirms query-index/tag approach; nav built from metadata, not hand-authored |
| — | No personalization, no user auth, no edge functions today; authors auth via **Škoda IDP** | Simplifies the target; auth only on the authoring side |

---

## 2. M1 — Demo Scope (15 Oct 2026)

**Goal:** a functioning, credible Škoda Storyboard demo on EDS that proves the model and doubles as the VW blueprint.

**In scope for M1:**
- **Front end functioning** — core blocks: hero, cards/teaser, gallery (+ lightbox), embeds (Vimeo/YouTube), tags; header/mega-menu + footer chrome (mobile ARIA fix).
- **Blog posts replicated** — the **story/blog** template. ⚠️ Stories use **SiteOrigin Page Builder** — the importer must flatten it (this was our Phase-B "hardest parser"; **it is now on the M1 critical path** — see §6 R-A).
- **Media-cart replicated** — device-ID collect + **zip-on-demand download** (no login). Fed by the mediabox asset set; served from **AEM Assets**.
- **AEM Assets integration** — approved images/assets sourced from AEM Assets (resolves DAM question).
- **Listings + search** — query-index-backed listing + index search (index-only).
- **Two locales (EN + CS)** — per-locale content + index; language selector shows only languages an article exists in.
- **OneTrust consent** + **GA / Facebook pixel** tags (delayed phase).
- **Figma-to-AEM** — showcase agentic component generation from the Figma design system where feasible.

**Out of M1 (→ M2 or later):** full content migration, DE/SK/SR/SL locales, banner ad platform, newsletter, content embargoes (unless a demo stub is wanted), full authoring-workflow rollout.

**Effort check:** M1 ≈ the capability pilot (~30–50 AI-assisted engineer-days) **plus** media-cart (~5–8) **plus** the story/Page-Builder flatten pulled forward — now **~3–5 AI-days** (re-pointed after the POC + census; reduced-fidelity demo slice ~2–3) — **plus** a 2nd locale (~2–3). Realistic M1 ≈ **~40–66 AI-assisted engineer-days across the team** in ~5.5 weeks → **needs parallelism and early start; this remains the schedule risk, but the hardest single piece (story flatten) is now de-risked.**

---

## 3. M2 — Go-Live Scope (02 Jan 2027)

- **Content fully migrated** — all templates at scale (story flatten, press-kits, Škodapedia pre-baked, pages); bulk import via DA source-API + Bulk Operations.
- **Authoring workflows** — DA/EW authoring set up; authors trained; nav-by-metadata working; author auth via Škoda IDP (or EW equivalent).
- **Localization** — EN + CS complete; DE/SK/SR/SL supported on-demand (per-locale trees + EW Translation); single-language articles handled by the selector.
- **Content embargoes** — the confidential-until-date mechanism live for the media room (§4).
- **Banner platform, newsletter** — per client priority (rebuild-as-service or defer per D3/D4).
- **CDN** — Adobe-recommended (EDS default); client is CDN-agnostic (currently CloudFront/Azure Front Door).
- **Analytics** — GA + FB pixel + metadata/SEO wired; confirm whether the bespoke dataLayer layer is needed.

---

## 4. New Requirement — Content Embargoes (needs a decision)

**Requirement:** media-room items flagged "confidential" must be visible **only to a select audience of authors** until a **release date**, then publish automatically/publicly.

**Why it's hard in EDS:** EDS serves *published* static content from a public CDN — there's no native "logged-in-authors-only + scheduled release" gate on the delivery side.

**Candidate approaches (to evaluate):**
1. **Staged publish** — keep embargoed items unpublished (visible in DA/EW preview to authenticated authors only) and **publish on the release date** (scheduled/automated publish). Simplest; fits EDS's preview-vs-publish model.
2. **Access-controlled delivery** — a gated path/section with author auth (heavier; introduces delivery-side auth EDS doesn't do natively).
3. **Hybrid** — metadata-driven `robots`/exclusion + scheduled publish.

**Recommendation:** **(1) staged publish** — authors see embargoed items in EW preview (already IDP-authenticated); a scheduled publish flips them live on the release date. Confirm this satisfies "select audience of authors." **Not needed for M1** unless a demo stub is wanted; **required for M2.**

---

## 5. Localization Model (confirmed)

- **HQ authors → localized to EN + CS** (primary pair).
- **DE / SK / SR / SL** — localized **only when a local office opts in** (on-demand).
- **Some articles exist in only one language** (e.g. SK-only).
- **Requirement:** the header **language selector must show only the languages a given article actually exists in** (no dead links to untranslated variants).
- **EDS approach:** per-locale content trees + per-locale query-index; the selector reads each article's available-locale set (from hreflang/metadata) and renders only those. EW native Translation for on-demand localization. **M1 proves EN + CS**; M2 adds the rest on-demand.

---

## 6. Risks (milestone-focused)

| # | Risk | Sev | Mitigation |
|---|---|---|---|
| **R-A** | Story/Page-Builder flattening on the M1 critical path (blog posts required Oct 15) — **DE-RISKED** by the flattener POC + full-corpus census (`SKODA-FLATTENER-POC-FINDINGS.md`): small closed widget set (6 types; 99.8% covered by 5 simple ones; embeds inline), re-pointed **13→8 SP** | 🟠 (was 🔴) | Reduced-fidelity flatten for the demo (~2–3 SP); full parser M2; residual risk = 0.2% interactive long-tail (`k2tools-charge-map`) + browser-unverified layout fidelity |
| R-B | **5.5-week M1 window** with expanded scope (media-cart + 2 locales + stories) | 🔴 | Parallelize (blocks / chrome / import / media-cart as separate tracks); descope non-essentials; daily integration |
| R-C | Media-cart zip-download service (device-ID) + AEM Assets integration must be demo-ready | 🟠 | Confirmed no-auth simplifies it; build zip-on-demand early; validate AEM Assets delivery |
| R-D | Content embargo mechanism (M2) has no native EDS solution | 🟠 | Decide staged-publish approach now (§4); don't discover it late |
| R-E | Analytics scope ambiguity (bespoke layer vs GA/FB/Yoast) | 🟡 | Confirm with Škoda; likely lighter than flagged |
| R-F | Figma-to-AEM showcase is a *new* workstream with demo expectations | 🟡 | Scope a contained showcase (1–2 components) rather than the whole library |
| R-G | Full content migration + authoring workflows for M2 in ~10 weeks after M1 | 🟠 | Automate import; begin bulk-import tooling during M1 |

---

## 7. Suggested Timeline (indicative)

```
Sep (now) ── M1 build ──────────────────────────── Oct 15 DEMO
  Wk1  Foundation (site, repo, tokens, AEM Assets integration, query-index skeleton)
  Wk2  Core blocks + chrome (parallel) · start story-flatten parser (R-A)
  Wk3  Listings/search + media-cart (zip) + EN/CS locale plumbing
  Wk4  Import pilot content (stories via flatten, press releases) + Figma showcase
  Wk5  Integrate, QA, perf/a11y, consent+GA/FB tags, dry-run
  Wk5.5 Buffer + demo hardening
Oct 15 ── M2 build ──────────────────────────────── Jan 2 GO-LIVE
  Full content migration at scale · authoring workflows + IDP · DE/SK/SR/SL on-demand
  · content embargoes (staged publish) · banner/newsletter per priority · CDN + analytics finalize
```

---

## 8. Open Decisions (updated)

| # | Decision | Status |
|---|---|---|
| D1 | Language scope | **Refined:** EN+CS for M1; DE/SK/SR/SL on-demand for M2 |
| D2 | Media-cart | **Resolved:** in M1; device-ID, no auth, zip-download |
| D3 | Banners | Open — M2 or defer (rebuild-as-service) |
| D4 | Newsletter | Open — M2 or defer |
| D5 | Media/DAM | **Resolved:** AEM Assets |
| D6 | Search | Index-only for M1; hosted search decision for M2 |
| D7 | Content cutoff | Open — full migration by M2 |
| D8 | Commerce | Closed (no commerce) |
| **D9 (new)** | **Content embargo mechanism** | Open — recommend staged-publish (§4); needed for M2 |
| **D10 (new)** | **Analytics**: is the bespoke `skoda-analytics` layer needed, or GA+FB pixel+metadata sufficient? | Open — confirm with Škoda |
| **D11 (new)** | **Figma-to-AEM showcase** scope for the demo | Open — recommend 1–2 components |

---

## 9. Notes

- **M1 date is non-negotiable and politically loaded** — plan for a *demonstrable* subset over completeness; better a smaller, polished, working demo than a broad broken one.
- The `skoda/` backlog tickets remain valid; this plan **re-sequences** them around the two dates and **pulls SKODA-801 (story flatten) and the media-cart forward into M1**. The media-cart demo build is now its own M1 ticket — **SKODA-505** (device-ID, no login, client-side zip; E05) — with **SKODA-902 re-scoped to production hardening** (serverless zip endpoint / signed access / cross-device state) for M2/Phase C. See `SKODA-MEDIA-CART-DOWNLOAD.md` for the options analysis. A backlog re-tagging (phase A/B → M1/M2) is the natural next step if you want the tickets to match this plan.
- Estimates are planning-level, not a quote.
- Cross-reference: `SKODA-MASTER.md` (canonical findings), `skoda/OVERVIEW.md` (ticket backlog).
