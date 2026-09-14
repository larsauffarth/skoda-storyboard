# Škoda Storyboard — M1 Demo Target Proposal (15 Oct 2026)

**Status:** Proposed M1 scope — pending client sign-off on the §6 "definition of done." Companion to `SKODA-DELIVERY-PLAN.md` (§2 M1 scope) and `SKODA-CLIENT-REQUIREMENTS-MAPPING.md` (per-ID build status). Built-state claims (§2) verified against the repo on 2026-09-11 (blocks `stories`/`story-rail`/`carousel`/`cards-overlay`/`cards-media`/`hero-image`/`header`/`footer` present; 48 story pages under `content/en/stories/`).
**Date:** 2026-09-11 · **Target:** DA / Experience Workspace + EDS.

*What to aim for at the first milestone (functioning demo), reconciling **what the client expects** against **what we already have running** and **how fast the agentic build has proven to be**.*

> **One-line thesis:** the client's demo bar is largely a *frontend + fidelity + one dynamic feature + blueprint* story, and we are **already ~60–70% of the way there on a live, published `/en`**. The right M1 aim is therefore **not "build the demo"** but **"close four specific gaps + prove two locales + de-risk the client-side dependencies"** — and to deliberately over-deliver on the blueprint narrative, because that is what makes this politically safe.

---

## 1. What the client explicitly expects at the demo (their stated bar)

From the exec briefing + delivery plan (M1 = 15 Oct 2026, ~5.5 wks, may slip 1–2 wks):

| # | Client demo criterion | Nature |
|---|---|---|
| E1 | **Front end functioning** — real pages, real chrome | fidelity |
| E2 | **Blog/story posts replicated** | content + template |
| E3 | **Media-cart replicated** (device-ID, no login, collect → download) | the one dynamic feature |
| E4 | **Approved AEM Assets in use** | DAM integration |
| E5 | **EN + CS** (the primary localized pair) | localization proof |
| E6 | **Figma-to-AEM showcase** — agentic component generation | the "blueprint" flourish |
| E7 | **The VW blueprint** — "this is repeatable for other VW EDS sites" | political / narrative |

Plus the three functions **Markus flagged as "not OOTB"** (exclude-from-listings, multi-category editorial placement, manual+tag recommendations) — which we should demo explicitly because **all three are already built** on `/en`.

---

## 2. What we already have running (published, verified on `/en`)

**This is the leverage.** Live and pixel-matched at 1440px, on EDS+DA, built agentically:

- **Chrome:** header + topbar + mega-menu, dark-green footer (7-col sitemap, 4 social, app-store badges), language switcher shell.
- **Homepage surface:** hero, featured promo (index-driven, mobile carousel), Latest Stories + Load-more, 4 auto-populated tag-filtered rails (eMobility/Lifestyle/Škoda World/Latest News), Models + Series rails, social block.
- **Content:** 48 story pages imported (flattened), live `/en/query-index.json` with title/date/category/image.
- **Engines:** query-index-driven blocks, dedupe/exclude logic, shared memoized index fetch (perf), in-place image optimization (Layout-editability preserved).
- **Import machinery:** parsers/transformers, DA source-API push, publish→reindex flow — **reusable**, not one-off.

**Implication:** E1 (front end), E2 (stories), and the three "not-OOTB" functions are **substantially demo-ready today.** The build velocity that got us here is the argument for a confident M1.

---

## 3. Proposed M1 target — three tiers

### 🟢 Tier 1 — Irreducible core (must show; ~mostly done)
The demo is a *win* if only this works:
1. **Storyboard `/en` homepage** — as-is fidelity, all rails auto-populating (**done**; polish only).
2. **Story detail pages** — the flattened blog posts, real content (**done** for EN slice; extend a few). **Plus 1–2 hero stories restored to full fidelity** (in-body galleries + video embed + Media Box) per D18 (SKODA-604), so the real article experience is shown, not just the flattened slice.
3. **Media Room homepage** — *new assembly* from existing blocks (featured/news/images/videos/models/press-kits/latest-stories rails + lightbox). The single most important **new** build for demo credibility.
4. **One Model page** — *new assembly*; client named "MR home + one Model page" as the extendable subset.
5. **Series template** — the 2-level Series directory → hub, confirmed a real template by the 22-URL analysis (2026-09-14) and pulled into M1 per D18 (SKODA-207); cheap (reuses cards/hero/grid), adds visible demo breadth.
6. **Full Images + Videos faceted-listing pages** — pulled into M1 per D18 (one shared listing engine + per-item gallery-lightbox / Vimeo-embed + media-cart). **These raise D2 (cart download) and D5 (AEM Assets) to hard M1 blockers** (see §5).
7. **The three "not-OOTB" functions shown deliberately** (exclude, multi-category, manual+tag) — **done**, just narrate them.

### 🔵 Tier 2 — Demo differentiators (high value, scoped)
6. **Media-cart (E3)** — device-ID collect + download. Scope to a **happy-path demo**: collect across pages → cart icon persists → download. Depends on **D2** (server-side reduction) + a CORS-reachable asset set.
7. **AEM Assets "in use" (E4)** — a **curated approved set** served from AEM Assets on the demo pages (not the full 28k pipeline). Depends on **D5** (does an instance exist in time?).
8. **CS locale (E5)** — prove EN + CS on at least the homepage + one story + the language selector showing only existing locales. Per-locale index plumbing already locale-extensible.
9. **Listing + search (index-only)** — one faceted listing page (the shared Media Room listing) over a demo-critical facet subset (**D12**). Search stubbed/index-only is acceptable (client confirmed).
10. **Figma-to-AEM showcase (E6)** — **1–2 components** (D11), shown as "designed in Figma → generated agentically → live."

### 🟣 Tier 3 — Blueprint narrative (cheap, high political payoff)
11. A **short "how this was built" story**: the reusable import pipeline, query-index pattern, dynamic-rail-via-buildBlock, media pre-conditioning, agentic handoff candidates (per `SKODA-AGENT-HANDOFF-CANDIDATES.md`) — positioned as **the repeatable VW EDS method.** This is what converts "a demo" into "a blueprint."

---

## 4. Gap analysis — what stands between us and the target

| Gap | Tier | Effort read | Blocker |
|---|---|---|---|
| Media Room homepage assembly | 1 | Low — reuse built blocks | none (needs source walkthrough for exact rails) |
| One Model page assembly | 1 | Low — reuse rails + hero | retrieval rules 🟡 |
| **Series template (directory + hub)** — 22-URL, D18 | 1 | **Low** — reuses cards/hero/grid (SKODA-207) | ordering/source of series 🟡 |
| **Full Images + Videos listing pages** — 22-URL, D18 | 1 | **Med–High** — needs gallery-lightbox + Vimeo embed + per-item cart | **D2 (cart) + D5 (AEM Assets) now M1-blocking** |
| **1–2 full-fidelity story pages** — 22-URL, D18 | 1 | **Low** — un-flatten galleries/embed/Media Box on 1–2 stories (SKODA-604) | media pre-conditioning applies |
| Press Release detail page (structurally = story) | 1–2 | Low–Med | no live example reviewed (§11.1) 🟡 |
| Media-cart happy-path | 2 | Med | **D2** approach + CORS asset delivery |
| AEM Assets curated set | 2 | Med | **D5** instance exists in time? (top schedule risk) |
| CS locale slice | 2 | Med | **D1** (CS confirmed for demo) — content/translation input |
| Faceted listing (demo subset) | 2 | Med–High | **D12** facet subset + metadata-normalization |
| Figma showcase (1–2 components) | 2 | Med | **D11** which components |

**Most Tier-1 gaps are unblocked assembly** — with **one change from the 22-URL analysis (D18):** pulling the **full Images/Videos listing pages** into Tier 1 means those two pages now depend on **D2 (cart download) + D5 (AEM Assets)** — i.e. a Tier-1 item now carries a client-side dependency it previously didn't. Series and the full-fidelity stories remain pure assembly. The remaining blocked items are still client-side dependencies (D5/D2/D1/D12/D11), not build problems. **Also surfaced but deliberately deferred to M2:** the 5 "company/Page" sub-types (board-of-management, annual-reports, company-logo, media-services-app, contacts — SKODA-810), kept out of M1 to keep the demo scope clean.

---

## 5. The real risk is client-side, not build-side

Per the delivery plan risk register + discovery agenda, the schedule threats are **things we don't control**:
- **Does an AEM Assets instance exist by demo-build start?** (#1 threat — procurement/licensing lead time).
- **Who picks the demo content set + clears rights, and when?**
- **Demo sign-off owner + Škoda's internal approval turnaround.**
- Demo date itself **may slip 1–2 weeks** (Martin) and **demo content still undefined** (Pushkar).

**Escalation from D18 (2026-09-14):** because the **full Images/Videos listing pages are now Tier 1**, the AEM-Assets (D5) + media-cart (D2) dependencies are no longer only Tier-2 concerns — a Tier-1 demo page now needs a real approved asset set and per-item cart. Start those clocks in Week 1 and keep the same fallback (curated set from pipeline/CDN).

**Mitigation baked into the target:** every Tier-2 item **and the Images/Videos Tier-1 pages** have a **fallback that keeps the demo whole** if the dependency slips —
- No AEM Assets in time → serve the curated approved set from the pipeline/CDN, cut over later (covers the Images/Videos listings too).
- D2 undecided → client-side happy-path cart for the *demo only* (prod reduction is M2/SKODA-902).
- CS content late → prove CS *structurally* (chrome + selector + one page) rather than full parity.

---

## 6. Recommended M1 "definition of done" (the line to sign)

> *"On 15 Oct we show a live EDS Škoda Storyboard: the `/en` homepage + story pages (done today) **including 1–2 full-fidelity stories** (in-body galleries + video + Media Box), a **new Media Room home + one Model page**, the **Series template** (directory → hub), the **full Images + Videos faceted-listing pages**, a **working device-ID media-cart** downloading an **AEM-Assets-served** approved set, **EN+CS** on the homepage with correct language-selector behaviour, **1–2 Figma-generated components**, and a 5-minute **'how this was built as a repeatable VW blueprint'** narrative — with the three 'not-OOTB' functions shown explicitly."*
>
> *(Scope note per D18, 2026-09-14: Series + full Images/Videos listings + full-fidelity stories are pulled into M1; the 5 "company/Page" sub-types — board-of-management, annual-reports, company-logo, media-services-app, contacts — are deferred to M2. The Images/Videos listings make D2/D5 hard M1 blockers.)*

Everything in that sentence is either **done** or **assembly of done parts + one bounded dynamic feature** — which is why the velocity so far makes it realistic.

---

## 7. Suggested sequencing (fits the ~5.5-week window, front-loads dependencies)

- **Wk 1:** lock irreducible core (Section 1 demo call — run `SKODA-DISCOVERY-SESSION-OCT15.md`); **fire the AEM Assets + demo-content + CS-content dependency requests immediately** (owner + date each). Polish `/en`.
- **Wk 2:** assemble Media Room home + Model page from existing blocks; press-release detail page; start Figma showcase component pick (D11).
- **Wk 3:** media-cart happy-path + AEM Assets curated set; CS locale plumbing; one faceted listing (D12 subset).
- **Wk 4:** integrate CS content; Figma component(s) live; import demo content set; consent stub (D10 — consent is out of Adobe scope, so a stub only).
- **Wk 5:** QA (lint/perf/a11y — no visual-fidelity outsourcing), dry-run, blueprint narrative deck.
- **Wk 5.5:** buffer + demo hardening (+ absorb any 1–2-wk slip).

---

## 8. Decisions this proposal needs resolved (drive to owner + date)

| D | Question | Needed by |
|---|---|---|
| D5 | AEM Assets instance exists in time? where are approved images now? | Wk 1 (blocks Tier-2 #7) |
| D2 | Media-cart download approach for the demo (server-side reduction vs client happy-path) | Wk 2 |
| D1 | CS demo scope — full parity vs structural proof | Wk 1 |
| D11 | Which 1–2 Figma components | Wk 2 |
| D12 | Which facet subset is demo-critical | Wk 2 |
| — | Who owns demo sign-off + Škoda approval turnaround | Wk 1 |

---

## Checklist

- [ ] **Confirm the M1 "definition of done" statement (§6)** with the client as the signed irreducible-core scope
- [ ] Run `SKODA-DISCOVERY-SESSION-OCT15.md` to drive D5/D2/D1/D11/D12 + sign-off owner to **owner + date** (Wk 1)
- [ ] Fire client-side dependency requests immediately: AEM Assets tenancy, demo content set, CS content, rights clearance
- [ ] **Polish the built `/en`** homepage + story pages to demo-grade (Tier 1 #1–2)
- [ ] Assemble **Media Room homepage** from existing blocks (Tier 1 #3) — confirm exact rails vs source
- [ ] Assemble **one Model page** (Tier 1 #4) — confirm tag-driven retrieval rules
- [ ] Assemble the **Series template** (directory → hub, Tier 1 #5, SKODA-207) — confirm series ordering/source
- [ ] Build the **full Images + Videos faceted-listing pages** (Tier 1 #6, SKODA-203/204/402/505) — depends on D2/D5
- [ ] **Restore 1–2 full-fidelity stories** (galleries + embed + Media Box, SKODA-604)
- [ ] Build **Press Release detail** page (request a live example first, §11.1)
- [ ] Demo-script the **three "not-OOTB" functions** (exclude / multi-category / manual+tag) — already built
- [ ] **Media-cart happy-path** (device-ID collect → download) per D2 fallback (Tier 2 #6)
- [ ] Serve a **curated AEM Assets set** on demo pages, with pipeline fallback if D5 slips (Tier 2 #7)
- [ ] **EN + CS** on homepage + one story + language-selector-shows-only-existing (Tier 2 #8)
- [ ] **One faceted listing** over the D12 demo subset (Tier 2 #9)
- [ ] **1–2 Figma-to-AEM** components generated + live (Tier 2 #10, per D11)
- [ ] Consent **stub** only (D10 — OneTrust out of Adobe delivery scope)
- [ ] QA: lint + Lighthouse/RUM + rule-based a11y — **no outsourced visual-fidelity judgment**
- [ ] Prepare the **"repeatable VW blueprint" narrative** (Tier 3 #11), tying in the agent-handoff-candidates method
- [ ] Rehearse a **5-minute happy-path demo** (desktop, cache-clean) + a fallback screen-recording
- [ ] Maintain each Tier-2 item's **fallback** so a slipped dependency never breaks the whole demo

---

## 9. Cross-references

- `SKODA-DELIVERY-PLAN.md` §2 (M1 demo scope), §6 (risks), §8 (decision log D1–D18).
- `SKODA-CLIENT-REQUIREMENTS-MAPPING.md` — per-ID build status behind the tiers here.
- `SKODA-AGENT-HANDOFF-CANDIDATES.md` — the blueprint/method narrative (Tier 3).
- `SKODA-DISCOVERY-SESSION-OCT15.md` — the Wk-1 agenda that resolves the §8 decisions.
- `SKODA-MASTER.md` — canonical findings.

> **Note on execution status:** this document is the M1 *scope proposal*. Its checklist mixes client-facing actions (discovery call, dependency requests, sign-off) and build work that is **gated on the Wk-1 scope-lock + decisions D5/D2/D1/D11/D12** — per §7, those clocks start before further build. No build items are actioned by persisting this doc.
