# 18 — Measure before changing performance

**Goal:** identify the actual bottleneck and verify an improvement. **Prerequisites:** 08, 11, 17. **Practice-plan link:** W3-D2.

## Lesson

Performance is behavior under a workload. Define the user operation, data size, concurrency, device/network, environment and success/error conditions. An average can hide slow tail responses; record repeated observations and appropriate percentiles when you have enough samples. One local run is not proof of production capacity.

Follow latency through the system. A slow list might come from an N+1 query pattern, missing index, unbounded rows, slow network, large JavaScript bundle or excessive rendering. Fixing CSS will not repair a database scan. Caching may reduce repeated work but introduces freshness and identity risks; eliminate accidental work and bound results first.

Use a representative query with PostgreSQL EXPLAIN. Estimated cost is not milliseconds. EXPLAIN ANALYZE executes the query and adds actual measurements; writes can really change data, and even a transaction rollback does not erase every possible external effect. Use a disposable environment for experiments. Compare plans and results, not only elapsed time. Indexes can improve reads while slowing writes and consuming space.

In the browser, separate loading, responsiveness and layout stability. Core Web Vitals currently use LCP, INP and CLS; read current definitions rather than memorizing an old score. Lab measurements help reproduce problems; field data reflects actual users. Development builds and powerful laptops can hide production issues. Memoization should address measured work or preserve a justified contract, not appear in every component by default.

## Worked measurement record

```text
Operation: staff list, filtered by unresolved status
Dataset: 10,000 synthetic requests; distribution recorded
Environment: local app + local DB; hardware/runtime recorded
Before: query plan + repeated request timings + result checksum
Change: one justified index/query adjustment
After: same workload, timings, plan and correctness checks
Limit: no production network or concurrent-client evidence
```

## Required reading

- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html): estimates vs actual execution and scan types.
- [Web Vitals](https://web.dev/articles/vitals): definitions and lab/field measurement.
- [React effects guidance](https://react.dev/learn/you-might-not-need-an-effect): recognize unnecessary work from redundant state synchronization.

## Task

Investigate one slow endpoint and one slow interaction. Make one change only after gathering evidence. Verify authorization, ordering and result correctness still hold under the same inputs.

**Acceptance:** comparable before/after evidence; realistic data distribution; no invented capacity claim; trade-off recorded; a decision to leave working code unchanged is acceptable if measurements support it.

## Quiz

1. Why is an average response time sometimes misleading?
2. What is dangerous about treating EXPLAIN ANALYZE as a read-only description?
3. Why could a cache improve speed while introducing a data leak?

## Walkthrough: the browser is not waiting for React

Suppose a list takes 1,200 ms: 900 ms waiting for the API, 200 ms transferring/parsing data and 100 ms rendering. These are hypothetical numbers, not measurements of ClientDesk. Even eliminating all rendering work saves at most that 100 ms in this simplified sequential breakdown. Start with evidence about the dominant portion.

If the API performs one query for 50 requests and then one query per owner/comment count, query count grows with page size. Replace the repeated access with suitable joins, batching or aggregated queries while keeping one-row-per-request semantics. A giant join that creates duplicates before LIMIT is not a correct optimization.

## Techniques and patterns

**Use a performance budget tied to a scenario:** dataset, device/network, concurrent load, warm/cold conditions and success/error rate belong with the target. A fast response that drops work or leaks rows is not success.

**Inspect actual vs estimated rows:** a query planner's inaccurate row estimate can affect plan choice. Data distribution and statistics matter. A scan is not automatically bad; fetching a large fraction of a small table may favor it.

**Avoid accidental waterfalls:** independent browser/server reads can sometimes start together; dependent reads cannot. Parallelism changes resource demand, so bound it where needed.

**Bound payloads before polishing code:** pagination, selected columns, sensible image sizes and route-level loading can dominate a micro-optimized array loop. Measure bundle impact before adding a large dependency for one minor control.

**Consider virtualization only when relevant:** rendering a small visible window can help very large lists, but changes keyboard/search/accessibility behavior. Pagination may solve the actual product need more simply.

**Cache with a correctness contract:** define identity scope, key inputs, TTL/invalidation, stale behavior and failure handling before declaring a cache safe.

Real use: performance work often succeeds by removing unnecessary requests/data rather than rewriting every component or buying larger infrastructure.

## Connections

[Async composition](../01-foundations/03-async-runtime.md) affects waterfalls, [SQL grain](../03-backend-data/11-relational-sql.md) preserves results, [browser state](../02-frontend/08-client-server-data.md) controls caching, and [accessibility](../02-frontend/05-html-accessibility.md) constrains UI optimization. Use the official EXPLAIN/Web Vitals readings above for measurement details.

## Scenario practice — Q4–Q7

4. **Predict:** under the simplified 1,200 ms breakdown, what is the maximum total improvement from removing all 100 ms of rendering? What assumptions make that arithmetic useful but incomplete?
5. **Debug:** adding an index changes no plan on a 3-row fixture. Explain why that is not a failed optimization verdict and design a meaningful measurement.
6. **Design:** compare pagination, virtualization and caching for a 50,000-row support list. Include authorization, freshness, accessibility and implementation cost.
7. **Implement:** measure one concrete slow operation, record multiple comparable runs, make one supported change, and verify identical authorized results. Report limitations instead of extrapolating unmeasured capacity.

## Interview discussion

- “How do you optimize a slow endpoint?” Follow-up: what must stay correct after the change?
- “What does an index cost?” Follow-up: when could a sequential scan be a reasonable plan?

Review your evidence with the [scenario guide](../review/scenario-guide.md).
