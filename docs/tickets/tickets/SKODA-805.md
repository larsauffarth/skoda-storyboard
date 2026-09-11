# SKODA-805 — Press Kit template + structured narrative sections
- **Epic:** E08 — Editorial at Scale
- **Type:** template / import
- **Phase:** B  ·  **Pilot:** No · **Milestone:** M2 (go-live)
- **Estimate:** 5 SP · AI-assisted 2–3d / manual 4–6d *(planning estimate, not a quote)*

## Summary
Build the Press Kit page structure and its fixed narrative-section sequence (Introduction → Exterior → Interior → Battery/powertrain → Safety & assistance → Connectivity), plus the press-kit header. Press kits are `press_release` items surfaced via the shared listing filter (not a separate CPT), but the *detail* page is a distinct, more-structured template than a Story.

## Description
Confirmed on the live Peaq press kit (requirements §11.8): the Press Kit detail page presents a **fixed sequence of named narrative sections**, each a heading + rich text + imagery — in contrast to the freely-orderable component model used for Stories (SKODA-801). This ticket delivers:

- **Press Kit Header** (MR-PK01): title, imagery, and date/model/category metadata where applicable.
- **Structured Narrative** (MR-PK02): the ordered section set as a reusable page structure so an editor composes a kit without page-specific development.
- The **press-kit parser** (feeds SKODA-803 bulk import): detect press-kit source pages, map narrative headings → DA sections, reduce chrome, emit one canonical Metadata block (template=press-kit, model, bodywork, category, date).

**Key modelling decision (open, §11.8):** is the section sequence *fixed across every kit* or does it vary by product type (a combustion model has no battery/powertrain section)? This determines whether the sections are **required fields** or **optional/conditional**. Default assumption pending confirmation: sections are optional/conditional (author includes the ones that apply), which is the safer superset.

## Requirements / Spec
- Press-kit page structure = ordered default-content sections keyed by heading; no bespoke per-kit code.
- Header block reuses the hero/`hero-image` pattern where applicable; carries model/bodywork/category/date metadata.
- Parser: content-driven detection; maps `press_kit`-flavoured source into narrative sections + Metadata; no new markup invented.
- Section set authored as optional/conditional (superset) until §11.8 fixed-vs-conditional is confirmed.
- Nests cleanly with the grouped-media areas (SKODA-806), variant subsections (SKODA-808), and FAQ (SKODA-807).

## Acceptance Criteria
- [ ] Press-kit detail page renders header + the full ordered narrative sequence in the confirmed order.
- [ ] An editor can create a new press kit from the reusable structure with no page-specific development.
- [ ] Omitting a section (e.g. battery/powertrain on a combustion kit) degrades gracefully — no empty headings, no layout break.
- [ ] Parser output for a sample kit (Peaq) matches the source section order/content in local preview.
- [ ] Metadata block carries template/model/bodywork/category/date; passes lint.

## Dependencies
- Upstream: SKODA-801 (import infra + parser conventions), SKODA-202 (hero), SKODA-402 (press-kit listing filter view, MR-H06)
- Downstream: SKODA-803 (bulk import at scale), SKODA-806/807/808 (compose into this template), SKODA-1001 (per-locale trees)

## Risks / Flags
- **Fixed-vs-conditional sections (🟡, §11.8):** blocks final field model — confirm with business whether the sequence is mandatory or varies by product type.
- No live press-kit detail page has been reviewed by us beyond the reported Peaq structure — **request a live example** (requirements §10 Q6 / §11.1) before locking the template.
- Ties to the DA-vs-Universal-Editor authoring-model decision (D13) — a controlled/structured template is exactly the case where UE field-editing differs from DA.
