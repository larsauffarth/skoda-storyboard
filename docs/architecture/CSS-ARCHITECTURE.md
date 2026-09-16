# CSS Architecture

Most block CSS from here on is written by AI (Claude) Developer agents inside the
Architect → Developer → QA loop (`AGENTS-TEAM.md`). This doc formalizes the CSS layer
model, naming convention, and lint-enforced guardrails that keep AI-authored CSS
consistent and reviewable at scale. It **extends** `SKODA-106` (design tokens + global
CSS) and `docs/ui-specs/_FOUNDATIONS.md` (measured breakpoints/tokens) — read those
first for *what* the values are; this doc is about *how CSS is structured and enforced*.

No build step is used here (per `AGENTS.md`) — nothing below requires Sass, PostCSS,
Tailwind, or CSS-in-JS. It works within plain CSS + Stylelint only.

---

## 1. Layer model

```
Layer 1 — Tokens        styles/brand.css          :root custom properties only. No selectors
                                                    beyond :root. This file is exempt from the
                                                    "no hardcoded colors" lint rules (§5) — it's
                                                    where hex values are legitimately born.

Layer 2 — Global/Base    styles/styles.css,        Element resets, typography defaults, .button,
                          styles/lazy-styles.css    .icon, section theming (.section.light/.dark/
                                                     .highlight). Cross-block only — never add a
                                                     block-specific class name here (§4).

Layer 3 — Block          blocks/<name>/<name>.css  One file per block, root-scoped to .<name>,
                                                    lazy-loaded by scripts/aem.js's loadBlock()
                                                    exactly when that block renders. This
                                                    lazy-per-block-file loading *is* the
                                                    encapsulation boundary — it gives the same
                                                    isolation CSS Modules/Shadow DOM give other
                                                    stacks, for free, with zero build step.
```

`styles/fonts.css` is a fourth, narrower file: `@font-face` declarations only, lazy-loaded
post-LCP. It's exempt from the "values must come from a token" rule (§5) for the same
reason `brand.css` is — a `font-family` *definition* can't reference `var(--body-font-family)`,
it defines the identifier that token points to.

## 2. Breakpoints

**Canonical ladder: `576 / 720 / 768 / 992 / 1080`, mobile-first (`width >=` only).**
This is `_FOUNDATIONS.md` §1's exact source-measured ladder, verified against
`media-room-*.css`'s 284 `@media` rules. Content caps at `1248px` (`--content-max-width`).

> **Known discrepancy, resolved:** `docs/tickets/tickets/SKODA-106.md` still describes
> "normalized to the boilerplate 600/900/1200 convention." That line is stale — the
> canonical ladder here is the one `_FOUNDATIONS.md` measured from source and the one QA
> verifies pixel fidelity against (capture viewports 375/768/1024/1280). `SKODA-106.md`'s
> text was intentionally left unedited; this doc is the tie-breaker for future work.

**Why breakpoints are still literal `px` values, not `var(--bp-*)`, inside `@media`:**
CSS custom properties cannot be used inside `@media` feature values — media queries are
evaluated before the cascade resolves custom properties, and this repo has no PostCSS
step to work around that (`postcss-custom-media` would be a build step, which
`AGENTS.md` forbids). `styles/brand.css` still defines reference values —
`--bp-mobile-l`, `--bp-tablet-s`, `--bp-tablet`, `--bp-desktop-s`, `--bp-desktop` — for
JS reads (`getComputedStyle`) and any future `clamp()`/non-`@media` use, but `@media`
rules must repeat the literal px value from the table below.

| Token (reference only) | px | Role |
|---|---|---|
| `--bp-mobile-l` | 576 | secondary |
| `--bp-tablet-s` | 720 | secondary |
| `--bp-tablet` | 768 | primary |
| `--bp-desktop-s` | 992 | primary |
| `--bp-desktop` | 1080 | primary |

Enforcement: Stylelint's `media-feature-name-value-allowed-list` (§5) rejects any
`width` feature value outside this list — this is the practical substitute for not
being able to use `var()` inside `@media`.

## 3. Naming convention

Codifies what the 14 existing blocks already do — **do not introduce BEM `__`/`--`**:

- `.blockname` — the root class EDS gives every block (e.g. `.cards`, `.hero`, `.carousel`).
- `.blockname-part` — descendants, kebab-case, single hyphen (e.g. `.cards-overlay .cards-overlay-card-body`).
- `.blockname-part-modifier` — variant/stateful classes on the same element (e.g. `.cards-overlay-featured`, `.cards-overlay-promo`).
- Use `>` child combinators for Developer-authored DOM structure (not author-content-derived markup) to keep selectors shallow and explicit — the existing blocks average 2–4 levels; treat that as the target, not a hard lint cap (see §5 for why this isn't a numeric lint rule).

## 4. Utility classes: none by default

No utility-class framework exists today (no `.u-*`/`.is-*`), and none should be added
by default:

- No build step means no PurgeCSS/JIT — a utility framework here means a hand-maintained,
  always-loaded utility sheet, working against the lazy-per-block-file model that already
  gives good scoping and caching.
- AI Developer agents given a utility vocabulary tend to over-apply it, eroding the
  "block CSS lives in the block" boundary the collision rules in §8 depend on.

**One narrow, deliberate exception:** if an identical non-trivial rule appears in **3 or
more blocks** (e.g. a text-clamp pattern, or a scrim-gradient overlay already duplicated
per `_FOUNDATIONS.md`'s missing-tokens notes), it may be promoted to a single named,
descriptive class in `styles/styles.css` (e.g. `.text-clamp-3` — not abbreviated
utility-style). This is always an **Architect-approved, deliberate promotion** — never an
ad-hoc Developer addition mid-ticket, because `styles/styles.css` is shared-file
territory (§8).

## 5. Stylelint rules

`.stylelintrc.json` extends `stylelint-config-standard` plus:

| Rule | What it catches |
|---|---|
| `declaration-no-important` | No `!important` — zero uses exist today; keep it that way. |
| `selector-max-id: 0` | No ID selectors. |
| `selector-max-universal: 0` | No `*` selectors. |
| `color-no-hex` | New hardcoded hex colors — catches drift like `blocks/cards/cards.css`'s old `border: 1px solid #dadada;` (should have been `var(--card-border)`, now fixed). Exempt in `styles/brand.css` (§1). |
| `scale-unlimited/declaration-strict-value` on `color`/`background-color`/`border-color`/`font-family` | Requires `var(--...)` for these properties instead of a raw literal, even when the literal isn't a "new" color (catches things `color-no-hex` alone wouldn't, like reusing an existing hex value inline instead of the token). Deliberately **not** applied to spacing/width/height/font-weight/z-index — no clean 1:1 token scale exists for those yet (see `_FOUNDATIONS.md`'s "Missing tokens" backlog), and forcing it prematurely produces false positives that erode trust in the linter. Exempt in `styles/brand.css` and `styles/fonts.css` (§1) — both are definition files, not consumers. |
| `media-feature-name-value-allowed-list` (`width`) | Only the canonical breakpoint ladder (§2) — anything else fails lint immediately. |
| `font-family-name-quotes: always-where-required` | Matches `SKODA-106`'s "font-family names unquoted" intent: single-word/hyphenated names (`roboto`, `roboto-condensed`) stay unquoted; only names that syntactically require quotes (spaces, e.g. `'SKODA Next'`) are quoted. |
| `custom-property-pattern`, `selector-class-pattern` | Enforces kebab-case for both custom properties and class names. |

**Deliberately not lint-enforced as hard numeric caps:** selector nesting depth /
compound-selector count / specificity ceilings. An earlier draft of this ruleset added
`selector-max-compound-selectors`, `selector-max-type`, and `selector-max-specificity`
and ran it against the full repo — it produced 100+ failures concentrated in
`header.css`'s multi-level nav dropdowns and `footer.css`'s nested sitemap lists, which
are legitimately deep due to real content structure, not sloppiness. Blanket numeric
caps there would either break CI against known-good, QA'd code or force artificial hook
classes onto every nav/footer level just to satisfy the linter. Selector depth is
enforced instead via the Developer self-check (§6) and QA review (§7) as a judgment
call, not a hard gate: **new** selectors should stay in the 2–4 level range the rest of
the codebase uses; deep nav/footer-style trees are an accepted, known exception, not
something to imitate elsewhere.

**Newly added devDependency:** `stylelint-declaration-strict-value` — lint-time only, no
build step, no watch daemon; runs inside the existing `npm run lint:css` script exactly
like `stylelint-config-standard` already does.

**Documented legacy exceptions:** 10 blocks still use pre-canonical breakpoint literals
(`900px`/`700px`/`1000px`/`600px`). Rather than silently widen the lint allow-list to
tolerate them, each site has an explicit `stylelint-disable-next-line
media-feature-name-value-allowed-list` comment pointing back to this doc — grep for that
string to find every remaining site. This keeps the lint gate strict for new code while
being honest that the actual value migration is a separate, deliberately deferred piece
of work (§9) — changing `900px` to `992px` is a visual behavior change requiring QA
diffing, not a mechanical lint fix.

## 6. Developer pre-handoff self-check

Before marking a ticket ready for QA:

- [ ] Every color/font/spacing value used has `var(--...)` if a token exists for it.
- [ ] Every `@media` uses only the canonical breakpoint literals (§2), `min-width`/`width >=`
      only, unless a narrow-range exception is present and commented (see `cards-overlay`'s
      mobile-only CLS-reservation block for the existing pattern).
- [ ] No `!important`, no ID selectors; new selectors follow `.blockname`/`.blockname-part`
      naming (§3) and stay in the 2–4 nesting range unless mirroring genuinely deep
      author-content structure.
- [ ] No new class added to `styles/styles.css` without Architect sign-off (§4, §8).
- [ ] `npm run lint:css` passes locally.
- [ ] Any genuinely new value with no matching token is flagged as a candidate in
      `_FOUNDATIONS.md`'s "Missing tokens" section rather than hardcoded silently.

## 7. QA checklist additions

Append to `AGENTS-TEAM.md`'s existing pixel-fidelity WHAT/WHERE/AT-WHICH-VIEWPOINT/
EXPECTED/ACTUAL/WHAT-TO-CHANGE inspection (dimensions, spacing, typography, colors,
shadows, CSS variables, breakpoint behavior):

- Confirm computed color/font values trace to a `var(--...)` in DevTools, not an inline
  literal, for any newly touched rule.
- Confirm breakpoint behavior specifically **at 768/992/1080** (not just "looks right at
  some width"), matching `_FOUNDATIONS.md`'s captured viewports.
- Run `npm run lint:css` as part of QA verification, not only as a Developer self-check —
  a lint failure is an automatic QA fail, the same weight as a visual discrepancy.

## 8. Collision rules for CSS work

`AGENTS-TEAM.md` already names "design token," "typography system," "CSS," and
"responsive behavior" as always-collision categories requiring serialization. Concretely
for CSS, that means: **`styles/brand.css`, `styles/styles.css`, `styles/lazy-styles.css`,
`.stylelintrc.json`, and the breakpoint ladder itself are always shared-file territory.**
No execution wave should schedule two tickets that both touch any of these — even if the
diffs look small and non-overlapping, the Architect should flag them for solo execution.

## 9. Migration status: legacy breakpoint literals

10 of 15 blocks currently use pre-canonical breakpoint values. This is tracked here
(not as an edit to `SKODA-106.md`) as the concrete scope for whoever picks up that
ticket's breakpoint-token work — a global ladder change touches every block with a
`@media` rule, which is not parallelizable per §8, so it should land as one serialized
pass with one QA cycle, not opportunistic per-block cleanup.

| Block | Legacy literal(s) | Note |
|---|---|---|
| `header` | `900px` (×4) | |
| `footer` | `900px`, `700px`, `1000px` | |
| `cards-overlay` | `900px` (×3, incl. one `width <`) | |
| `stories` | `900px` (×2) | `stories.js` also has a JS media-query string (`PROMO_CAROUSEL_QUERY`) that must move in lockstep with the CSS value. |
| `carousel` | `900px`, `600px` (both `width <`) | |
| `columns` | `900px` | |
| `hero` | `900px` | |
| `hero-image` | `900px` | |
| `styles.css` (global) | `900px` (×2) | |

Not affected (no `@media` rules, or already canonical): `cards`, `cards-media`,
`cards-toolbar`, `fragment`, `newsletter-stub`, `story-rail`, `widget`.

`footer` additionally has its own reconciliation note in `_FOUNDATIONS.md` (source uses
`768/968/1024` for its nav; confirm-or-drop the `968`/`1024` special case, don't blindly
collapse it to the generic ladder, during that migration pass).
