# SKODA-808, Press Kit model-variant / bodywork subsections + internal categorization
- **Epic:** E08, Editorial at Scale
- **Type:** block / template
- **Phase:** B  ·  **Pilot:** No · **Milestone:** M2 (go-live)
- **Estimate:** 3 SP · AI-assisted 1–2d / manual 2–3d *(planning estimate, not a quote)*

## UI Specification
**Build-ready measured spec: [`docs/ui-specs/press-kit-variant.md`](../../ui-specs/press-kit-variant.md)** (captured via Chrome DevTools, "Peaq Sportline" sub-page live). Read it before implementing.

Key facts from capture (resolves §11.7/9/14):
- The variant ("Škoda Peaq Sportline") appears as a **nested tile + chapter-nav entry + sub-page** under the same kit path, after the core narrative. **No dedicated selector widget exists** in source.
- **Decision resolved → in-page anchor/toggle** (reuse the Chapters sub-nav pattern), not a separate variant-kit.
- Facets live as classes on the article (`model-peaq bodywork-suv category-* technology-* years-*`) → feed the 15-facet listing (SKODA-401/402).

## Summary
Support one or more variant-specific subsections nested within a Press Kit (e.g. "Škoda Peaq Sportline" after the core narrative), plus a variant/bodywork selector, and carry the internal categorization/filtering metadata that ties kits back to the listing facets.

## Description
Confirmed on the live Peaq kit (§11.9): a dedicated subsection for a specific model variant appears **after** the core narrative sections, so the press-kit template must support **nested variant-specific subsections**, not just a flat section list. Alongside this:

- **Variant / Bodywork Selector (MR-PK03, §11.7):** navigate between applicable vehicle variants where required (variant/bodywork cards or a selector). Final interaction TBD.
- **Internal categorization (§11.14):** press-kit pages carry model-related / topical subset metadata consistent with the listing taxonomy filters (model, bodywork, category, the 15-facet set). This is what makes a kit discoverable via MR-L03 faceted filters and MR-M04 model-related-press-kits strips.

## Requirements / Spec
- Press-kit template supports N nested variant subsections (heading + narrative + media), reusing SKODA-805 section conventions and SKODA-806 grouped media within a variant where needed.
- Variant/bodywork selector: client-side switch between variant subsections (or links to variant kits), default to in-page anchor/toggle; confirm interaction in design.
- Metadata: model + bodywork + category facets on the kit's Metadata block (feeds SKODA-401 normalization / query-index), enabling faceted listing and model-page association.
- No new taxonomy invented, reuse the confirmed 15-facet model.

## Acceptance Criteria
- [ ] A press kit renders one or more variant subsections nested after the core narrative, in source order.
- [ ] The variant/bodywork selector switches/navigates between variants accessibly (keyboard + ARIA).
- [ ] Kit Metadata carries model/bodywork/category facets and the kit surfaces correctly under the relevant listing facets (MR-L03) and model-page strips (MR-M04).
- [ ] Output passes lint and matches source structure in local preview.
- [ ] Variant renders as a nested sub-page + Chapters-nav anchor (per [`press-kit-variant.md`](../../ui-specs/press-kit-variant.md)); visual diff vs source ≤ 2% per-pixel.

## Dependencies
- Upstream: SKODA-805 (press-kit template), SKODA-806 (grouped media reused within a variant), SKODA-401 (facet normalization / query-index)
- Downstream: SKODA-402 (listing facets consume the metadata), SKODA-1001 (per-locale trees)

## Risks / Flags
- **Selector interaction TBD (🟡, §11.7/§11.9):** in-page toggle vs separate variant kits, design decision.
- Facet extraction is a **normalization layer, not clean selectors** (build-confirmed, SKODA-401), variant/bodywork/category may need derivation, not direct read.
- Which facets are demo/priority-critical is scoped by decision **D12**.
