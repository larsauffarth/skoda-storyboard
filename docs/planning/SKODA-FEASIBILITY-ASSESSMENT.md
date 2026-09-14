# Škoda Storyboard → EDS — Feasibility Assessment (Oct 15 Demo + Year-End Go-Live)

*Lars's action item from the 2026-09-10 alignment call: review requirements and return an assessment of what is realistically deliverable **by 15 Oct** and **by year-end**, with the required system accesses and dependencies. Separates what we control (the build — largely green) from what we don't (client-gated governance, NFRs, access, decisions).*

**Date:** 2026-09-10 · **Status:** draft for the Monday walkthrough · **Feeds:** `SKODA-DELIVERY-PLAN.md` §8, `SKODA-DISCOVERY-SESSION-OCT15.md`.
**Basis:** shipped `/en` slice (build-confirmed), the alignment-call readout, and the prior `SKODA-*` analysis docs. Planning-level, not a quote.

---

## 0. One-line assessment

**The 15 Oct demo is achievable** — much of the front end is already built agentically and running. **The binding constraints are client-side, not technical:** system/onboarding access (~1 week for Lars), an undefined demo-content set, the authoring-model decision (DA vs UE), and — for year-end — the NFR/security/governance track that **has not started**. Per the call, the demo date may slip **1–2 weeks**; year-end go-live is **at risk** on those non-build dependencies, not on the build.

---

## 1. What's already built (green — we control this)

Running on `main--skoda-storyboard--larsauffarth.aem.live/en`, built with the modernisation agent + follow-up polish:

- Front end: header/nav, featured promo, carousels, footer — pixel-matched at 1440px, mobile perf pass (LCP/CLS/fetch fixes shipped).
- **Auto-populated, tag-filtered story rails** (eMobility / Lifestyle / Škoda World / Latest News) from a published query-index.
- **Latest Stories + Load more**, newest-first, de-duplicated against the featured promo.
- Story/blog pages imported + flattened (reduced-fidelity), category-tagged.

**Directly answers three functions Markus flagged as "not out of the box":**
| Škoda-flagged concern | Already built as |
|---|---|
| Selectively exclude assets/articles from listings | featured + Latest Stories **dedupe/exclude** logic |
| Articles in multiple categories with editorial placement | **category tagging + tag-filtered rails** |
| Manual recommendations combined with tag-based | static promo **+** auto-populated rails, same page |

→ **Demo these Monday** — they convert flagged risks into proof.

---

## 2. Oct 15 demo — feasible slice vs open scope

**Feasible with what we control (confirm as the irreducible core):**
- Front end + nav + blocks (done)
- Blog/story pages replicated (done, reduced-fidelity)
- Auto-listings + the three "not-OOTB" behaviours (done)
- Index-based search/filtered listings (buildable)
- EN + CS structure (EN live; CS adds volume, not complexity)

**Open scope calls that gate the demo (need Škoda decision — Segment 1 of the discovery agenda):**
- **Demo content set** — still undefined (Pushkar). **#1 thing to close** — blocks the content chain.
- **Media-cart depth** — reframed: purpose is **file-size reduction** (reduced renditions), so it's a **server-side** feature; demo path = AEM Assets/Dynamic Media renditions bundled by a thin Adobe App Builder action, with per-story pre-baked reduced bundles as fallback. Confirm minimum "replicated" = collect → download-reduced-bundle.
- **AEM Assets** — does an instance exist in time, and are approved images in it? (procurement lead time = top schedule threat)
- **Figma-to-AEM showcase** — which 1–2 components (D11)
- **Authoring model DA vs UE (D13)** — if a demo must *show authoring*, this must be decided now; if the demo is delivery-only, it can trail slightly.
- Consent = **out of scope** (Škoda keeps OneTrust); analytics = in (standard).

**Out of the demo (→ year-end):** full content archive, DE/SK/SR/SL, embargoes, banners/newsletter, full authoring rollout + IDP, NFR/security controls.

---

## 3. Year-end go-live — realistic? Conditional.

**The build is automatable and on track.** The risk is entirely the **non-build track**, which per Jaroslav **has not started**:

| Year-end risk (client-gated) | Owner | Why it threatens the date |
|---|---|---|
| Business-process analysis not started | Škoda/Markus | Requirements may expand scope late |
| NFRs: security-code review, pentest, licence checks, RTO/RPO, logging/auditing (D16) | Jaroslav (draft) → Škoda Auto governance | Formal approval path is slow + not yet in place |
| Governance/RACI across CMS / AEP / Adobe teams (D15) | Škoda + Adobe | Undefined responsibilities stall execution |
| Authoring model + author onboarding (D13) | Škoda + Adobe | Determines the whole authoring build |
| Full asset migration into AEM Assets (~40 MB originals, S3→DAM) | Škoda + Adobe | Volume + rights clearance + conditioning (SKODA-506) |
| Access provisioning + Lars onboarding (~1 wk) | Škoda (Martin/PM) | Nothing deep starts until access lands |

**Assessment:** front-end + content migration for year-end is feasible **if** access, authoring-model, and the demo-content decisions land in the next ~2 weeks. **The NFR/security/governance track is the credible threat to 2 Jan** — recommend Škoda start Jaroslav's NFR draft and the governance model now, in parallel, not after the demo.

---

## 4. Build vs client-gated — the honest split

- **We control (green):** blocks, listings, importer/flatten, media pre-conditioning, index config, perf. Largely done or well-understood.
- **We don't control (the real risk):** access/onboarding, demo-content selection, AEM Assets instance, authoring-model decision, NFR/security/pentest/licensing, governance/RACI, decision/approval latency.

> On a fixed date, the killer is never the build. Every red item above is client-side. This assessment exists to make them visible with owners + dates.

---

## 5. Required systems & access (Lars's action item)

Provisioned via the PM's consolidated team list; interim doc-exchange via the SharePoint folder while onboarding completes (~1 week).

| # | Access / system | Needed for | Owner (Škoda) | Status |
|---|---|---|---|---|
| 1 | Škoda systems onboarding for Lars (~1 wk) | Everything downstream | Martin / PM | pending |
| 2 | Confluence requirements export + walkthrough recordings | Requirements review before Monday | Jaroslav / Markus | committed (SharePoint) |
| 3 | WordPress back-end access | Back-end behaviour analysis (Markus's team lacks it too) | Škoda | not yet available |
| 4 | AEM Assets instance + tenancy | Asset migration + media-cart renditions | Škoda / Adobe | instance existence TBC |
| 5 | Deployment environment(s) + repo/DA org | Build + deploy | Adobe/Škoda | to define post-review |
| 6 | Škoda IDP specs | Author auth (go-live) | Škoda | year-end |
| 7 | Analytics specs (GA/FB/Yoast + any dataLayer taxonomy) | Analytics wiring | Škoda | to confirm |
| 8 | Azure DevOps | CI/logging/audit (Škoda to implement) | Škoda Auto | planned |
| 9 | Complete Adobe team member list | Grant Škoda collaboration/system access | Adobe PM | on staffing finalisation |

**CDN:** resolved — **Adobe CDN** (Martin); edge/App Builder functions available in-platform (removes external-provider need).

---

## 6. Recommended immediate moves (our side)

- Work the shared requirements before Monday; map them against the approved Adobe scope (included vs excluded).
- Begin **no-access-required groundwork now**: article/story migration scripts, block polish, media pre-conditioning — while media-asset migration is clarified.
- Bring the **live demo + the three "not-OOTB" proofs** to Monday's walkthrough.
- Table the **authoring-model (D13)** and **demo-content** decisions as the two that most gate progress.
- Feed all call outcomes into `SKODA-DELIVERY-PLAN.md` §8 (done) and drive the rest to owner+date via the discovery agenda.

---

## 7. Cross-references
- `SKODA-DELIVERY-PLAN.md` §8 — open decisions D1–D19 (call outcomes folded in).
- `SKODA-DISCOVERY-SESSION-OCT15.md` — agenda to drive open items to owner + date.
- `SKODA-MEDIA-CART-DOWNLOAD.md` — corrected: server-side rendition reduction, client-side zip demoted.
- `SKODA-EDS-DA-ARCHITECTURE.md` — target architecture (assumes DA; revisit under D13).
- `SKODA-EXEC-BRIEFING` — leadership framing of dates/scope/staffing.
