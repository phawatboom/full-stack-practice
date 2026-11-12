# 05 — HTML and accessible interactions

**Goal:** build forms and navigation people can actually use. **Prerequisite:** 01. **Practice-plan link:** W1-D2, W1-D5.

## Lesson

HTML communicates structure and behavior, not just appearance. Use headings in a meaningful hierarchy, links for navigation, buttons for actions, and native form controls for input. A clickable `div` does not automatically provide keyboard activation, focus behavior, or a useful accessible role. Semantic elements reduce the custom behavior you must maintain.

Every field needs a programmatically associated label. Placeholder text disappears during typing and is not a replacement. Connect help/error text to its input, explain how to fix errors, and do not communicate failure using only color. On submission, preserve the user's values. Make errors discoverable without forcing a screen reader to explore the entire page again.

Keyboard users need a sensible focus order, visible focus, and a way to leave every interaction. If you use a modal, understand initial focus, containment, Escape behavior and restoring focus afterward; prefer a well-tested primitive rather than improvising complex keyboard behavior. Browser-native elements help but still need testing.

Accessibility also includes zoom, readable contrast, motion preferences, touch targets, and understandable language. Automated checks find some defects, not all. Test with only a keyboard, with zoom, and with a screen reader when available. If you cannot perform a particular check, label it unverified instead of claiming compliance.

## Worked example

```html
<form>
  <label for="title">Request title</label>
  <input id="title" name="title" required maxlength="120"
         aria-describedby="title-help title-error">
  <p id="title-help">Use a short description of the problem.</p>
  <p id="title-error"></p>
  <button type="submit">Create request</button>
</form>
```

On a validation error, fill the error text and mark the field invalid. Decide how focus and error announcements work; adding arbitrary ARIA attributes is not a substitute for checking the result. Client constraints improve the experience but the server must validate independently.

## Required reading

- [W3C WAI forms tutorial](https://www.w3.org/WAI/tutorials/forms/): labels, instructions, validation and notifications. Apply one example of each.
- [MDN core learning modules](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core): semantic HTML and accessibility sections. Identify which browser behaviors native controls supply.

## Task

Build the request form with labels, helpful errors and a submit result. Complete it entirely by keyboard, submit invalid data, correct it, and submit again. Add a loading state that makes repeated submissions understandable.

**Acceptance:** focus is visible; every action is keyboard reachable; errors are tied to fields; input survives failure; accessible names are meaningful; at 200% zoom content remains usable. Record manual checks and an automated accessibility check if available.

## Quiz

1. Why use a button instead of a clickable styled `div`?
2. What information does a placeholder fail to provide reliably?
3. Why does a passing automated accessibility scan not prove the interaction is accessible?

## Walkthrough: accessible failure and recovery

A request form contains title and description. The user submits a blank title. “Invalid input” in a red toast is insufficient: which field failed, how is it corrected, and can a keyboard or screen-reader user find it?

Render a specific field error, associate it with the input, set its invalid state, and preserve the description draft. For a longer form, an error summary can link to invalid fields. Decide whether focus moves to the summary or first invalid field. On a server outage, focus need not jump to an unrelated field: give an understandable status and a retry path.

```html
<label for="request-title">Title</label>
<input id="request-title" aria-invalid="true"
       aria-describedby="request-title-error">
<p id="request-title-error">Enter a title before creating the request.</p>
<p role="status">Your draft has been kept. Try saving again.</p>
```

This is a failed-state markup example. The application must update attributes/content correctly. Avoid making every changing element an assertive live region; excessive announcements can make a page harder to use.

## Techniques and patterns

- **Match element to intent:** a link changes location; a button performs an action. Explicit `type="button"` prevents secondary form buttons unexpectedly submitting.
- **Name repeated controls:** multiple “Edit” buttons need a meaningful association or name distinguishing their request, without exposing private data.
- **Track focus after removal:** deleting the currently focused row needs a sensible next location. Otherwise keyboard users may lose their place.
- **Use a status region for non-blocking updates:** explain result counts or save completion without interrupting every keystroke. Debounce announcements if appropriate.
- **Preserve task continuity:** a loading state should not erase a draft or remove the only focusable escape path. Disabling controls needs thought about feedback and recovery.

Real use: support portals and admin dashboards contain repetitive forms and actions; accessibility defects often become general usability defects under slow networks or keyboard use.

## Connections

The [network lesson](08-client-server-data.md) supplies distinct failure types. [Component tests](../05-quality/16-testing.md) can locate fields by role/name, but manual focus checks are still necessary. Read [WAI error notification examples](https://www.w3.org/WAI/tutorials/forms/notifications/) for summaries, field messages and success feedback.

## Scenario practice — Q4–Q7

4. **Predict:** a form has a Save button and `<button>Cancel</button>`. What can Cancel do by default, and how would you make its intent explicit?
5. **Debug:** deleting a row makes focus disappear and the next Tab starts near the top. Describe how to observe active focus and choose a recovery target for first/middle/last rows.
6. **Design:** choose feedback/focus behavior for invalid fields, server outage and successful save. Explain why all three should not necessarily use the same toast.
7. **Implement:** add a keyboard-usable validation summary linking to two fields. Test field associations and draft retention; record a manual keyboard journey and any screen-reader checks actually performed.

## Interview discussion

- “How would you make a form accessible?” Follow-up: what happens after validation fails?
- “When should ARIA be used?” Follow-up: why prefer native semantics when they already express the interaction?

The [scenario guide](../review/scenario-guide.md) separates automated assertions from manual evidence.
