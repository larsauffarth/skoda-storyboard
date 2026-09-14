# Škoda Storyboard → Edge Delivery (DA/Experience Workspace) — Delivery Backlog Overview

**What this is:** the master index for the migration backlog — 10 epics, 51 tickets — grounded in the `SKODA-*` analysis set. Pilot epics (E01–E07) are ticket-level; later phases (E08–E10) are epic + high-level tickets so the whole program is visible.
**Date:** 2026-09-05 (updated 2026-09-07: media-cart re-point — SKODA-505 added to M1, SKODA-902 re-scoped; updated 2026-09-10: build-confirmed — SKODA-506 added, SKODA-401 re-scoped to +3 SP for metadata-normalization, SKODA-801 trending low & browser-confirmed; updated 2026-09-11: Press Kit detail broken out of SKODA-802 into SKODA-805–808 per requirements doc §11; updated 2026-09-14: 22-URL analysis added SKODA-207 (Series→M1), SKODA-604 (full-fidelity story restore→M1), SKODA-810 (company/Page family→M2) per decision D18)
**Target:** DA / Experience Workspace + EDS (no AEM Author / UE / JCR) — per `SKODA-EDS-DA-ARCHITECTURE.md`.
**Estimates:** story points (SP) + AI-assisted / manual day ranges — **planning estimates, not a quote**. "AI-assisted" reflects this environment's import/styling/QA tooling.
**Files:** `skoda/epics/E##-*.md` · `skoda/tickets/SKODA-<id>.md`.

---

## 1. Program Summary

Four phases, mapped from `SKODA-EDS-DA-ARCHITECTURE.md` §12:

| Phase | Epic(s) | Goal |
|---|---|---|
| **A — Capability pilot** | E01–E07 | Stand up the **reusable EN capability** (blocks + chrome + query-index listing + index search + media + import + QA), validated on a press-release article + its listing. **Story/Page-Builder and 3 of the 4 backend services (banners, newsletter, hosted search) are OUT.** The **media cart is IN** (client scope: mission-critical for the 15 Oct demo) — built client-side (device-ID, no login) as SKODA-505. |
| **B — Editorial at scale** | E08 | Story template (SiteOrigin Page-Builder flattening), remaining templates, bulk import, consent/analytics wiring. |
| **C — Dynamic services** | E09 | Media-cart **production hardening**, banner platform, newsletter, hosted search, `skoda-analytics` rebuild — each behind an API boundary. |
| **D — Localization** | E10 | 6 locales, per-locale query-index, EW Translation, language-negotiated routing. |

**Pilot = capability pilot** (settled). It is *not* a one-page throwaway — it builds the reusable machinery. Effort below prices the capability.

---

## 2. Epic Index

| Epic | Goal | Phase | Tickets | Effort (SP) | AI-days | Manual-days |
|---|---|---|---|--:|--:|--:|
| **E01 Foundation & Setup** | DA/EW site, repo, Code Sync, config, tokens | A | 6 | 15 | 5–9 | 12–20 |
| **E02 Core Blocks** | teaser/cards, hero, gallery+lightbox, embeds, tags, Škodapedia glossary, Series template | A | 7 | 24 | 9.5–15 | 21–32 |
| **E03 Chrome Fragments** | header/mega-menu, mobile ARIA, lang switcher, footer | A | 4 | 12 | 5.5–8 | 8–14 |
| **E04 Listings & Search** | query-index (15 facets) + metadata-normalization, listing/load-more, search | A | 3 | 19 | 7–12 | 13–21 |
| **E05 Media Pipeline** | masters-only ingest, downloads block, PDF/MP4, **AEM Assets mapping**, **demo cart + client-side zip**, **media pre-conditioning** | A | 6 | 21 | 7–13 | 14–23 |
| **E06 Import Pilot Content** | parsers/transformers, DA push, pilot pages, full-fidelity story restore | A | 4 | 13 | 4.5–8 | 9–14 |
| **E07 QA / Perf / A11y / Launch** | lint, Lighthouse/RUM, a11y, visual QA, sign-off | A | 4 | 11 | 4–7 | 7–12 |
| **E08 Editorial at Scale** | story flatten, remaining templates, **press-kit template (805–808)**, **company/Page family (810)**, bulk import | B | 9 | 49 | 19–31 | 37–62 |
| **E09 Dynamic Services** | media-cart **prod hardening**, banners, newsletter, hosted search, analytics | C | 5 | 40 | 15–25 | 30–54 |
| **E10 Localization** | 6 locales, per-locale index, translation, routing | D | 3 | 16 | 6–10 | 10–15+ |
| **Total** | | | **51** | **220** | **83–137** | **161–267** |

*(SP roll-ups are indicative; day ranges are the sum of per-ticket planning ranges — treat as order-of-magnitude, not a commitment.)*

---

## 3. Full Ticket Register

**Phase A — Pilot (all Pilot: Yes)**

| ID | Title | Epic | SP | AI-d | Man-d | Deps | Risk |
|---|---|---|--:|--:|--:|---|---|
| SKODA-101 | DA/EW site + repo + Code Sync | E01 | 3 | 1–2 | 2–4 | — | 🟢 |
| SKODA-102 | Boilerplate scaffold | E01 | 3 | 1–2 | 3–5 | 101 | 🟢 |
| SKODA-103 | Config sheets (placeholders/metadata/redirects) | E01 | 2 | 0.5–1 | 1–2 | 102 | 🟢 |
| SKODA-104 | helix-query.yaml skeleton (per-locale) | E01 | 3 | 1–2 | 2–3 | 102 | 🟡 index critical path |
| SKODA-105 | Sidekick v7 + preview/publish | E01 | 1 | 0.5 | 1 | 101 | 🟢 |
| SKODA-106 | Design tokens + global CSS (re-derived) | E01 | 3 | 1–2 | 3–5 | 102 | 🟢 |
| SKODA-201 | Cards/Teaser (overlay/media/toolbar) | E02 | 5 | 2–3 | 5–7 | 102,106 | 🟢 |
| SKODA-202 | Hero (image, LCP) | E02 | 2 | 1 | 2–3 | 102,106 | 🟢 |
| SKODA-203 | Gallery + lightbox modal | E02 | 5 | 2–3 | 4–6 | 102,106 | 🟡 a11y modal `[RUNTIME-UNCONFIRMED]` |
| SKODA-204 | Embeds (4 providers, dnt=1, lazy) | E02 | 3 | 1–2 | 2–4 | 102 | 🟢 |
| SKODA-205 | Tags / metadata | E02 | 1 | 0.5 | 1 | 102 | 🟢 |
| SKODA-206 | Škodapedia glossary block (directory + A–Z filter + modal) | E02 | 5 | 2–3 | 4–6 | 102,106 | 🟡 modal a11y `[RUNTIME-UNCONFIRMED]` |
| SKODA-207 | Series template (2-level: directory + hub) | E02 | 3 | 1–2 | 2–4 | 201,202,402,601 | 🟢 M1 (D18); reuses cards/hero/grid |
| SKODA-301 | Header + mega-menu (3 panels) | E03 | 5 | 2–3 | 4–6 | 102,106 | 🟡 |
| SKODA-302 | Mobile nav toggle + ARIA (a11y fix) | E03 | 2 | 1 | 1–2 | 301 | 🟡 fixes source gap |
| SKODA-303 | Language switcher (6 locales) | E03 | 2 | 1 | 1–2 | 301 | 🟢 |
| SKODA-304 | Footer fragment | E03 | 3 | 1–2 | 2–4 | 102,106 | 🟢 |
| SKODA-401 | Query-index schema + selectors + metadata-normalization (15 facets) | E04 | 8 | 3–5 | 5–8 | 104 | 🟠 build-confirmed: admin-service `query.yaml` (not repo); fields need normalization layer, not clean selectors |
| SKODA-402 | Faceted listing + load-more (deep-link) | E04 | 8 | 3–5 | 6–9 | 401,201 | 🟠 hardest pilot block |
| SKODA-403 | Search block (index-only) | E04 | 3 | 1–2 | 2–4 | 401 | 🟡 body-search deferred |
| SKODA-501 | Masters-only image ingest (img-out-of-`<p>`, alt/caption) | E05 | 3 | 1–2 | 2–3 | 102 | 🟢 |
| SKODA-502 | Static Downloads block (mediabox) | E05 | 3 | 1–2 | 2–3 | 102 | 🟢 |
| SKODA-503 | PDF/MP4 handling (link/DAM) | E05 | 2 | 0.5–1 | 1–2 | 501 | 🟡 MP4 signed-flow (cart now SKODA-505) |
| SKODA-504 | Map S3 images → AEM Assets (manifest) | E05 | 3 | 1–2 | 2–3 | 501,601 | 🟠 A/B unconfirmed; M2 scale = rights+dedup |
| SKODA-505 | Demo media-cart + client-side zip (device-ID, no login) | E05 | 8 | 3–5 | 6–10 | 502,501,504,601 | 🟠 mission-critical demo; CORS/AEM-Assets linchpin |
| SKODA-506 | Media pre-conditioning: strip/replace oversized masters before publish | E05 | 2 | 0.5–1 | 1–2 | 501 | 🟠 build-confirmed: 25–40 MB masters 409 the content bus; gates publish |
| SKODA-601 | Import infra: parsers + transformers | E06 | 5 | 2–3 | 4–6 | 102 | 🟡 content-driven only |
| SKODA-602 | DA source-API push + bulk-op publish | E06 | 3 | 1–2 | 2–3 | 601 | 🟢 |
| SKODA-603 | Pilot page set imported + validated | E06 | 3 | 1–2 | 2–3 | 601,602,201,202,203,204,205,501,502 | 🟡 fan-in |
| SKODA-604 | Full-fidelity restore on 1–2 hero demo stories | E06 | 2 | 0.5–1 | 1–2 | 203,204,502,505,601,602,801 | 🟢 M1 (D18); bounded un-flatten |
| SKODA-701 | Lint + unit tests | E07 | 2 | 1 | 1–2 | E02,E03,E04 | 🟢 |
| SKODA-702 | Performance (Lighthouse≈100/RUM) | E07 | 3 | 1–2 | 2–3 | 603 | 🟡 |
| SKODA-703 | Accessibility audit | E07 | 3 | 1–2 | 2–4 | 603 | 🟠 several `[RUNTIME-UNCONFIRMED]` |
| SKODA-704 | Visual critique + consent/analytics stubs + sign-off | E07 | 3 | 1–2 | 2–3 | 702,703 | 🟡 |

**Phases B–D (Pilot: No)**

| ID | Title | Epic | Phase | SP | AI-d | Man-d | Deps | Risk |
|---|---|---|---|--:|--:|--:|---|---|
| SKODA-801 | Story template — SiteOrigin Page-Builder flatten | E08 | B | 8 | 3–5 | 6–10 | 601,603 | 🟠 re-pointed (POC+census: small closed widget set) |
| SKODA-802 | Remaining templates (Škodapedia pre-baked, pages) | E08 | B | 5 | 2–3 | 4–7 | 801 | 🟡 (press-kits split to 805–808) |
| SKODA-803 | Bulk import automation (at scale) | E08 | B | 8 | 3–5 | 6–10 | 602,801 | 🟠 scale |
| SKODA-804 | Consent + analytics wiring (OneTrust, GTM, skoda-analytics) | E08 | B | 5 | 2–3 | 4–6 | 603 | 🟠 consent OUT of Adobe scope (D10) |
| SKODA-805 | Press Kit template + structured narrative sections | E08 | B | 5 | 2–3 | 4–6 | 801,202,402 | 🟡 fixed-vs-conditional sections (§11.8) |
| SKODA-806 | Press Kit grouped media/download areas + whole-kit ZIP | E08 | B | 5 | 2–3 | 4–6 | 805,502,505 | 🟠 ZIP = D2 reduction service |
| SKODA-807 | FAQ block (Press Kit) | E08 | B | 2 | 0.5–1 | 1–2 | 805,106 | 🟡 per-kit vs shared pool (§11.10) |
| SKODA-808 | Press Kit variant subsections + selector + categorization | E08 | B | 3 | 1–2 | 2–3 | 805,806,401 | 🟡 selector interaction (§11.7/11.9) |
| SKODA-810 | Company/Page family (board/annual-reports/logo/app/contacts) | E08 | B | 8 | 3–5 | 6–10 | 202,304,502,601,602,803 | 🟢 M2 (D18); 5 net-new blocks |
| SKODA-901 | Hosted body-relevance search (decision-gated) | E09 | C | 8 | 3–5 | 6–10 | 401 | 🟠 |
| SKODA-902 | Media-cart **prod hardening** (serverless zip + signed access + cross-device) | E09 | C | 8 | 3–5 | 6–12 | 505,502 | 🟠 re-scoped (demo cart = SKODA-505) |
| SKODA-903 | Banner ad platform (per-market feed + client) | E09 | C | 8 | 3–5 | 6–12 | 106 | 🔴 bespoke ad server |
| SKODA-904 | Newsletter/subscriber (ESP + consent + opt-in) | E09 | C | 8 | 3–5 | 6–10 | 304 | 🔴 10-route account |
| SKODA-905 | skoda-analytics rebuild (dataLayer + per-block wiring) | E09 | C | 8 | 3–5 | 6–10 | 804,E02,E04 | 🔴 hidden cross-cutting |
| SKODA-1001 | Per-locale trees + per-locale query-index | E10 | D | 5 | 2–3 | 4–6 | 401,603 | 🟡 |
| SKODA-1002 | EW Translation rollout (DE/CS/SK/SR/SL) | E10 | D | 8 | 3–5 | content-ops | 1001 | 🟠 volume |
| SKODA-1003 | Language-negotiated routing + placeholders | E10 | D | 3 | 1–2 | 2–3 | 303,1001 | 🟡 |

---

## 4. Dependency Map & Critical Path

**Foundation gates everything:** `101 → 102 → {103,104,105,106}`.

```
101 ─ 102 ─┬─ 103 (config sheets)
           ├─ 104 ── 401 ──┬─ 402 (listing)  ← needs 201
           │               └─ 403 (search)
           ├─ 105 (sidekick)
           └─ 106 (tokens) ─┬─ 201 ─┐
                            ├─ 202  │
                            ├─ 203  │
                            ├─ 301 ─┼─ 302, 303
                            └─ 304  │
102 ─ 204, 205, 501, 502 ───────────┤
                                    ▼
601 ─ 602 ───────────────────────► 603 (pilot pages; fan-in of all blocks+media+import)
                                    ▼
                              702, 703 ─► 704 (sign-off)
Phase B: 601,603 ─ 801 ─ 802 ; 602,801 ─ 803 ; 603 ─ 804
Phase A media-cart: 502 + (501/504 CORS AEM Assets) ─ 505 (demo cart + client-side zip) ─► 603
Phase C: 401─901 ; 505,502─902 (prod hardening) ; 106─903 ; 304─904 ; 804+E02+E04─905
Phase D: 401,603─1001 ─ 1002 ; 303,1001─1003
```

**Pilot critical path (longest chain):** `101 → 102 → 106 → 201 → 402` (listing depends on both index and cards) **and** `…→ 601 → 602 → 603 → 703 → 704`. The two converge at **603** (pilot page set) — the integration bottleneck. **402 (faceted listing, 8 SP)** and **603 (fan-in)** are the schedule-drivers within the pilot.

---

## 5. Effort Roll-Up

| Scope | SP | AI-assisted days | Manual days |
|---|--:|--:|--:|
| **Pilot (Phase A, E01–E07)** | **94** | **~35–60** | **~71–106** |
| Phase B (E08) | 49 | 19–31 | 37–62 |
| Phase C (E09) | 40 | 15–25 | 30–54 |
| Phase D (E10) | 16 | 6–10 | 10–15+ |
| **Full program** | **215** | **~82–136** | **~158–263** |

- **Pilot ≈ 35–60 AI-assisted engineer-days** (vs ~71–106 manual) — **this ticket-derived total is the canonical pilot figure.** It grew from 81→89 SP when the mission-critical **demo media-cart + client-side zip (SKODA-505, +8 SP)** was pulled into M1 per client scope, then **+5 SP (2026-09-10, build-confirmed)** for **SKODA-506 media pre-conditioning (+2)** and **SKODA-401 metadata-normalization (+3)** — offset by **SKODA-801 trending to the low end** of its 8 SP — then **+5 SP (2026-09-14, D18)** for **SKODA-207 Series template (+3)** and **SKODA-604 full-fidelity story restore (+2)** pulled into M1 from the 22-URL analysis, taking the pilot to **94 SP**. The `SKODA-STORYBOARD-SITE-FACTS.html` deck's earlier ~13–25-day headline covered only the *core build* chunks; this backlog is fuller (explicit foundation + import + QA tickets + the Škodapedia block + the demo cart + pre-conditioning). **The deck should be aligned to this figure** (adversarial-review finding F2).
- **Full program is a multi-month programme** dominated by Phase C (the 4 bespoke services + analytics) and Phase B story-flattening + Phase D content-ops.
- *Planning estimates, not a quote; AI-assisted assumes the migration tooling and experienced engineers steering it.*

---

## 6. Suggested Pilot Sequencing (sprints)

- **Sprint 1 — Foundation:** 101, 102, 105, 106, 103, 104 (unblocks everything; stand up site + tokens + index skeleton).
- **Sprint 2 — Blocks & chrome:** 201, 202, 203, 204, 205, 206, **207** (Series template), 301, 302, 303, 304 (parallelizable once 102/106 land).
- **Sprint 3 — Listings/search + media + import infra:** 401, 402, 403, 501, 502, 503, 504, **505** (demo cart + client-side zip), 601, 602.
- **Sprint 4 — Integrate & harden:** 603 (pilot pages), **604** (full-fidelity restore on 1–2 stories), 701, 702, 703, 704 (QA + sign-off).

---

## 7. Cross-Cutting Concerns

- **Consent + `skoda-analytics` coupling:** every interactive block (cards toolbar, gallery, embeds, listing load-more, downloads) emits analytics events today. Pilot uses **stubs** (SKODA-704); the full **dataLayer rebuild is SKODA-905** (Phase C) — but block tickets should leave hooks so re-wiring is cheap. Consent (OneTrust) gates third-party embeds + analytics; load in the delayed phase.
- **Per-locale from day one:** index (104/401), fragments (301/304), and placeholders are built locale-aware even though the pilot is EN — avoids rework in Phase D.
- **`[RUNTIME-UNCONFIRMED]` follow-ups (need a browser):** gallery/glossary modal focus-trap, mega-menu hover/mobile-drawer behavior, real LCP/CLS, embed lazy timing, contrast. Concentrated in SKODA-203, 302, 702, 703.
- **Import discipline:** content-driven detection only (no URL/template coupling); DA push via `admin.da.live` source API with injected credentials (never a pasted token).

---

## 8. Open Decisions Gating Work (D1–D8 → tickets)

| Decision | Blocks | Note |
|---|---|---|
| **D1 Language scope** (EN vs 6) | E10 (1001–1003) | Pilot is EN; full rollout waits on this |
| **D2 Media-cart** (demo + prod approach) | SKODA-505, SKODA-902 | **Cart is IN for the 15 Oct demo** (device-ID, no login) — built client-side in SKODA-505; static downloads (502) also ship. Open: CORS-enabled AEM Assets delivery for the demo set; reuse-legacy-vs-rebuild + serverless zip for prod (SKODA-902). See `SKODA-MEDIA-CART-DOWNLOAD.md`. |
| **D3 Banners** keep/rebuild/drop | SKODA-903 | Bespoke ad server; challenge scope |
| **D4 Newsletter** service | SKODA-904 | 10-route ESP account; pilot stubs |
| **D5 Media/DAM ownership** | SKODA-501, 503, 902 | Where masters + binaries live |
| **D6 Search** index-only vs hosted | SKODA-901 | Pilot = index-only (403) |
| **D7 Content cutoff** (archive scope) | SKODA-803 | Affects bulk-import volume |
| **D8 Scope check** (commerce ruled out; owners for Škodapedia/press-kits) | SKODA-802 | Commerce sub-question CLOSED |

> **Drive these to owner + date live:** `SKODA-DISCOVERY-SESSION-OCT15.md` is the 60-minute discovery agenda that resolves the open decisions above plus the client-side access/data/environment risks. Run it before demo-build start.

> **Client requirements traceability:** `../SKODA-CLIENT-REQUIREMENTS-MAPPING.md` maps every ID in the client's `CMS-MediaRoomMigration-Requirements-*.pdf` (COM/STO/MR/MIG) to a built/solvable/open status **and to the SKODA-* tickets in this register** — use it as the two-way requirement↔ticket index. It also surfaces new decision **D17** (QR-code restricted end-user article access) and flags the §11 Press-Kit detail as candidate E08 tickets.

---

## 9. Doc Traceability

| Epic | Primary source `SKODA-*` doc(s) |
|---|---|
| E01 Foundation | `-EDS-DA-ARCHITECTURE` (§2, §6) |
| E02 Core Blocks | `-EN-BLOCK-INVENTORY`, `-BLOCK-IMPLEMENTATION-REVIEW`, `-SYSTEM-BUILD-SPECS` (§6) |
| E03 Chrome | `-HEADER-FOOTER-ANALYSIS` |
| E04 Listings/Search | `-SYSTEM-BUILD-SPECS` (§2), `-EDS-DA-ARCHITECTURE` (§6), `-DRILLDOWN` (§1) |
| E05 Media | `-MEDIA-DEEP-DIVE`, `-MEDIA-INTEGRATION-REVIEW`, `-SYSTEM-BUILD-SPECS` (§3) |
| E06 Import | `-EDS-DA-ARCHITECTURE` (§10) |
| E07 QA | `-BLOCK-IMPLEMENTATION-REVIEW`, `-ADVERSARIAL-REVIEW-2` (a11y/RUNTIME items) |
| E08 Editorial scale | `-ADVERSARIAL-REVIEW` (Page Builder), `-EN-BLOCK-INVENTORY` |
| E09 Dynamic services | `-COMPLEX-SYSTEMS-DEEP-DIVE`, `-SYSTEM-BUILD-SPECS` |
| E10 Localization | `-EDS-DA-ARCHITECTURE` (§9), `-DRILLDOWN` (§2) |

---

## 10. Notes & Corrections Baked In

- **15 taxonomy facets** (not 14) — SKODA-401.
- **Škodapedia glossary:** the **block** (directory + A–Z/category filter + term modal) is a **pilot** ticket (**SKODA-206**, E02); the **bulk term-content pre-bake** as `/modals/` docs (→ fully static, no runtime API) is **SKODA-802** (Phase B). Directory + filter are client-side static; term detail is a thin fetch, eliminated by pre-baking.
- **Media footprint** figures are **order-of-magnitude** (variable derivative multiplier).
- **Banner platform** is a **bespoke per-market ad server** (SKODA-903), not a content block.
- **`skoda-analytics`** is a **hidden cross-cutting dependency** (SKODA-905).
- **Header/footer** simpler than feared (E03) — mega-menu = plain nested lists; mobile nav needs an ARIA fix (SKODA-302).
- **Pilot = capability pilot** (not one page); story/Page-Builder + 3 backend services (banners/newsletter/hosted-search) deferred to B/C. **Exception:** the **media cart is IN for M1** (client scope, mission-critical demo) — **SKODA-505** (device-ID, no login, client-side zip); **SKODA-902 re-scoped** to production hardening (serverless zip endpoint / signed access / cross-device). Demo cart hinges on **CORS-enabled AEM Assets delivery** (501/504). See `SKODA-MEDIA-CART-DOWNLOAD.md`.
- All estimates are **planning-level, not a quote**. Analysis/planning artifacts only — no code, import, or Git performed.
