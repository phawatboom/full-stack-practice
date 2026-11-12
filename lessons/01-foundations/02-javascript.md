# 02 — JavaScript you can reason about

**Goal:** transform data without hidden mutations and understand the code across module boundaries. **Prerequisite:** 01. **Practice-plan link:** baseline and W1-D2.

## Lesson

Primitive values such as numbers and strings behave differently from objects and arrays. Assigning an object to another variable gives another reference to the same object. `const` prevents reassigning the binding; it does not freeze the object. Spreading an array copies the array container but preserves references to nested objects. To update one nested record without mutation, create new objects along the path you change.

Use `map` for transformation, `filter` for selection, and a loop or `reduce` for accumulation. Choose the clearest expression, not the shortest chain. JavaScript's default array sort compares string representations; pass a comparator for numeric or domain-specific ordering. `sort` mutates the array, so copy it when callers need the original unchanged.

Functions capture bindings from their surrounding scope: a closure can retain a counter or configuration after the outer function returns. That same behavior can retain an older value inside a callback. Understand the captured value and when the function was created before diagnosing “random” asynchronous behavior.

Modules export explicit capabilities. A caller should not need to know every internal helper. Keep import-time side effects small: importing a validation function should not unexpectedly start a server or erase a database. Pure functions are useful for rules whose output depends only on input; I/O belongs at visible boundaries. Classes and inheritance are tools, not requirements for “professional” code.

## Worked example

```js
// domain/requests.mjs
export function resolveRequest(items, id) {
  return items.map(item =>
    item.id === id ? { ...item, status: 'resolved' } : item
  );
}

const before = [{ id: 'r1', status: 'new' }];
const after = resolveRequest(before, 'r1');
// before[0].status remains 'new'; after[0].status is 'resolved'.
```

Decide what should happen if an ID is absent. Returning an unchanged list may fit a UI helper; a backend update may need a not-found response. Context determines the rule.

## Required reading

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide): “Grammar and types,” “Functions,” “Indexed collections,” “Keyed collections,” and “JavaScript modules.” Focus on references, scope and choosing array vs map/set.

## Task

Write `countOpenByOwner`, `resolveRequest`, and `sortByCreatedAt` in one module and import them from a separate executable file. Avoid mutating inputs. Define behavior for empty input, absent ID, duplicate timestamps, and invalid dates before writing code.

**Acceptance:** examples execute from the command line; assertions cover normal/empty/boundary cases; original inputs stay unchanged; you can explain time and auxiliary-space complexity. Use deterministic tie-breakers for sorting.

## Quiz

1. Why can `const copy = [...items]` still allow a nested update to change the original data?
2. When is a `Map` clearer or safer than accumulating user-controlled keys into a normal object?
3. Why should importing a helper not automatically start the HTTP server?

## Walkthrough: shallow copy is only the first step

```js
const original = [{ id: 'r1', meta: { priority: 'normal' } }];
const copy = [...original];
copy[0].meta.priority = 'high';
// original[0].meta.priority is now also 'high'.

const replaced = original.map(item => item.id === 'r1'
  ? { ...item, meta: { ...item.meta, priority: 'normal' } }
  : item);
```

Trace the references: the first copy creates a new array, but its first element is the same object; both objects also refer to the same `meta`. The replacement creates a new item and nested metadata only along the changed path. Unchanged rows can retain identity. Blindly deep-cloning everything is usually unnecessary and can alter unsupported values or waste work.

## Techniques and patterns

**Transform → validate → use:** make each step visible. A chain that sorts, filters, mutates and writes to storage is difficult to reason about. Pure collection helpers fit UI derivation, import processing and API response shaping.

**Explicit fallback semantics:** `value || fallback` replaces `0`, `false` and `''`; `value ?? fallback` replaces only null/undefined. Choose based on the contract. A page number of zero might be invalid input to reject, not a value to silently replace.

**Lookup once:** build a map when repeatedly joining requests to owners in memory. Define duplicate-key behavior. A `Map` built from entries keeps the last value for a repeated key; it does not automatically warn you.

**Guard before transformation:** `Array.isArray(input)` establishes array shape, not the validity of every item. Validate item fields before relying on them. Optional chaining avoids a property-access exception but can conceal missing required data if every absence silently becomes a default.

Real use: these techniques prevent React mutation bugs, incorrect counters and accidental changes to shared cached records.

## Connections

Reference identity explains [React updates](../02-frontend/07-react-state.md). Explicit inputs support [focused tests](../05-quality/16-testing.md). A map join connects to [SQL joins](../03-backend-data/11-relational-sql.md) and [complexity](../07-engineering/23-cs-interviews.md). The [executable examples](../examples/README.md) include immutable updates with identity checks.

## Scenario practice — Q4–Q7

4. **Predict:** what are `0 || 10`, `0 ?? 10`, `'' || 'x'` and `'' ?? 'x'`? Give a real field where preserving zero matters.
5. **Debug:** `const next = [...requests]; next.sort(compare); next[0].title = 'Edited'` changes an original title. Which operation mutated which object? Repair it without cloning unrelated rows.
6. **Design:** duplicate IDs arrive in an import. Compare rejecting duplicates, first-wins and last-wins; choose a policy for a user-visible import and explain how to report it.
7. **Implement:** create `updatePriority(items, id, priority)` without mutation. Define absent-ID behavior, preserve unchanged row identities, and test input values and references separately.

## Interview discussion

- “Does `const` make an object immutable?” Follow-up: how deep is object spread?
- “When would you use a map rather than repeatedly searching an array?” Follow-up: what changes if the list contains only five records?

Explain correctness before optimization; unnecessary complexity for tiny inputs can outweigh a theoretical improvement. Review with the [scenario guide](../review/scenario-guide.md).
