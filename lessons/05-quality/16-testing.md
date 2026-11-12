# 16 — Test behavior at the boundary that can break

**Goal:** select useful tests rather than maximizing an arbitrary count. **Prerequisites:** 07, 10–13. **Practice-plan link:** every definition of done.

## Lesson

A unit test exercises a focused rule with controlled inputs. An integration test checks cooperating parts such as route/authorization/database. A component test checks the UI through interactions. An end-to-end browser test covers a whole journey in a running system. These boundaries offer different evidence and costs. There is no universal percentage of each that every app should meet.

Put a pure status-transition rule under a small fast test. Put ownership enforcement under server integration tests with real request handling. A mocked repository that always returns authorized data cannot prove the real query is scoped correctly. A browser journey verifies wiring but is a slow way to exhaustively test every validation boundary.

Tests should assert observable outcomes, not private helper names or the exact order of implementation calls unless order is part of the contract. UI tests should find controls by meaningful roles/labels and interact as users do. Stable tests isolate data and control external services, clock and asynchronous completion. Fixed sleeps turn timing assumptions into flaky failures.

Regression testing starts with evidence: reproduce a bug, add a test that fails for the old behavior, fix the cause, and show the test passes. A passing test that would also pass before the fix proves little about that regression. Coverage identifies unexecuted lines; it does not establish that assertions catch incorrect results.

## Worked test specification

```text
Given: client A and client B each own a request
When: A sends PATCH for B's request directly to the API
Then: access is denied under the chosen disclosure policy
And: B's stored title remains unchanged
And: the response contains no B-only data
```

Check the database postcondition as well as the status. A handler can return an error after already making an unauthorized write.

## Required reading

- [Testing Library guiding principles](https://testing-library.com/docs/guiding-principles/): user-visible interaction.
- [Playwright best practices](https://playwright.dev/docs/best-practices): isolation, locators and waiting for behavior.
- [Node test runner](https://nodejs.org/api/test.html): basic assertions/test execution for the dependency-free lab. Use your installed runtime's docs if API details differ.

## Task

For one feature, write a test matrix: normal, boundary, denied, failure and concurrency cases. Implement a small rule test, a permission integration test and one browser journey. Complete the [multi-file lab](../labs/01-request-flow/README.md).

**Acceptance:** isolated fixtures; no arbitrary sleeps; real behavior checked at appropriate boundaries; demonstrate at least one test fails on a deliberate regression; commands and results recorded. Do not add tests merely asserting a framework renders static text unchanged.

## Quiz

1. Why can a fully mocked database test miss an ownership leak?
2. What does 100% line coverage fail to prove?
3. How would you make a stale-search test deterministic without sleeping?

## Walkthrough: a denial response can still hide a bug

```text
Arrange: B owns a request with title 'Original'
Act: A sends a direct update with title 'Changed'
Assert: response follows denial policy
Assert: stored title is still 'Original'
Assert: response/logs do not reveal B-only content
```

Why the second assertion? A broken route might update first, then check permission and return 403. A test checking only status passes despite unauthorized modification. Assertions must protect the invariant, not only the route's superficial response.

## Techniques and patterns

**Arrange → act → assert:** make the preconditions and one intended behavior obvious. Fixtures should expose only meaningful differences; two users accidentally sharing an owner ID invalidates an isolation test.

**Table-driven cases:** title lengths 0, 1, 120 and 121 are distinct boundaries. Add whitespace-only, wrong type and your documented Unicode semantics. Avoid dozens of arbitrary examples while missing the actual boundary.

**Control sources of nondeterminism:** inject a clock for due dates, IDs where identity matters, fake external services and deferred completion for races. A fake must not replace the very security/query logic you aim to prove.

**Use the right UI query:** Testing Library's `getBy...` finds an expected present element synchronously, `queryBy...` supports absence checks, and `findBy...` waits/retries for appearance. Prefer meaningful roles/names where appropriate. Read [query behavior](https://testing-library.com/docs/queries/about/) and check your chosen tool's exact API.

**Prove sensitivity to the defect:** temporarily introduce the old bad predicate in an isolated copy and confirm the regression test fails. Restore it afterward. This is a targeted confidence check, not an excuse to mutate shared working code carelessly.

Real use: useful tests let you change several files confidently because they assert contracts at the boundaries that can actually fail.

## Connections

[Authorization](../04-security/13-authentication-authorization.md) supplies denied cases, [debugging](17-debugging-observability.md) supplies regressions, and [CI](../06-delivery/20-ci-dependencies.md) repeats them. [Executable examples](../examples/README.md) show controlled asynchronous tests; the [multi-file lab](../labs/01-request-flow/README.md) deliberately demonstrates an omitted test.

## Scenario practice — Q4–Q7

4. **Predict:** a test mocks `repository.update` to return success, then expects 403. Which persistence/ordering problems could remain undetected?
5. **Debug:** a UI test passes alone but fails after another test. Propose fixture, global state, timer, mock and storage hypotheses and a sequence to narrow them down.
6. **Design:** choose the smallest useful test set for “clients cannot edit resolved requests,” including a concurrent status change. Which check must use real database behavior?
7. **Implement:** write a table of boundaries and one permission regression that checks stored state. Demonstrate failure for the old behavior and success after correction; do not change assertions to accommodate the defect.

## Interview discussion

- “What should you mock?” Follow-up: what evidence is lost when you mock that dependency?
- “How do you handle flaky tests?” Follow-up: why can adding retries or longer sleeps hide the real problem?

Use the [scenario guide](../review/scenario-guide.md) for minimum meaningful evidence.
