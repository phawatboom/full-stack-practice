# 17 — Debug using evidence, then make the next failure easier

**Goal:** locate a cause systematically and report it clearly. **Prerequisite:** 16. **Practice-plan link:** W3-D3/D6.

## Lesson

Start with expected behavior, actual behavior, affected users and a repeatable trigger. A screenshot is a symptom; a reproduction is a sequence plus the relevant state. Reduce the case while preserving the failure. Record environment, code version, inputs and timing conditions. Do not paste tokens or real user data into a bug report.

Trace the system in order: browser action, network request, server route, identity/validation, query, stored result, response and rendering. Use breakpoints to inspect actual values and call stacks. Use browser network timing to distinguish waiting for a response from slow rendering. Read the first meaningful exception and its cause rather than changing unrelated code until the error disappears.

Write competing hypotheses and the observation that distinguishes them. “Save runs twice because React is broken” is weak. “The network tab shows two POSTs for one click” narrows the scope. “Only one POST arrived but two rows were inserted” points elsewhere. When the evidence changes, update the hypothesis instead of defending it.

Observability makes this investigation possible. Structured logs can include a request ID, route, outcome, duration and safe error category. Metrics summarize rates, latency and failures; traces connect work across components. Logs are not a place for passwords, session cookies or whole bodies by default. A request ID connects a user's error report to internal evidence without exposing internals to the user.

During an incident, prioritize impact reduction, evidence preservation and communication. A rollback may help if application/schema compatibility permits. Do not run destructive repair commands based on guesswork. An incident report describes observations, impact, contributing factors and preventive work without inventing certainty.

## Worked investigation

```text
Symptom: Save spinner never finishes after session expiry.
Hypothesis A: server hangs → inspect whether response arrives.
Hypothesis B: UI ignores 401 → inspect completed response and state branch.
Evidence: 401 arrives in 80 ms; loading remains true.
Next check: error handling and finally/cleanup for the active request.
```

This is a teaching scenario, not a diagnosis of your application.

## Required reading

- [Playwright best practices](https://playwright.dev/docs/best-practices): browser traces and debugging failing tests.
- [Node security guidance](https://nodejs.org/learn/getting-started/security-best-practices): use its resource-exhaustion discussion to distinguish blocked CPU from slow I/O.
- Your browser developer tools' official breakpoint/network documentation when a tool is unfamiliar.

## Task

Investigate one UI and one API defect using separate hypotheses. Add safe request correlation, reproduce a controlled database outage, and produce a short incident report. Use the [release/incident lab](../labs/04-release-incident.md).

**Acceptance:** root cause supported by observations; focused fix; meaningful before/after regression; no sensitive logs; report says what remains uncertain.

## Quiz

1. What observation separates double submission from double insertion?
2. What belongs in a useful request log, and what should usually be omitted?
3. Why should you not immediately assume a rollback is safe?

## Walkthrough: narrow the fault with a boundary table

Complaint: “The wrong title appears after Save.” Record evidence at each boundary rather than changing random state setters.

| Observation | Next hypothesis |
| --- | --- |
| Form already contains wrong title | Draft identity/input handling |
| Form right, outgoing body wrong | Submit serialization/closure |
| Body right, row wrong | Validation/mapping/query/concurrency |
| Row right, response wrong | Response mapping or stale read |
| Response right, UI wrong | Cache/identity/rendering race |

This approach resembles a binary search through the data path: find the earliest boundary where actual values diverge from expected values. It is an investigation strategy, not permission to inspect sensitive production values indiscriminately.

## Techniques and patterns

- **Make a hypothesis falsifiable:** “the server is slow” becomes “request time is dominated by database waiting; compare route and query timings.”
- **Reduce one variable at a time:** same user, data, version and input with one changed condition provides interpretable evidence. Changing dependencies, configuration and code together obscures causality.
- **Correlate safely:** record a generated/trusted correlation ID across route logs and returned error metadata. Validate any incoming ID you choose to accept; do not let arbitrary input forge multiline logs.
- **Prefer durations for performance:** use an appropriate monotonic timer for elapsed work; wall-clock timestamps can shift. Use consistent timestamps for event correlation.
- **Avoid high-cardinality metric labels:** one time series per request ID can overwhelm a metrics system. IDs fit logs/traces; route/outcome categories often fit aggregate metrics.
- **Separate mitigation from repair:** disabling a broken optional feature may reduce impact before the root cause is fully understood. Document what the mitigation does and does not establish.

Real use: clear investigation notes let another engineer continue where you stopped and let clients distinguish observed impact from a proposed explanation.

## Connections

[Repository navigation](../01-foundations/01-workspace-git.md) locates the path, [testing](16-testing.md) captures the cause, [performance](18-performance.md) supplies measurements and [release management](../06-delivery/19-runtime-deployment.md) supplies version evidence.

## Scenario practice — Q4–Q7

4. **Predict:** the database row and API response are correct but the UI is wrong. Which layers remain plausible, and which proposed SQL changes lack evidence?
5. **Debug:** errors appear only after deploy and only on one instance. Give an ordered check covering artifact identity, configuration, migration state and instance-local caches.
6. **Design:** define a safe structured error event and a client support reference. Explain which fields belong in logs versus low-cardinality metrics.
7. **Implement:** investigate one existing defect using a boundary table and two falsifiable hypotheses. Add the smallest regression and provide before/after observations with synthetic data.

## Interview discussion

- “Tell me about a difficult bug.” Follow-up: what evidence ruled out your first hypothesis?
- “The page is slow; where do you start?” Follow-up: what would make you stop investigating the database and inspect rendering?

The [scenario guide](../review/scenario-guide.md) rewards a justified investigation even when the initial hypothesis was wrong.
