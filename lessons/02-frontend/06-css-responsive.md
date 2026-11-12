# 06 — CSS that survives real content

**Goal:** understand layout failures and fix their cause. **Prerequisite:** 05. **Practice-plan link:** W1-D2 and delivery reviews.

## Lesson

The cascade resolves competing declarations using origin, importance, layers, specificity and order. Inheritance passes some values from parent to child; layout constraints then determine used sizes. When a style “doesn't work,” inspect computed styles and the layout box before adding more selectors or `!important`.

With the default content-box model, padding and borders add to the stated width. `border-box` makes common layout reasoning easier. Use normal flow first, flexbox for one-dimensional alignment, and grid for two-dimensional layout. Absolute positioning fits overlays and deliberate positioning, but a whole dashboard built from fixed coordinates will break when text wraps.

Responsive design responds to available space and content. Avoid fixed heights on text containers unless overflow behavior is intentional. Long request titles, localization, browser zoom and validation messages all change layout. Flex/grid children can have minimum sizing behavior that prevents shrinking; investigate `min-width: 0`, wrapping, and overflow at the actual container before hiding overflow globally.

Use a small set of spacing, color and typography tokens to stay consistent. Preserve focus indicators and contrast. A design system can help a team, but a junior project does not need its own component framework before it can display a form.

## Worked example

```css
* { box-sizing: border-box; }
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  max-width: 72rem;
  margin-inline: auto;
  padding: 1rem;
}
.request-title { overflow-wrap: anywhere; }
@media (min-width: 52rem) {
  .workspace { grid-template-columns: 16rem minmax(0, 1fr); }
}
```

The breakpoint is an example chosen for this layout, not a universal “tablet” boundary. Verify it with actual content.

## Required reading

- [MDN core learning modules](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core): CSS box model, cascade, flexbox, grid and responsive design. Use developer tools to explain one computed width.

## Task

Create ClientDesk's form/list layout. Test narrow and wide viewports, 200% zoom, a 120-character title without spaces, empty results, and multiple error lines. Diagnose one overflow by tracing ancestor sizes.

**Acceptance:** no accidental page-wide horizontal scroll; text and controls remain usable; focus is visible; layout responds to content; no fixed coordinates used to place ordinary content. Include screenshots and one computed-style explanation.

## Quiz

1. Why might `width: 100%` plus padding overflow a container?
2. When would you choose grid over flexbox?
3. Why can hiding overflow conceal a usability bug rather than fix it?

## Walkthrough: why the action button is pushed offscreen

Imagine a flex row with a long request title and a Delete button. The title's default minimum sizing can prevent it shrinking enough, so the whole row overflows. Making the font smaller treats the symptom. Inspect the row and children, identify the minimum-size constraint, and choose wrapping or deliberate truncation.

```css
.request-row { display: flex; align-items: start; gap: 0.75rem; }
.request-content { flex: 1; min-width: 0; }
.request-title { overflow-wrap: anywhere; }
.request-actions { flex: none; }
button:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }
```

The example allows text to wrap while keeping actions available. A truncated one-line title might instead fit a dense table, but the full text must remain available through an accessible interaction. A hover-only tooltip does not serve every input method.

## Techniques and patterns

**Inspect the winning rule:** identify selector, stylesheet/layer and computed value. Repeatedly increasing specificity makes the next change harder.

**Build from content constraints:** decide a useful minimum card width and let the layout wrap; choose breakpoints where content stops fitting. Test long translated labels and reduced viewport space due to zoom.

**Distinguish overflow owners:** a data table may need its own horizontal scroll region. The entire page should not scroll sideways because a nested card refuses to shrink.

**Use logical properties:** `margin-inline`, `padding-block` and related properties express layout direction more flexibly than hardcoding left/right everywhere. Still test the languages you claim to support.

**Respect positioning contexts:** `z-index` acts within stacking contexts; a huge number does not necessarily place a child above another context. Inspect ancestors creating contexts before escalating numbers. Avoid building complex modal layers from scratch when a proven primitive exists.

Real use: dashboards fail under real names, translated content, browser zoom and embedded panels long before they fail on a tidy mockup.

## Connections

CSS sizing affects [keyboard/focus visibility](05-html-accessibility.md) and [layout stability measurements](../05-quality/18-performance.md). Revisit box model/flex/grid sections of [MDN's core modules](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core) using your actual computed layout as the example.

## Scenario practice — Q4–Q7

4. **Predict:** a content-box element has width 300px, horizontal padding 20px per side and borders 2px per side. What is its outer width? What changes with border-box?
5. **Debug:** a dialog is behind a header despite `z-index: 9999`. What ancestor/style evidence would you inspect before increasing the number?
6. **Design:** a narrow screen must show a table with eight meaningful columns. Compare wrapping, a dedicated scroll region and a card presentation, including keyboard/screen-reader effects.
7. **Implement:** fix the long-title row without hiding its action. Verify at 320 CSS pixels, wider viewports, 200% zoom, multiline errors and keyboard focus. Document any intentional scrolling.

## Interview discussion

- “Explain the box model and a real overflow bug.” Follow-up: which computed values would you inspect?
- “How do you choose responsive breakpoints?” Follow-up: what would make a device-name-only approach fail?

Check the [scenario guide](../review/scenario-guide.md) after using developer tools.
