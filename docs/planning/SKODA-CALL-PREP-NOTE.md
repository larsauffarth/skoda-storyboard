# Prep Note — Škoda Storyboard EDS Migration · Initial 30-min Call

**Purpose:** align on **timeline, staffing, and overall approach** for the Škoda Storyboard → AEM Edge Delivery migration. First working call — set direction and extract the decisions that unblock the team.
**Backing detail:** `SKODA-MASTER.md` (findings) · `SKODA-DELIVERY-PLAN.md` (dates/scope).

---

## The one thing to keep front of mind
**Oct 15 demo is mission-critical and politically loaded** — it must show AEM value or the programme (and future VW AEM work) is at risk. Plan for a **smaller, polished, working demo over a broad, broken one.** This call exists to make that date achievable.

---

## 30-minute agenda (suggested)

| Min | Topic |
|---|---|
| 0–3 | Intros + goal of the call (align on the two dates, staffing, approach) |
| 3–10 | **Timeline** — the two fixed dates, what the demo must show, the schedule risk |
| 10–18 | **Staffing** — team shape needed to hit Oct 15; who owns what |
| 18–25 | **Decisions we need from Škoda** (the D-list below) |
| 25–30 | Immediate next steps + who does what before the next call |

---

## 1. Timeline — the two fixed dates

- **Demo — 15 Oct 2026 (~5.5 weeks out).** Must show: front end working · approved **AEM Assets** · **blog posts replicated** · **media-cart replicated** · in **EN + CS**. This is the **blueprint for future VW EDS projects**.
- **Go-live — 02 Jan 2027 (~16 weeks).** Full content migrated · authoring workflows running · live in EDS.

**What to say plainly:** the demo scope is **larger than a typical pilot** — it includes the media-cart and the hardest content type (blog posts, which use a visual page-builder we must "flatten"). It's **achievable but tight**; success depends on **starting now** and **running parallel workstreams**. Rough sizing: **~42–70 AI-assisted engineer-days** of work compressed into 5.5 weeks.

**Two things that de-risk it (good news to share):**
- Media-cart is **device-ID based, no login** — much simpler than an account system.
- DAM is settled (**AEM Assets**), and video stays **Vimeo/YouTube embeds** — no video pipeline to build.

---

## 2. Staffing — AI-led, human-steered

**Model:** the **AI does the bulk of the build** — blocks, chrome, the story/Page-Builder flatten parser, listings/search, media handling, embeds, content import, and the test/lint loops. That's most of the *code volume* and where the ~40–50% effort compression comes from. So this is **not a 5-dev team** — it's **the AI building in parallel, with a small number of humans steering, integrating, verifying, and owning the date.**

**What the AI covers (little-to-no dev time):** block JS/CSS from the design; parsers/transformers + bulk DA source-API import; the Page-Builder flatten; query-index + listing/search; media ingest + media-cart logic; embeds; QA/lint iterations.

**What still needs humans (can't be AI-only):**

| Role | Effort | Why a human is required |
|---|---|---|
| **1 lead EDS engineer** (owns delivery) | ~Full-time for the 5.5 weeks | Owns the mission-critical Oct 15 outcome; steers/reviews AI output; does the **browser-based QA & sign-off** (a11y, modal focus, layout-shift, "is this good enough to show" — the AI's biggest gap, ~a dozen items currently unverified); handles infra/integration (AEM Assets, OneTrust, media-cart zip service) and credentials the AI can't hold. |
| **Figma / design input** | Part-time | Provides the design system + judges the Figma-to-AEM showcase output; taste calls on "impressive demo." |
| **Škoda technical counterpart** | Part-time (their side) | Provisions & operates access (DA/EW org, AEM Assets, Škoda IDP, GTM/dataLayer spec, repo); picks demo content; unblocks fast. |

**Realistic minimum:** **1 experienced EDS engineer + part-time design + a Škoda counterpart** — with the AI doing the parallel build underneath. Not zero humans.

**Why not human-zero (be candid if asked):** the risk isn't that the code won't get written — it's that on a **politically mission-critical date**, *no one owns the outcome*, *nothing gets browser-verified* (the AI ran this whole analysis with no browser — hence ~a dozen unconfirmed runtime/a11y items), and *the integrations & credentials stall*. A human backstop on this date is non-negotiable.

**Ask Škoda for:** a **named technical counterpart**, **AEM Assets access**, **repo/DA-org access**, and the **Škoda IDP / GTM-dataLayer specs** (authoring auth + analytics).

---

## 3. Decisions we need from Škoda (drives the plan)

Bring these; getting answers is the main value of the call:

- **D9 — Content embargoes:** confidential media-room items must stay author-only until a release date. EDS has no native gate → we recommend **staged-publish** (authors preview; scheduled publish goes live). **Confirm this works** — needed for go-live, optional for demo.
- **D10 — Analytics:** is the current bespoke analytics layer actually needed, or is **GA + Facebook pixel + SEO metadata** sufficient? (Affects effort — likely lighter than we first assumed.)
- **D11 — Figma-to-AEM showcase:** which 1–2 components to show as the agentic design-to-code demo?
- **Demo content set:** which specific blog post + listing + assets should the demo feature? (Škoda picks the hero content.)
- **Banners & newsletter:** in or out for go-live? (Both are separate backend services — the banner tool is a bespoke per-market ad platform; worth confirming it's even wanted vs a simpler promo block.)

---

## 4. Risks to raise (briefly, honestly)

- **The 5.5-week window** with expanded demo scope — the #1 risk. Mitigation: start now, parallelize, descope aggressively to "demonstrable."
- **Blog-post flattening** on the critical path — may show reduced-fidelity for the demo, full parser for go-live.
- **Content embargo** has no off-the-shelf EDS answer — decide the approach early, not late.
- A handful of interactive/accessibility behaviors are **unverified without a browser** — a short verification pass is needed before demo sign-off.

---

## 5. Proposed immediate next steps (to close the call)

- [ ] Škoda names a technical counterpart + grants access (AEM Assets, repo/DA, IDP/GTM specs).
- [ ] We stand up the EDS site + repo + AEM Assets integration (week 1).
- [ ] Škoda selects the demo content set (blog post + listing + assets).
- [ ] Answer D9/D10/D11 (or assign owners + a date).
- [ ] Re-tag the delivery backlog to the two milestones and share the week-by-week plan.
- [ ] Book the next check-in (weekly cadence recommended given the timeline).

---

## Quick-reference facts (if asked)

- Site = editorial/press newsroom on customized WordPress; **~13,300 editorial URLs** (~3,500 EN), **~28,300 media items**.
- Target = **DA / Experience Workspace + EDS** (not classic AEM authoring).
- **6 languages**, uneven per-item; primary pair **EN + CS**; selector shows only languages an article exists in.
- No user auth, no personalization, no edge functions today; authors auth via **Škoda IDP**.
- Estimates are **planning-level, not a quote.**
