# CSS & Responsive Design Guardrail

This document is the canonical source of truth for frontend CSS and
responsive-design practices used by developers and AI coding agents.

## 1. Non-Negotiable Rules

1.  Never select a breakpoint merely because it corresponds to a device
    category.
2.  Choose breakpoints where the UI requires a meaningful structural or
    behavioral change.
3.  Follow the three-layer CSS architecture: fluid CSS,
    intrinsic/adaptive CSS, then breakpoint/behavioral CSS.
4.  Prefer natural content sizing, Flexbox, Grid, `min()`, `max()`,
    `clamp()`, `minmax()`, wrapping, and intrinsic sizing before adding
    media queries.
5.  Prefer container queries when a reusable component should respond to
    its available container rather than the viewport.
6.  Use CSS variables/design tokens for reusable height, width, min/max
    dimensions, margin, padding, gap, typography, colors, radii,
    borders, shadows, z-index, animation/transition timing, component
    dimensions, and layout constraints.
7.  Do not create variables mechanically for meaningless one-off values.
    Variables should represent reusable values, design tokens, semantic
    values, or meaningful component configuration.
8.  Keep only genuinely global CSS in global stylesheets.
    Component/UI-block styles belong with their component.
9.  Prefer mobile-first progressive enhancement unless the existing
    architecture has a justified alternative.
10. Avoid JavaScript for responsive layout when CSS can express the
    behavior.
11. Avoid fixed heights for content-driven UI unless the design
    explicitly requires them.
12. Minimize specificity, nesting, overrides, and `!important`.
13. Preserve accessibility, localization, RTL compatibility, text
    scaling, and user preferences.
14. Reuse the existing design system before introducing new tokens,
    utilities, or styling patterns.

## 2. Three-Layer CSS Architecture

### Layer 1 --- Fluid CSS

First solve sizing and spacing fluidly.

Prefer relative and modern sizing primitives such as `%`, `rem`, `em`,
`dvh`, `svh`, `lvh`, `min()`, `max()`, `clamp()`, and `calc()` where
appropriate.

``` css
.component {
  width: min(100%, var(--component-max-width));
  padding-inline: clamp(
    var(--space-3),
    3vw,
    var(--space-6)
  );
}
```

### Layer 2 --- Intrinsic / Adaptive CSS

Next use browser layout capabilities that naturally adapt to available
space.

Prefer Flexbox, Grid, wrapping, `auto-fit`, `auto-fill`, `minmax()`,
intrinsic sizing, and content-based sizing.

``` css
.cardGrid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(var(--card-min-width), 1fr));
  gap: var(--grid-gap);
}
```

Do not add a media query when intrinsic layout can solve the requirement
cleanly.

### Layer 3 --- Breakpoint / Behavioral CSS

Use a media query only when the UI requires a discrete structural or
behavioral transition.

Examples include navigation collapsing, a sidebar becoming a drawer, a
toolbar moving actions into overflow, or a multi-column composition
requiring a different information layout.

## 3. Breakpoint Selection

Before adding a viewport breakpoint, ask:

1.  Can natural content sizing solve this?
2.  Can Flexbox or Grid solve it?
3.  Can wrapping or intrinsic sizing solve it?
4.  Can `min()`, `max()`, `clamp()`, or `minmax()` solve it?
5.  Is the behavior actually local to a component and therefore better
    expressed with a container query?
6.  Is there a real structural or behavioral transition?

Breakpoints represent layout-state transitions, not phones, tablets, or
specific hardware.

Do not create breakpoint proliferation. Add the smallest number of
breakpoints needed for a robust layout.

If breakpoint tokens are used, prefer layout-oriented names such as
`compact`, `content`, or `wide` rather than device names.

## 4. Mobile-First

Use the simplest narrow layout as the base where practical and
progressively enhance as space becomes available.

Do not force desktop-first CSS into mobile through large numbers of
overrides.

## 5. Container Queries

Prefer container queries for reusable components whose layout depends on
the width available to that component.

Typical candidates include cards, dashboard widgets, panels, sidebars,
modular content blocks, and design-system components.

Viewport queries remain appropriate for page-level behavior genuinely
tied to the viewport.

## 6. CSS Variables and Design Tokens

Use existing project tokens first.

A useful hierarchy is:

-   Primitive tokens: raw palette/scale values.
-   Semantic tokens: purpose-oriented values such as surface, text,
    action, danger.
-   Component tokens: meaningful component-level configuration.

Components should consume semantic tokens rather than hard-coded theme
values where possible.

Avoid arbitrary magic numbers and near-duplicate tokens.

## 7. Global vs Component CSS

Global CSS should normally contain only:

-   reset/normalization;
-   `box-sizing` and document defaults;
-   root/application design tokens;
-   global typography/font declarations;
-   application-wide themes;
-   global accessibility rules;
-   intentionally global utilities.

Do not put component-specific fixes or selectors into global CSS.

Keep responsive rules for a component close to that component's styles.

## 8. Layout Practices

Use Grid for two-dimensional layouts and Flexbox for one-dimensional
alignment and distribution.

Avoid spacer elements, unnecessary absolute positioning, excessive
negative margins, and JavaScript layout measurements.

Prefer content-driven sizing. Use fixed dimensions only when they
express a genuine design constraint.

Do not use `overflow: hidden` merely to conceal a layout bug.

## 9. Typography and Content

Prefer scalable typography and fluid sizing such as `clamp()` when
appropriate.

Constrain readable text widths rather than allowing text lines to grow
indefinitely.

Layouts must tolerate user font scaling, dynamic data, and translated
text.

Avoid `white-space: nowrap` unless a single-line presentation is an
intentional requirement.

## 10. Accessibility and Interaction

Never remove visible keyboard focus without an accessible replacement.

Support `:focus-visible` and do not rely on hover as the only
interaction state.

Consider `prefers-reduced-motion`.

Do not infer input capability from viewport width. Use `hover` and
`pointer` media features when interaction capability matters.

Touch targets should remain usable at narrow widths and with coarse
pointers.

## 11. Internationalization

Prefer logical properties such as `margin-inline`, `padding-inline`,
`padding-block`, and logical inset properties where appropriate.

Account for text expansion and RTL layouts.

Do not use fixed heights or widths that fail when translated content
becomes longer.

## 12. Responsive Media

Images, SVGs, and videos should not unintentionally overflow their
containers.

Use `aspect-ratio`, `object-fit`, and reserved media space where
appropriate to reduce layout shift.

Select modern viewport units such as `dvh`, `svh`, or `lvh` according to
intended mobile viewport behavior rather than blindly relying on
`100vh`.

## 13. Specificity and Maintainability

Keep selectors simple and specificity low.

Avoid deep nesting and DOM-structure-dependent selectors.

Do not use `!important` to compensate for poor CSS architecture.
Exceptional uses should be intentional and documented.

Prefer readable, explicit CSS over clever selector tricks.

## 14. Themes and States

Represent themes through semantic CSS variables where possible.

Components should explicitly support relevant states such as default,
hover, focus, active, disabled, selected, loading, error, and success.

Use a defined z-index/layering scale instead of arbitrary large numbers.

## 15. Performance

Avoid unnecessarily expensive styling and continuous layout-triggering
animations.

Prefer `transform` and `opacity` for animations where appropriate.

Avoid duplicate declarations, huge global selector trees, and
unnecessary JavaScript-driven style updates.

## 16. Browser Compatibility

Use modern CSS features when they are compatible with the project's
supported browser matrix.

Do not introduce a new CSS capability solely because it is newer. Follow
the project's browser-support requirements and progressive-enhancement
strategy.

## 17. Anti-Patterns

Avoid by default:

-   Device-specific breakpoint assumptions.
-   Breakpoint proliferation.
-   Unjustified desktop-first override chains.
-   Fixed widths/heights for dynamic content.
-   Arbitrary magic numbers.
-   Component CSS in global stylesheets.
-   Excessive `!important`.
-   Deep selector nesting.
-   JavaScript-driven viewport layout.
-   Excessive absolute positioning.
-   Hiding important functionality merely because the viewport is
    narrow.
-   Using `overflow: hidden` to mask layout defects.
-   Hard-coded theme values when semantic tokens exist.
-   Duplicate or near-duplicate design tokens.
-   Arbitrary z-index values.
-   Ignoring localization, RTL, text expansion, or font scaling.
-   Ignoring reduced-motion preferences.
-   Hover-only interaction behavior.

## 18. AI Decision Process

When generating or modifying CSS, follow this sequence:

``` text
Can natural sizing solve it?
        ↓
Can Flexbox/Grid/intrinsic layout solve it?
        ↓
Can fluid sizing solve it?
        ↓
Does it depend on component/container width?
        ↓
Use a container query if appropriate
        ↓
Does the viewport require a discrete behavioral change?
        ↓
Add a viewport breakpoint only if necessary
```

## 19. AI Self-Review

Before returning CSS changes, verify:

-   The three-layer architecture was followed.
-   Breakpoints are behavior-driven.
-   Unnecessary breakpoints were avoided.
-   Container queries were considered for reusable components.
-   Existing design tokens were reused.
-   Meaningful dimensions and visual values use CSS variables/tokens.
-   Global CSS contains only global concerns.
-   Component CSS remains component-local.
-   Fixed heights and widths are justified.
-   Specificity is low and `!important` is avoided.
-   JavaScript is not being used for a problem CSS can solve.
-   Intermediate widths were considered, not only named device sizes.
-   Focus, reduced motion, touch interaction, and text scaling remain
    usable.
-   Localization, text expansion, and RTL were considered.
-   Overflow and layout shift are intentional and controlled.
-   The implementation is understandable and maintainable.

## 20. Final Principle

Do not begin with: **"What breakpoint should I use?"**

Begin with: **"How can this layout be fluid and intrinsic, and what
actual behavior requires a discrete transition?"**

Preferred order:

``` text
Fluid → Intrinsic → Container-aware → Breakpoint
```

Use the smallest number of breakpoints necessary for a robust,
accessible, and maintainable interface.
