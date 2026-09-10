# Škoda Storyboard — 1-Hour Discovery Session (Oct 15 Demo Alignment)

*Purpose: run a focused 60-minute session with Škoda's sponsor + technical + PM attendees that nails down two things — **(1) the irreducible "winning demo" core** for 15 Oct, and **(2) the client-side dependencies that can kill a fixed-date, 6-week build** (data, access, environments, decision latency). Aggregates every open question from the discovery/architecture/delivery docs + build-confirmed findings, grouped and ordered into an agenda.*

**Date:** 2026-09-10 · **Feeds:** `SKODA-DELIVERY-PLAN.md` §8 (Open Decisions), `SKODA-EXEC-BRIEFING`. · **Basis:** initial Škoda discovery doc + `SKODA-EDS-DA-ARCHITECTURE.md` §9/§13 + build-confirmed findings from the shipped `/en` slice.

---

## Session goal (state this in the invite + first slide)

> "By the end of this hour we will have written down: **(a)** the exact, minimal set the 15 Oct demo must show to count as a win, and **(b)** everything on Škoda's side we depend on — with a named owner and a date for each. The build is not the risk; the risk is what we can't control."

Two decisions must leave the room **with an owner + date**, not "we'll circle back."

---

## Recommendation: open with a 5-minute live demo

**Yes — showcase, but briefly and strategically, at the very top.** There is already a pixel-matched, published `/en` homepage on EDS with working nav, featured promo, auto-populated tag-filtered rails, Latest Stories + Load more, carousels, and a mobile perf pass. Opening with 5 minutes of "here's what already runs, built agentically" does three things for a politically sensitive, previously-burned client (they scrapped the 2025 AppsFactory headless attempt and were unhappy with early EMA):

1. Establishes credibility immediately — this is real, not slideware.
2. Makes the "irreducible core" conversation **concrete** — they react to a live artifact, not an abstraction.
3. Shifts the tone from "can Adobe do it?" to "what exactly do we finish by Oct 15?" — which is the meeting's real job.

Keep it to 5 min, desktop only, no deep-dives. Do **not** let it become a feature tour that eats the hour.

---

## Attendee-aware framing

| Audience | What they need from this hour | Where to aim it |
|---|---|---|
| **Sponsor** (political owner) | Confidence the date is achievable + clarity on the minimal win | Segments 1–2 (demo + irreducible core) |
| **Technical** | Access, environments, the media-cart approach, data signals | Segments 3–4 |
| **PM(s)** | Who owns each dependency + decision, and by when | Segment 5 (owners/dates) — this is their deliverable |

---

## The 60-minute agenda

### 0 · Live demo + framing — 5 min
- Show the live `/en` page (desktop). "Built with the modernization agent; this is where we are."
- State the session goal (above). Set the rule: every open item gets an **owner + date**.

### 1 · Define the "winning demo" — the irreducible core — 12 min
Drive to a single agreed **must-show** list vs **nice-to-have**. Anchor on the client's own stated demo criteria (front end functioning · approved AEM Assets in use · blog posts replicated · media-cart replicated · EN+CS · Figma-to-AEM showcase). For each, force a **core / stretch / cut** call:

- Front end + core blocks + nav — **core** (done)
- Blog/story pages replicated — **core**
- Search + filtered listings — core or stretch?
- **Media-cart (collect → zip download)** — client says mission-critical; confirm it's truly in the irreducible set vs a scripted happy-path
- **AEM Assets integration** — "approved assets in use" — how much is enough for the demo? (one curated set vs full pipeline)
- **Figma-to-AEM showcase** — which **1–2 components**? (open decision D11)
- Consent (OneTrust) + GA/FB pixel — **in demo or deferred to go-live?** (scope undefined)
- EN **+ CS** both, or EN-only on stage with CS proven structurally?

Output: a one-line "if we show only this, Škoda is impressed" statement everyone signs.

### 2 · The killer dependencies — data, access, environments, decisions — 20 min *(the heart of the meeting)*
Frame: "On a fixed 6-week date, a 2-week slip on any of these alone misses Oct 15. We need owners + dates today." Walk the grouped register below (Groups B, C, E), fastest-to-block first:

- **AEM Assets — does an instance even exist?** Own Škoda instance vs shared VW/group vs none-in-time. Procurement/licensing lead time is the #1 schedule threat. *(If none in time: agree the demo fallback — serve approved images from the pipeline, cut over later.)*
- **AEM Assets — where are the approved images now?** Already in Assets, or only on the current CDN? Sets the asset-mapping approach.
- **Media weight (build-confirmed):** source masters are 25–40 MB and reject on publish (content-bus 409); confirm we may down-size/condition them for the demo.
- **The demo content set** — who chooses the pilot articles, and by when? (blocks the whole content chain)
- **Access grants** — named technical counterpart; repo/DA org; AEM Assets tenancy; IDP specs (author auth); analytics specs. Each needs an owner + date.
- **Decision latency** — who is the single person who signs off "this demo passes"? What is Škoda's internal approval path and its turnaround time?

### 3 · The one hard technical piece — media-cart zip — 6 min
- Confirm device-ID, no login (matches our understanding).
- Agree the demo approach: **client-side zip in the browser** is the low-risk demo path (no serverless dependency); App Builder / CDN worker is the go-live hardening decision. Get technical buy-in so it's not re-litigated later.

### 4 · Content, localization & taxonomy signals — 8 min
- **Localization/demo scope:** EN+CS for demo confirmed; DE/SK/SR/SL on-demand later.
- **Language-hiding logic (already surfaced):** the selector must show only languages an article actually exists in — confirm the rule + where the "available languages" signal comes from (metadata/hreflang).
- **Taxonomy/nav-by-tag:** which of the **15 facets** are demo-critical for listings vs deferrable? (build-confirmed the metadata isn't cleanly in the markup — it's a normalization effort, so scoping matters).
- **Content cutoff:** full archive at go-live vs from-a-date-forward.

### 5 · Go-live flags (park detail) + owners/dates wrap — 9 min
- Quick flag only (decide later, but name owners): **embargoes** (staged-publish recommendation), **banners** in/out, **newsletter** in/out, **authoring workflows + IDP**, **CDN choice**, **analytics: GA+FB+Yoast sufficient or bespoke layer?**
- **Close:** read back the irreducible-core statement + the dependency register with every owner + date. Confirm the next checkpoint.

---

## Aggregated open questions, grouped (the master list behind the agenda)

**A — Demo definition ("winning" core)**
- Irreducible must-show set vs nice-to-have
- Figma-to-AEM: which 1–2 components (D11)
- Consent + analytics: in demo or go-live? (scope undefined)
- Search/listings: core or stretch for the demo

**B — Assets / DAM (highest access risk)**
- Does Škoda have an AEM Assets instance? own vs shared VW vs none (D5 / architecture §9)
- Are approved images in it already, or on the current CDN? (§9)
- Heavy-master conditioning permission (build-confirmed 409 — see delivery plan R-A′, SKODA-506)
- Rights clearance ownership (sits with Škoda → schedule input)

**C — Content / data**
- Who picks the demo content set, and when
- Content scope: full archive vs cutoff date (D7)
- Language-hiding/selector logic + available-language signal (surfaced)
- Which of 15 taxonomy facets are demo-critical (D12 / SKODA-401)

**D — Media-cart (the one dynamic feature)**
- Zip hosting approach: client-side (demo) vs App Builder/CDN worker (go-live) (D2 / architecture §9)

**E — Access / environments / decision latency (their-side)**
- Named technical counterpart
- Repo/DA org, AEM Assets, IDP, analytics access
- Demo sign-off owner + Škoda's internal approval turnaround

**F — Go-live scope (flag now, decide later)**
- Embargoes staged-publish (D9); banners in/out (D3); newsletter in/out (D4)
- Authoring workflows + Škoda IDP; other 4 languages; CDN choice

**G — Analytics / consent**
- GA + FB pixel + Yoast sufficient, or reproduce bespoke tracking layer? (D10)

---

## Live-capture worksheets (fill during the call)

### Worksheet 1 — Irreducible-core grid

| Candidate | Core / Stretch / Cut | Notes |
|---|---|---|
| Front end + blocks + nav | Core (done) | |
| Blog/story pages | | |
| Search + filtered listings | | |
| Media-cart (collect → zip) | | |
| AEM Assets "in use" | | threshold? |
| Figma-to-AEM showcase | | which 1–2 components |
| Consent (OneTrust) + GA/FB | | demo or go-live |
| EN + CS on stage | | |

### Worksheet 2 — Dependency register (the risk surface)

| Dependency | Group | Owner (Škoda) | Date | Fallback if late |
|---|---|---|---|---|
| AEM Assets instance exists? | B | | | serve approved imgs from pipeline |
| Approved images location | B | | | mixed mapping |
| Heavy-master conditioning OK | B | | | down-size at import |
| Demo content set chosen | C | | | we pick a representative set |
| Technical counterpart named | E | | | — (hard blocker) |
| Access: repo/DA/Assets/IDP/analytics | E | | | — (hard blocker) |
| Demo sign-off owner + approval turnaround | E | | | — |

---

## Prep checklist

- [ ] Confirm attendee list + roles (sponsor / technical / PM) and who chairs each segment on our side
- [ ] Rehearse the **5-min live `/en` demo** (desktop, cache-clean, happy path only); have a fallback screen-recording in case of network/redirect issues
- [ ] Prepare the **one-slide "irreducible core" grid** (Worksheet 1) for live editing in Segment 1
- [ ] Prepare the **dependency register** (Worksheet 2) pre-filled from Groups B/C/E, ready to fill owners/dates live
- [ ] Pre-write the **AEM Assets decision tree** (own instance / shared VW / none-in-time → demo fallback) so Segment 2 moves fast
- [ ] Pre-write the **media-cart recommendation** (client-side zip for demo) so it's a confirm, not a debate
- [ ] Draft the **language-hiding rule** as a concrete proposal (selector reads available-locale set from metadata) to validate, not open-endedly discuss
- [ ] List the **exact access grants** we need (repo/DA org, AEM Assets tenancy, IDP specs, analytics specs) as a request checklist to hand the PM
- [ ] Time-box every segment; assign a scribe to capture **owner + date** for each open item
- [ ] Prepare a one-line **"what we need from Škoda by demo-build start"** ask (counterpart, access, content set, decisions) for the wrap
- [ ] Send agenda + goal statement in advance so the sponsor arrives ready to make the scope call

---

## Notes on the two core objectives

- **Irreducible core:** the live artifact already covers front end + blocks + nav + auto-populated rails + Latest Stories. The genuinely *open* demo-scope calls are **media-cart depth, AEM Assets "in use" threshold, Figma showcase components, and consent/analytics in-or-out** — those are what Segment 1 must lock.
- **Underneath risk:** from the build we now know the top uncontrollables are **(1) whether an AEM Assets instance exists in time**, **(2) who provides the demo content set + rights clearance**, and **(3) Škoda's own sign-off latency** — none are build problems, all are client-controlled, and all belong on the register with a date in this call.

---

## Cross-references
- `SKODA-DELIVERY-PLAN.md` §8 (Open Decisions D1–D12) — the decision log this session feeds.
- `SKODA-EDS-DA-ARCHITECTURE.md` §9 (AEM Assets open questions), §13 (risks R-A0/R-A1/R-A6).
- `SKODA-EXEC-BRIEFING` — the leadership framing of dates, scope, and staffing.
- Build-confirmed findings: heavy-master 409 → `SKODA-506`; metadata normalization → `SKODA-401`; index config surface → architecture §6.
