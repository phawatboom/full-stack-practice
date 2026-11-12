# 03 — Asynchronous code and runtime behavior

**Goal:** predict execution and handle failures instead of treating async code as magic. **Prerequisite:** 02. **Practice-plan link:** W1-D5, W2-D4.

## Lesson

A JavaScript runtime executes synchronous work on a call stack and arranges callbacks for asynchronous completions. Promises schedule reactions after current synchronous work completes. A timer delay is a minimum scheduling delay, not a promise to execute at that exact time. Runtime details differ between browsers and servers, so avoid reasoning from timer folklore.

An `async` function returns a promise. `await` pauses that function's continuation, not the whole process. A CPU-heavy loop still blocks the thread running it; adding `async` does not make the loop parallel. Server processes also have memory, sockets, connection pools and finite CPU. Too much concurrent work can exhaust those resources even if every call is asynchronous.

Start independent operations together only when their load and failure behavior are acceptable. `Promise.all` rejects when one input rejects, but does not automatically cancel other operations. `Promise.allSettled` lets you inspect each outcome when partial results are useful. Dependent writes may need a database transaction rather than a collection of parallel promises.

Handle errors at a boundary that can make a decision: retry, translate to an HTTP error, or inform the user. Swallowing an exception creates false success. Retrying every failure creates repeated load and potentially repeated writes. Cancellation can stop waiting or abort supported I/O, but does not prove that a server rolled back a write already received.

## Worked example

```js
export async function loadSummary(fetchProfile, fetchCounts) {
  const [profile, counts] = await Promise.all([
    fetchProfile(),
    fetchCounts(),
  ]);
  return { profile, counts };
}
```

This assumes both calls are independent and both results are required. If a missing profile means counts must never be requested, this structure does not satisfy the requirement.

## Required reading

- [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises): chaining, error propagation and composition.
- [MDN: Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch): cancellation and response handling. Distinguish request failure from an HTTP error status.

## Task

Create delayed fake functions in separate modules for a profile and request counts. Compare sequential vs concurrent execution, inject one failure, and write what continues running after a rejection. Then implement a “latest search wins” function with controlled completion order.

**Acceptance:** no unhandled promise rejection; tests control completion instead of relying on fragile sleep durations; stale results cannot replace the latest result; you can explain why cancellation is not transaction rollback.

## Quiz

1. Does `await` block every request handled by a server? What kind of work can still block it?
2. One member of `Promise.all` fails. What happens to the other operations?
3. Why is automatically retrying a timed-out create request potentially unsafe?

## Walkthrough: a promise that escaped

```js
// Incorrect when the caller must wait for every write:
items.forEach(async item => {
  await save(item);
});
console.log('finished');
```

`forEach` does not await the promises returned by its callback. “Finished” means callbacks were started, not writes completed. A rejection can escape the caller's intended error handling.

For dependent or deliberately sequential writes, use a `for...of` loop with `await`. For a small independent batch, `await Promise.all(items.map(save))` waits for the aggregate, with its documented failure behavior. For a very large batch, neither unbounded parallelism nor forced sequential work is automatically right: use a bounded concurrency mechanism if required by resource limits. Do not hold a database transaction open while awaiting slow unrelated external work.

## Techniques and patterns

- **Return/await the promise chain:** a caller cannot wait for work that you start and discard. An intentional background action needs lifecycle/error/durability handling.
- **Use `finally` for cleanup:** clear resources or loading state on both success and failure, but ensure old work cannot clear the current request's loading flag.
- **Model partial success explicitly:** if two independent panels may load separately, represent their outcomes separately rather than forcing all-or-nothing behavior.
- **Distinguish timeout, abort and failure:** these are observations at the caller, not proof that a remote write was undone.
- **Control time in tests:** deferred promises let you choose completion order. Real sleeps make a race test depend on machine speed.

Real use: bulk imports, dashboard panels, search, file processing and shutdown routines all need clear ownership of asynchronous work.

## Connections

Async ordering becomes a [browser race](../02-frontend/08-client-server-data.md), database concurrency requires [atomic writes](../03-backend-data/12-migrations-transactions.md), and uncertain outcomes motivate [idempotency](../04-security/15-api-reliability.md). See the deferred-promise tests in [executable examples](../examples/README.md). Read composition/error handling in [MDN promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

## Scenario practice — Q4–Q7

4. **Predict:** in the `forEach` example, can “finished” print before all saves complete? Can wrapping that `forEach` in `await` repair it? Explain why.
5. **Debug:** search A begins, search B begins, B succeeds, A fails, and A's `finally` sets global loading to false. Which state updates should belong to A? Define a request-generation policy covering success, error and cleanup.
6. **Design:** an import has 50,000 records and a database pool of 10 connections. Compare sequential work, 50,000 promises, and bounded concurrency. Explain what you would measure.
7. **Implement:** load two optional panels and return both outcomes without losing the successful one. Test both-success, one-failure and both-failure with controlled promises.

## Interview discussion

- “What does `async` change about a function?” Follow-up: does it make a CPU-heavy loop parallel?
- “Why can an early rejected `Promise.all` still leave work running?” Follow-up: how would that affect transaction/error handling?

Use a timeline rather than guessing exact milliseconds. Check the [scenario guide](../review/scenario-guide.md) afterward.
