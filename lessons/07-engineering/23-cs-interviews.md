# 23 — Computer science for everyday engineering

**Goal:** solve small problems independently and connect them to system behavior. **Prerequisites:** 02–03, 11. **Practice-plan link:** daily study blocks and final defense.

## Lesson

Complexity describes how work or storage grows with input size. Include the relevant input: number of requests, text length, graph vertices/edges, or database result size. A single loop with a linear search inside can be quadratic even if the code looks compact. Complexity is a model, not a stopwatch; constants, I/O and data shape still matter.

Arrays fit ordered iteration and indexed access. Maps fit keyed lookup and frequency counting with typical near-constant expected operations; do not state unconditional worst-case guarantees for every implementation. Sets support uniqueness. Stacks suit last-in-first-out traversal or undo; queues suit first-in-first-out work. A simple array `shift` can move elements, so a queue with a head index can matter at larger scale.

Sorting enables order-based operations; binary search requires a sorted sequence and a clear boundary convention. Tree/graph traversal appears in nested comments, dependency analysis and organizational structures. Track visited nodes where cycles are possible. For very deep structures, recursion can exceed the call stack; an explicit stack may be safer.

Runtime foundations help explain real failures. Processes have separate address spaces; threads within a process share memory according to the runtime's model. Asynchronous I/O does not mean unlimited CPU parallelism. Memory retained by references can grow indefinitely. Ports identify transport endpoints, DNS resolves names, and a connection pool bounds active database connections. A hundred app instances each allowing twenty connections imply a very different database load from a single instance.

In an interview, clarify inputs, work a small example, propose a simple solution, analyze it, improve only if needed, then test edge cases. Explain uncertainty rather than narrating memorized terminology. In project work, use the same discipline without forcing every problem into an interview puzzle.

## Worked complexity contrast

```js
// Build once, look up repeatedly instead of find() inside a loop.
const byId = new Map(users.map(user => [user.id, user]));
const named = requests.map(request => ({
  ...request,
  ownerName: byId.get(request.ownerId)?.name ?? 'Unknown',
}));
```

State your duplicate-ID policy. With typical map behavior this takes linear work in users plus requests and extra storage proportional to users (plus output).

## Required reading

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide): keyed collections and indexed collections as reference while solving.
- [Node learning material](https://nodejs.org/learn): select event-loop/blocking-work sections for runtime reasoning. Detailed scheduler internals are later study.

## Task ladder

1. Frequency map: first unique character; specify code-unit/code-point behavior.
2. Deduplicate requests by ID; define which duplicate wins.
3. Binary search: first item at or after a timestamp in a sorted array.
4. Queue: process dependency-ready tasks; detect an impossible cycle as a stretch.
5. Traverse nested comments and count visible descendants with explicit permissions.

**Acceptance:** for each, define input/output, show empty/boundary/duplicate cases, provide executable checks, and explain time/space costs. Complete two independently today; distribute the rest across study blocks.

## Quiz

1. Why can `map` containing `find` become quadratic?
2. Which precondition does binary search rely on?
3. Why can a non-blocking API still run out of database connections?

## Walkthrough: binary search as an invariant

Find the first value greater than or equal to a target in a sorted numeric array. Maintain a half-open interval `[low, high)` containing the answer position. Values before low are less than target; values at/after high are known not to be needed for the remaining search. Start with low 0 and high `values.length`.

```js
export function lowerBound(values, target) {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (values[middle] < target) low = middle + 1;
    else high = middle;
  }
  return low;
}
```

For `[1, 3, 3, 8]` and target 3, the answer is index 1. For target 9 it is 4, a valid insertion position beyond the final element. Empty input returns 0. The range shrinks each step; the code does not discard a possible earlier equal value. The [executable examples](../examples/README.md) test this same algorithm against a simple linear oracle.

## Techniques and patterns

- **State an invariant before a clever algorithm:** what remains true during each iteration? This supports correctness, not just an expected output on one sample.
- **Separate input/output/auxiliary space:** returning n transformed items requires output storage even if the algorithm uses little additional workspace.
- **Use a simple reference solution:** compare an optimized solution with a slower obvious one over many deterministic small cases.
- **Match structures to operations:** a frequency map handles counts; a set handles membership; a stack/queue handles ordering. Do not introduce a tree because an interview topic mentions trees.
- **Bound concurrency as well as complexity:** 20 application instances × pool size 10 permits up to 200 configured database connections before other tools/services. Deployment-level budgets matter.
- **Remember failure limits:** recursive traversal can hit stack depth; maps/caches with no eviction can retain unbounded memory; a cycle can make naive traversal never end.

Real use: searching sorted ranges, joining records, detecting dependencies and controlling queues are practical forms of algorithmic reasoning.

## Connections

[Array transformations](../01-foundations/02-javascript.md) show reference costs, [SQL plans](../05-quality/18-performance.md) show a different execution model, and [deployment](../06-delivery/19-runtime-deployment.md) supplies aggregate resource limits. A database index is conceptually related to lookup efficiency but not implemented by your frontend array helper.

## Scenario practice — Q4–Q7

4. **Predict:** give lowerBound results for `[]/3`, `[1,3,3,8]/3`, `[1,3,3,8]/0`, and `[1,3,3,8]/9`. Trace low/high for one case.
5. **Debug:** binary search uses `high = middle - 1` while other logic assumes a half-open range. Find a small counterexample and repair the invariant consistently.
6. **Design:** choose structures for deduplicating imported IDs, counting requests by owner and processing dependency-ready jobs. Include duplicate/cycle/size assumptions.
7. **Implement:** compare lowerBound to a linear first-at-or-after oracle across empty/sorted/duplicate-rich inputs. Explain O(log n) time and O(1) auxiliary space under the stated array access model.

## Interview discussion

- “How do you prove this loop terminates?” Follow-up: which measure decreases each iteration?
- “Why not optimize every O(n²) snippet immediately?” Follow-up: consider actual n, I/O, clarity and measured importance.

Check the [scenario guide](../review/scenario-guide.md) after producing your own examples.
