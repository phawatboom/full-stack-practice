# 07 — React state, rendering and effects

**Goal:** model UI behavior with a clear source of truth. **Prerequisites:** 03–06. **Practice-plan link:** W1-D2 and W2-D4.

## Lesson

A component describes UI for its current props and state. Keep rendering pure: do not start writes or mutate shared data during render. State belongs at the lowest common owner that needs to coordinate it. Move it upward when siblings must share it; do not introduce global state just because several files exist.

Distinguish an editable draft, confirmed server data, and values computed from those inputs. Keeping every filtered list and count in separate state creates synchronization work. Derive simple values while rendering. For an update that depends on previous state, use the updater form. Closures observe the values from the render in which they were created, so an event handler does not magically see a newly scheduled state value.

Effects synchronize with external systems such as subscriptions. User actions usually belong in event handlers; pure calculations belong in rendering. An effect that subscribes must unsubscribe. Fetching through an effect needs race handling, and a framework or query library may offer a better application-level mechanism. Follow the project's existing approach before adding another data layer.

Keys describe item identity among siblings. Array indexes are risky when insertion, sorting or removal can move state to a different item. Use stable domain IDs. Understand how routing changes component identity too: URL state is often appropriate for a sharable search/filter; an unsaved text draft is usually local state.

## Worked example

```tsx
const [items, setItems] = useState<RequestItem[]>([]);
const [status, setStatus] = useState<Status | 'all'>('all');
const visible = items.filter(item =>
  status === 'all' || item.status === status
);

function addConfirmedItem(item: RequestItem) {
  setItems(previous => [...previous, item]);
}
```

`visible` needs no synchronization effect. Decide whether adding a confirmed item fits your paginated server data; in a real search view, invalidating/refetching may preserve ordering more reliably than appending.

## Required reading

- [Thinking in React](https://react.dev/learn/thinking-in-react): component boundaries and minimal state.
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect): derived data and event handlers.
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects): cleanup and dependencies.

## Task

Build a form/list/filter page. Draw which component owns each state value. Implement editing without mutating existing objects. Remove an effect that only copies derived data. Add navigation to a detail view, including loading/not-found states and a direct page refresh.

**Acceptance:** stable keys, labeled controls, minimal state, correct repeated updates, no side effects during render, and a clear unsaved-draft policy when navigating away. Explain whether a custom hook or reducer helps this actual code.

## Quiz

1. Why can storing both `items` and `filteredItems` in state cause inconsistencies?
2. What belongs in an effect, and what cleanup does it require?
3. How can using array indexes as keys display an edit draft on the wrong row?

## Walkthrough: updates are queued, not immediate assignments

Assume `count` is 0 in the current render. In one click handler, two calls to `setCount(count + 1)` both compute the next value from that render's same `count`. Both request 1. Two updater calls, `setCount(n => n + 1)`, instead apply sequentially to the queued result and produce 2. Read [React's update-queue explanation](https://react.dev/learn/queueing-a-series-of-state-updates) and trace each queued value yourself.

This is also why calling `setDraft('')` and immediately reading `draft` still sees the current handler's render snapshot. It is not evidence that React randomly ignored the update. Keep updater functions pure; side effects inside them can execute unexpectedly during development checks or repeated render work.

## Techniques and patterns

- **Separate draft from confirmed data:** editing should not mutate the currently displayed server record before save succeeds. Cancel discards the draft, not the persisted row.
- **Use a reducer for related transitions:** `idle → saving → error/saved` can be clearer than several booleans that allow “saving and saved and error” simultaneously. Do not use a reducer merely to replace a simple counter.
- **Use refs for non-rendered mutable handles:** a DOM element or request-generation marker can live in a ref. A visible count belongs in state because ref mutation does not schedule rendering.
- **Share logic deliberately:** two calls to a custom hook normally create separate state instances. Context or another explicit owner is needed for shared state.
- **Preserve or reset identity on purpose:** changing a component key resets its local state; this can clear another record's draft, but accidental key changes also destroy input/focus.
- **Treat memoization as a tool:** measure expensive work or identify a needed stable identity. Understand dependencies and the project's compiler behavior before adding `useMemo`/`useCallback` everywhere.

Real use: edit dialogs, optimistic lists, multistep forms and repeated rows all combine state lifetime with asynchronous events.

## Connections

Snapshots and closures connect to [JavaScript](../01-foundations/02-javascript.md) and [async ordering](../01-foundations/03-async-runtime.md). UI transitions mirror [typed state machines](../01-foundations/04-typescript.md). [Executable patterns](../examples/README.md) include a pure transition function; it is not a replacement for React integration testing.

## Scenario practice — Q4–Q7

4. **Predict:** with `count = 0`, queue `setCount(count + 1)`, then `setCount(n => n + 1)`. What is the resulting count? What does `console.log(count)` in the same handler print?
5. **Debug:** two components call `useRequestDraft()` but edits are not synchronized. Explain why, then propose the smallest shared-state owner.
6. **Design:** a user switches from request A to B while A has an unsaved draft. Compare preserving drafts by ID, warning before navigation and resetting on identity change. Choose a documented policy.
7. **Implement:** add an edit/save/cancel interaction with explicit saving/error states. Test that a failed save retains input, cancel discards edits and reopening another request does not reuse the wrong draft.

## Interview discussion

- “What causes a render, and what is committed to the DOM?” Follow-up: why must rendering stay pure?
- “State, ref, context or derived value?” Follow-up: classify a draft, focused input handle, filtered count and logged-in identity.

Use the [scenario guide](../review/scenario-guide.md) to check your reasoning and evidence.
