# Call Kit, Škoda PoC-vs-Final Solution Proposal (Wed 2026-09-16, 10:00)

**Purpose:** present the solution design, get Škoda to sign the **Target tier as the PoC definition of
done**, close (or assign owner+date to) the **six gating decisions**, and lock the **M1 hard-blocker
asks**. This is the "blueprint for future VW EDS projects" conversation.
**Presenter:** Lars. **Škoda working group:** Pushkar, Markus, Martin, Jaroslav, Sara, Jagan.
**Screen-share (client-facing):** `SKODA-CLIENT-SCOPE-DISCUSSION.html`, the clean walk-through to
present (approach, what's live, a filterable Demo/Final split, what we need from Škoda; no effort,
staffing, ticket IDs, or risk board). Open it in a browser and drive from it.
**Internal backing (do NOT share):** `SKODA-SOLUTION-DESIGN.html` (tiers + decision board),
`SKODA-M1-DEMO-TARGET.md` (definition of done), `SKODA-DELIVERY-PLAN.md` §8 (D1–D19),
`docs/tickets/OVERVIEW.md` (63 tickets / 261 SP), and this kit.

## The one thing to keep front of mind
The build is green and largely under our control. **Every real threat to 15 Oct and 02 Jan is on
Škoda's side:** demo content selection, an AEM Assets instance, access/onboarding, and decision latency.
So the call's job is to convert those into named owners and dates today. One-liner: *"we're ~60–70%
already there on a live `/en`; the only real risk is on your side, let's name owners and dates."*

---

## Part A, Run of show (~60 min, modular; straight to the proposal, no live-demo opener)

| Min | Segment | Aim |
|---|---|---|
| 0–3 | Intros + goal | Frame the call: sign the demo scope, close six decisions, agree what we need from you. |
| 3–12 | **1. Solution design in a nutshell** | Validate the architecture; land the DA recommendation. |
| 12–25 | **2. PoC-vs-final scope split** | Get "Target tier" signed as the PoC definition of done; walk the M1/M2 split. |
| 25–40 | **3. Close the six decisions** | Our recommendation each; Škoda names owner + date (Part C). |
| 40–55 | **4. What we need from Škoda** | The M1 hard-blocker asks, led by the demo content set + our fallback (Part D). |
| 55–60 | **5. Next steps + owners** | Confirm owners/dates captured; book the weekly check-in. |

---

## Part B, Talking points

### 1. Solution design in a nutshell
- Migrate both **Storyboard** (editorial) and **Media Room** (pressroom) off WordPress onto **Adobe Edge
  Delivery Services**, authored in **Document Authoring / Experience Workspace**. This is **gap-closing +
  assembly, not a build from zero**, ~60–70% already runs live on `/en`.
- How it's built: **buildless blocks** (vanilla JS/CSS, no jQuery/React), **chrome (header/nav/footer) as
  fragments** (one source, locale-resolved), **listings/search = a CSS-selector query-index over
  published HTML** (drives the homepage rails + faceted listings, client-side filter/sort/paginate),
  an **import pipeline** (scrape → parse/transform → DA source-API → preview → publish → reindex), and
  **masters-only media** (ingest ~28.3k logical masters; EDS regenerates responsive `picture`/webp; AEM
  Assets is the DAM).
- The **four backend services with no native EDS equivalent:** media-cart is **IN for M1** (device-ID, no
  login); banner platform and newsletter are **deferred** (newsletter UI-only stub is enough for the PoC);
  analytics is **light** (GA + FB pixel + Yoast baseline); **consent/OneTrust is out of Adobe scope**
  (stays with Škoda).
- **Authoring model (D13): we recommend Document Authoring (DA/EW).** It's what the whole design assumes.
  Universal Editor is the known alternative (field-level editing, closer to the WordPress/Gutenberg feel)
  but it's a different content-source model and would trigger a re-estimation of the template build. Decide
  early; we're holding the E08 template estimates against DA.

### 2. PoC-vs-final scope split
- **Three tiers** (the ask): **Minimum** = proves the model (essentially already met, the guaranteed
  floor); **Target** = the demo you pictured (**this is the line we want you to sign as the PoC definition
  of done**); **Stretch** = Figma-to-AEM, blueprint narrative, press-kit, embargo (opportunistic).
- **What M1 (15 Oct) shows:** Storyboard `/en` home (live, rails auto-populating); story detail pages incl.
  **1–2 hero stories at full fidelity** (in-body galleries + video + Media Box); **Media Room home** (new
  assembly, the single most important new build for demo credibility); **one Model page** (assembled, not
  the full templated CPT); the **Series** template; **full Images + Videos faceted-listing** pages;
  **Press Release detail**; a **working device-ID media-cart** (collect across pages → download from an
  approved AEM-Assets set); **EN + CS**; **1–2 Figma-generated components**; and the three "not-OOTB"
  functions narrated as proof.
- **Deferred to M2 (02 Jan):** the 5 company/Page sub-types (board, annual-reports, logo, media-services
  app, contacts); press-kit detail; model-page template (full CPT), category/tag archive, generic Page
  shell, 404, SiteOrigin-body flatten contract, custom microsite; the governance layer (roles, embargo,
  audit); bulk import + story-flatten at scale.
- **Later (Phase C/D):** media-cart production hardening, hosted search, banners, newsletter/ESP, analytics
  rebuild, QR restricted access; the 6 locales + per-locale index + translation.
- **Effort (planning-level, not a quote):** **63 tickets / 261 SP** total. Pilot (Phase A) 129 SP; Phase B
  71; Phase C 45; Phase D 16. M1 is ~40–66 AI-assisted engineer-days across ~4 senior engineers in a
  ~5.5-week window.

### 3. Honesty lines (say these before they ask, they build trust)
- **Search** is index-only for M1: no full-text body search, fuzzy, or relevance ranking like ElasticPress
  today. Accept reduced recall for the pilot; hosted search is the M2 conversation (D6).
- **Listings don't scale to 33,313 images on a client-side query-index.** M1 proves the listing engine on a
  **representative sample**; production-scale faceting over the full set likely needs hosted search (M2).
- **The media-cart is the #1 M1 risk:** it crosses three non-native boundaries at once, AEM Assets (D5),
  server-side file-size reduction (D2), and CORS delivery. Pulling the full Images/Videos listings into M1
  (D18) made D5+D2 hard M1 blockers. Each has a fallback that keeps the demo whole (Part C).
- **Effort is planning-level, not a quote.**

### 4. The three "not-OOTB" functions (narrate as proof, not risk)
Markus flagged exclude-from-listings, multi-category editorial placement, and manual+tag recommendations
as "not out of the box." **All three are already built and running on `/en`** (dedupe/exclude, category
rails, manual promo + auto tag rails with same-tag fallback). Show them.

---

## Part C, Decision tracker (fill owner + date live)

### The six M1-gating decisions (close these today)
| # | Decision | Our recommendation | Owner (Škoda) | Date |
|---|---|---|---|---|
| **D5** | AEM Assets: does an instance exist by build-start? | Confirm instance + tenancy **now** (procurement/licensing lead time is the #1 schedule threat). Fallback: serve a curated approved set from the pipeline/CDN, cut over later. | | |
| **D2** | Media-cart download approach | Server-side **file-size reduction** (App Builder/edge or AEM Assets renditions). PoC fallback = unpacked multi-download (same as the press-kit ZIP fallback). Prod hardening is M2 (SKODA-902). | | |
| **D1** | CS locale scope for M1 | EN + CS. Full parity not required; **structural proof** (chrome + selector + one story) is acceptable for the demo. | | |
| **D12** | Which of the 15 facets are demo-critical | Scope SKODA-401 to a **demo-critical subset** first; the rest follow. (Facet extraction is a normalization layer, not clean selectors.) | | |
| **D11** | Figma-to-AEM showcase scope | **1–2 components** ("designed in Figma → generated agentically → live"). | | |
| **D13** | Authoring model: DA vs Universal Editor | **Recommend DA/EW.** UE is the alternative but re-estimates the E08 template build. Decide early. | | |

**Plus, name the demo-content owner + confirm the demo date** (content definition, not code, is the real
critical path; the date may slip 1–2 weeks per Martin).

### M2 / program decisions to confirm or assign an owner
| # | Decision | Status / our line | Owner | Date |
|---|---|---|---|---|
| D18 | Page-type M1/M2 split (22-URL analysis) | Resolved 2026-09-14; **confirm it still holds** (it raised D2/D5 to M1-blocking). | | |
| D9 | Content embargo | Approach agreed 2026-09-14 (group-restricted preview + scheduled publish). Group-gate needs SKODA-809 (M2, blocked on D15). Confirm group definitions. | | |
| D15 | Governance / RACI (CMS/AEP/Adobe) | **Live project-setup blocker** (awaiting Martin; business meeting Fri). Blocks roles (809) → embargo (811). | | |
| D16 | NFRs: security review, pentest, licences, RTO/RPO, logging, Azure DevOps | **Top year-end (M2) risk; not started.** Jaroslav to draft the baseline. | | |
| D10 | Analytics + consent | Analytics IN (GA+FB+Yoast baseline); confirm if a bespoke `skoda-analytics` dataLayer is needed. **Consent/OneTrust OUT of Adobe scope.** | | |
| D6 | Search: index-only vs hosted | Index-only for M1; hosted-search decision for M2 (needed for full-scale faceting). | | |
| D7 | Content cutoff | Full migration by M2; intent = decommission WordPress entirely. | | |
| D3 / D4 | Banners / newsletter | Both candidate-defer to M2. Newsletter UI-only stub confirmed sufficient for PoC. | | |
| D17 | QR restricted end-user access | Access model undefined; M2+ investigation (SKODA-906). | | |
| D19 | AI-tool usage reporting (EU AI Act) | **Action on us:** Lars to formally notify Škoda that AI is used in build/migration + share the legal-clearance summary. | | |

### Two open product questions (need an explicit answer)
| Item | Question | Our default |
|---|---|---|
| SKODA-210 | Custom microsites (201 pages, 5.8%): migrate / fold / drop? + cutoff date | Fold live/relevant ones into the generic Page shell (full-width + gallery block); archive expired campaigns. M2. |
| SKODA-808 | Variant/bodywork selector: is the standalone control even wanted? | Source has none (verified). Build the nested variant subsection + Chapters anchor-nav; a standalone selector is net-new, don't build without confirmation. M2. |

---

## Part D, What we need from Škoda (the ask list)

Tagged **[M1]** (needed for 15 Oct) or **[M2]** (needed for go-live), with what it blocks and our fallback.

### Content / assets
- **[M1] Demo content set**, the #1 unblocker, still undefined (Pushkar's side). Blocks the whole content
  chain. **We bring a fallback proposal (below) so we're never blocked, please confirm or swap.**
- **[M1] AEM Assets instance + tenancy** + where the approved images live today (in Assets vs only on the
  current CDN). Blocks the media-cart, the full Images/Videos listings, and the asset pipeline. Fallback:
  curated set from pipeline/CDN.
- **[M1] Permission to down-condition heavy masters** (25–40 MB masters 409 the content bus on publish;
  SKODA-506). Without it, publish fails.
- **[M1] CORS-enabled asset delivery** for the demo set (client-side cart needs CORS URLs; raw S3/CloudFront
  has none). Fallback: per-story pre-zipped bundles.
- **[M2] Rights-clearance ownership** (sits with Škoda; feeds the migration schedule).
- **[M2] WordPress back-end access** for back-end behaviour analysis.

### Access / infra
- **[M1] Named technical counterpart + Lars onboarding (~1 week)**, nothing deep starts without it.
- **[M1] Repo / DA org + deployment environment(s).**
- **[M2] SSO / IDP specs** for author auth (underpins the 7 editorial groups, SKODA-809).
- **[M2] Analytics specs** (GA/FB/Yoast + any bespoke dataLayer taxonomy).
- **[M2] Azure DevOps** for CI/logging/audit (Škoda to implement, D16).
- **[setup] Complete Adobe team list** so Škoda can grant collaboration access. (CDN is resolved = Adobe CDN.)

### Editorial
- **[M1] Locale list + missing-translation fallback** (EN+CS for M1; DE/SK/SR/SL on-demand for M2).
- **[M2] Embargo group definitions** (D9) and **author change-history/audit expectation** (SKODA-812,
  confirmed a firm requirement, validate DA/EW capability).
- **[M2] A live press-kit walkthrough** (conditional-vs-fixed sections, grouped media, FAQ per-kit vs shared).

### Fallback demo-content proposal (concrete, to confirm or swap)
- Storyboard **`/en` home** (already live).
- **1–2 hero stories** restored to full fidelity: **"The Versatile Octavia. Do you know these ones, too?"**
  and **"Škoda Epiq Will Win You Over in Just a Few Seconds"** (both already on the live home).
- **One Model page:** **Epiq** (electric, topical) or Superb.
- **Media Room home** + **one press-release detail**.
- A representative **~200-image approved Images/Videos sample** (Epiq + Superb model galleries + one event
  gallery), served from AEM Assets, to prove the listing + cart at a realistic-but-bounded scale.
- **EN + CS** on the home + one story, with the language selector showing only existing locales.

---

## Part E, Close the call
- [ ] Every M1-gating decision (D5, D2, D1, D12, D11, D13) has an owner + date, or is closed.
- [ ] Demo content set: confirmed (or our fallback accepted) + an owner named.
- [ ] AEM Assets instance: owner + date to confirm existence.
- [ ] Named Škoda counterpart + onboarding start date.
- [ ] D19: Lars to send the AI-usage notification + legal-clearance summary.
- [ ] Weekly check-in booked (the timeline demands it).

## Quick-reference facts (if asked)
- Site = editorial/press newsroom on customized WordPress; ~13,300 editorial URLs (~3,500 EN), ~28,300
  media items. Press releases are ~47.5% of the site (MR side).
- Target = DA / Experience Workspace + EDS (not classic AEM authoring, no Universal Editor unless D13 flips).
- 6 languages, uneven per item; primary pair EN + CS; selector shows only languages an article exists in.
- Dates: demo **15 Oct 2026** (may slip 1–2 wks), go-live **02 Jan 2027**. Backlog: **63 tickets / 261 SP**.
- Estimates are planning-level, not a quote.
