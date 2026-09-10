# Škoda Storyboard → Edge Delivery — Date-Driven Delivery Plan

**Companion to `SKODA-MASTER.md`.** Supersedes the earlier phase-only roadmap with a **milestone-driven plan** built around the two client-mandated dates. Reflects **client-confirmed scope** (Sept 2026 briefing).
**Date:** 2026-09-07 (build-confirmed addendum 2026-09-10) · **Target:** DA / Experience Workspace + EDS.

> **Build-confirmed addendum (2026-09-10).** The EN homepage + listings/rails slice shipped end-to-end on EDS+DA (commits #2–#18). **No strategic reversal, no date or headcount change.** Three assumptions refined: (1) index config is an **admin config-service `query.yaml` PUT**, not repo `helix-query.yaml`; (2) taxonomy/date metadata needs an **extraction/normalization layer**, not clean selectors; (3) heavy source masters **409 the content bus** and need **pre-conditioning** before publish. Also confirmed: the indexer **only sees published pages** (adds an ordered publish→reindex step to every content increment). The **effort mix shifts** from "flatten" (trending low) toward "metadata normalization + media conditioning" — total M1 engineer-days (~40–66) unchanged. Details flow into §1, §3, §6, §8 below.

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
| Index = repo **`helix-query.yaml`** (arch doc §2/§6) | **Build-confirmed:** config is a **`query.yaml` PUT to the admin config service** (`admin.hlx.page/config/{org}/sites/{site}/content/query.yaml`); `helix-query.yaml` retired | Config-surface only — strategy unchanged; update runbooks/tickets |
| Index columns = clean CSS selectors over HTML (SKODA-401) | **Build-confirmed:** key fields **not in usable meta** — `category` derived from URL segment; press-release dates need a 4-way fallback | 401 is a **normalization layer**, not a selector map — re-scope (§8/D10) |
| Media weight = abstract "~200k files" (briefing §2) | **Build-confirmed:** masters of **25–40 MB 409 the content bus on publish** | Import needs a **media pre-conditioning** step (E05) |
| Publish model implicit | **Build-confirmed:** indexer **only sees published pages** → ordered upload→preview→publish→reindex per increment | M2 migration budgets publish+reindex batching, not just import (§3, §6) |
| Story flatten = 🟠 / 5–8 SP | **Build-confirmed:** the story/rails slice flattened cleanly, **browser-verified** | Trends to low end; frees effort toward metadata+media (§8) |

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

- **Content fully migrated** — all templates at scale (story flatten, press-kits, Škodapedia pre-baked, pages); bulk import via DA source-API + Bulk Operations. **Pipeline has an ordered `publish → reindex` stage per increment** (build-confirmed: the query-index only sees live-published pages, so upload/preview alone leaves listings empty). At ~13,100 pages this is a **throughput/orchestration** concern — batch the live-publish + reindex and account for a few-seconds preview↔live lag; feasibility is not in doubt, but time budgets must include it, not just import. A **media pre-conditioning** pass (strip/replace >~10 MB masters) runs ahead of publish to avoid content-bus 409s at scale.
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
| **R-A** | Story/Page-Builder flattening on the M1 critical path (blog posts required Oct 15) — **DE-RISKED further (2026-09-10, build-confirmed):** the story/rails slice flattened cleanly (light cleanup transformer + one canonical Metadata block) and is **browser-verified**, not just structural. Trends to the **low end of 5–8 SP**. | 🟢 (was 🟠) | Reduced-fidelity flatten shipped for the slice; full parser M2 for the long tail (interactive `k2tools-charge-map`, multi-column). Freed effort re-allocated to metadata+media (§8) |
| **R-A0 (new)** | **Index field-mapping + publish ordering** — taxonomy/date fields aren't clean selectors (category-from-URL, 4-way date fallback), config is an admin-service `query.yaml` PUT, and the indexer only sees **published** pages | 🟠 | Treat 401 as a normalization layer (§8/D10); bake the upload→preview→publish→reindex order into every content increment; keep a repo copy of the submitted `query.yaml` for the record |
| **R-A′ (new)** | **Heavy masters 409 the content bus on publish** (25–40 MB inline images) | 🟠 | Add a **media pre-conditioning** step to the importer (detect/strip/replace >~10 MB masters with sized derivatives) before publish; proven fix on the shipped slice |
| R-B | **5.5-week M1 window** with expanded scope (media-cart + 2 locales + stories) | 🔴 | Parallelize (blocks / chrome / import / media-cart as separate tracks); descope non-essentials; daily integration |
| R-C | Media-cart zip-download service (device-ID) + AEM Assets integration must be demo-ready | 🟠 | Confirmed no-auth simplifies it; build zip-on-demand early; validate AEM Assets delivery |
| R-D | Content embargo mechanism (M2) has no native EDS solution | 🟠 | Decide staged-publish approach now (§4); don't discover it late |
| R-E | Analytics scope ambiguity (bespoke layer vs GA/FB/Yoast) | 🟡 | Confirm with Škoda; likely lighter than flagged |
| R-F | Figma-to-AEM showcase is a *new* workstream with demo expectations | 🟡 | Scope a contained showcase (1–2 components) rather than the whole library |
| R-G | Full content migration + authoring workflows for M2 in ~10 weeks after M1 | 🟠 | Automate import; begin bulk-import tooling during M1; **budget the ordered publish→reindex stage + media pre-conditioning** (build-confirmed, R-A0/R-A′) into the throughput plan, not just the import |

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

> **Alignment-call update (2026-09-10, Lars/Pushkar/Markus/Martin/Jaroslav).** Outcomes folded in below: **CDN resolved → Adobe CDN** (D14); **consent/OneTrust out of Adobe delivery scope**, analytics in (D10); **full migration = switch WordPress off** (reframes media-cart D2 + reuse options); **demo date may slip 1–2 weeks** (Martin); **demo content still undefined** (Pushkar) — Segment-1 "irreducible core" is open on their side too. New decisions surfaced: **authoring model DA vs Universal Editor** (D13) and **governance/RACI across CMS/AEP/Adobe teams** (D15). The three functions Markus flagged as "not OOTB" — exclude-from-listings, multi-category with editorial placement, manual+tag recommendations — are **already built** on `/en` (dedupe/exclude, category-tagged rails, manual promo + auto rails); demo them Monday. "Restricted folders for new-car launches" **confirms the embargo requirement is real** (D9). Feasibility split + required-accesses list: see `SKODA-FEASIBILITY-ASSESSMENT.md`.

| # | Decision | Status |
|---|---|---|
| D1 | Language scope | **Refined:** EN+CS for M1; DE/SK/SR/SL on-demand for M2 |
| D2 | Media-cart | **Reframed (2026-09-10):** purpose is **file-size REDUCTION for download** (reduced renditions), not just bundling; and **WordPress will be switched off**, so legacy `/direct-download/` reuse is an interim bridge only. Reduction is **server-side** (Adobe App Builder/edge or AEM Assets/Dynamic Media renditions) — **client-side zip demoted**. Cart state still device-ID/no-login. See `SKODA-MEDIA-CART-DOWNLOAD.md` (corrected). |
| D3 | Banners | Open — M2 or defer (rebuild-as-service) |
| D4 | Newsletter | Open — M2 or defer |
| D5 | Media/DAM | **Resolved:** AEM Assets — **sharpened (2026-09-10):** source masters ~40 MB (confirmed on call), too heavy to publish as-is (content-bus 409), so the demo pipeline fallback **requires a media pre-conditioning step**; strengthens the case to confirm the AEM Assets instance early |
| D6 | Search | Index-only for M1; hosted search decision for M2 |
| D7 | Content cutoff | Open — full migration by M2; **confirmed the intent is a full system migration so WordPress can be decommissioned** (incl. structured data + supporting functionality, per Jaroslav/Lars) |
| D8 | Commerce | Closed (no commerce) |
| **D9** | **Content embargo mechanism** | **Confirmed real (2026-09-10):** "restricted folders for new-car launches" — recommend staged-publish (§4); needed for M2 (candidate demo showcase if time allows) |
| **D10** | **Analytics + consent** | **Partially resolved (2026-09-10):** analytics **in** Adobe scope (standard, GA+FB+Yoast baseline; confirm bespoke `skoda-analytics` layer need); **OneTrust/consent OUT of Adobe delivery scope** (complex integration, stays with Škoda) |
| **D11** | **Figma-to-AEM showcase** scope for the demo | Open — recommend 1–2 components |
| **D12** | **Which of the 15 taxonomy facets are demo-critical for listings vs. deferable?** Build-confirmed facet extraction is a **per-field normalization layer** (not clean selectors) | Open — confirm with Škoda; scope SKODA-401 to the demo-critical subset first |
| **D13 (new, 2026-09-10)** | **Authoring model: Document Authoring vs Universal Editor** (vs other). Must keep authors' current WordPress-comparable capabilities | **Open — architecture-critical.** Our docs assume DA; UE would materially change the model. Needs an early decision |
| **D14 (new, 2026-09-10)** | **CDN / edge-function host** | **Resolved: Adobe CDN** (Martin) — Adobe-hosted edge/App Builder functions available; no external CloudFront/Azure-Front-Door dependency for delivery |
| **D15 (new, 2026-09-10)** | **Governance / RACI** across Markus's CMS team, Sara's AEP team, and the new Adobe delivery team | **Open — project-setup blocker** (Jaroslav). Responsibilities + cooperation to be agreed |
| **D16 (new, 2026-09-10)** | **Non-functional requirements**: security-code review, pentest, licence checks, RTO/RPO, logging/auditing, Azure DevOps | **Open — client-gated.** Jaroslav to draft; subject to Škoda Auto governance; a **top year-end timeline risk** |

> **Resolve these live:** `SKODA-DISCOVERY-SESSION-OCT15.md` is the 60-minute agenda that drives the open D-items above (plus the client-side dependency/access risks) to an **owner + date**. Run it before demo-build start; capture outcomes back into this table. Feasibility + accesses: `SKODA-FEASIBILITY-ASSESSMENT.md`.

---

## 9. Notes

- **M1 date is non-negotiable and politically loaded** — plan for a *demonstrable* subset over completeness; better a smaller, polished, working demo than a broad broken one.
- The `skoda/` backlog tickets remain valid; this plan **re-sequences** them around the two dates and **pulls SKODA-801 (story flatten) and the media-cart forward into M1**. The media-cart demo build is now its own M1 ticket — **SKODA-505** (device-ID, no login, client-side zip; E05) — with **SKODA-902 re-scoped to production hardening** (serverless zip endpoint / signed access / cross-device state) for M2/Phase C. See `SKODA-MEDIA-CART-DOWNLOAD.md` for the options analysis. A backlog re-tagging (phase A/B → M1/M2) is the natural next step if you want the tickets to match this plan.
- **Effort-mix shift (2026-09-10, build-confirmed) — no change to totals, dates, or team.** M1 stays ~40–66 AI-assisted engineer-days across the recommended **4 engineers**; both dates hold. What moves *inside* that envelope: **story flatten trends to the low end** (freeing Content-chain effort), and that relief funds two under-weighted areas surfaced in the build — a **metadata-normalization layer** in the importer (category-from-URL, multi-source date fallback, per-facet extraction for SKODA-401) and a **media pre-conditioning step** (detect/strip/replace >~10 MB masters, feeding E05). The reusable patterns the slice produced (admin-service index config, dynamic-rail-via-`buildBlock`, auto-populate+dedupe, media conditioning) are **blueprint assets** for future VW EDS sites — codify them before the blocks pool is split.
- Estimates are planning-level, not a quote.
- Cross-reference: `SKODA-MASTER.md` (canonical findings), `skoda/OVERVIEW.md` (ticket backlog), `SKODA-EDS-DA-ARCHITECTURE.md` (build-confirmed §6/§7/§13 updates).
