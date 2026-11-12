# 15 — Retries, duplicates and external dependencies

**Goal:** design for uncertain outcomes and bounded failure. **Prerequisites:** 03, 12–14. **Practice-plan link:** W3 debugging; optional stretch after core gates.

## Lesson

A timeout means the caller did not receive a result in time. It does not establish whether a server committed the operation. Retrying a read is often acceptable; retrying an unprotected create can produce duplicates. Disabling a browser button helps one interaction but does not cover network retries, multiple tabs or a client reconnecting after a lost response.

Idempotency can associate a logical operation with a stable key scoped to the authenticated caller and operation. Reusing a key should follow a defined contract: return the original outcome, reject a different payload, and handle concurrent first attempts atomically. A key stored only in process memory is lost on restart and cannot coordinate multiple instances. Unique database constraints can enforce part of the policy.

For external calls, choose timeouts, bounded retry counts and backoff with jitter where appropriate. Retry only eligible failures according to the provider's contract, and honor rate-limit guidance. Limit concurrency so a failing dependency does not consume every connection or worker. Some operations should fail fast; a queue helps only if delayed completion fits the product.

Rate limits need identity/scope, a cost model and useful responses. A distributed deployment cannot rely on independent per-process counters if it needs a global limit. Treat forwarded client IP headers according to trusted proxy configuration; arbitrary incoming headers are not verified identity.

Webhook deliveries are commonly repeated and may arrive out of order. Verify authenticity using the provider's prescribed signature process, store a delivery identity where needed, process idempotently, and separate receipt from durable completion if work is long. Do not claim exactly-once execution merely because the first demo worked.

## Worked failure timeline

```text
Client sends create with key K
Server commits row and recorded outcome
Response is lost
Client retries with key K
Server returns the recorded outcome rather than creating a second row
```

The row and idempotency record need a coherent atomicity design. Writing one without the other leaves a failure window.

## Required reading

- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview): connect methods/responses to your retry policy.
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html): concurrent writes and retries.
- If using an external API, its official idempotency, webhook signing, rate-limit and timeout guidance. Record the exact contract; providers differ.

## Task

First diagram a lost-response duplicate scenario. Then design a durable idempotent create or an idempotent fake webhook handler. Include same-key/same-payload, same-key/different-payload and simultaneous attempts. A paper design is acceptable before implementing durable storage.

**Acceptance:** bounded retries; defined key scope/retention; atomic uniqueness; test or detailed interleaving for concurrent attempts; no external message sent twice under the stated replay policy. Label guarantees you have not implemented.

## Quiz

1. What can a timeout tell you about whether a write committed?
2. Why is an in-memory deduplication set insufficient across two server instances?
3. Why can a queue retry create a duplicate external side effect?

## Walkthrough: a retry is the same operation only if identity survives

```text
Attempt 1: actor A, operation create-request, key K, payload P
  → commit request + outcome for (A, create-request, K)
  → response lost
Attempt 2: same A, operation, K and P
  → return recorded outcome
Attempt 3: same key but payload Q
  → reject under the documented key-reuse policy
```

Generating a new key on every retry defeats deduplication. Reusing one key for every future create incorrectly merges unrelated operations. The client needs a stable logical-operation identity, while the server needs durable atomic coordination and a defined retention policy. If keys expire, explain what guarantee ends at expiry.

## Techniques and patterns

- **Retry only classified failures:** invalid input and forbidden access normally need correction, not another attempt. A transient error is retryable only if repeating that operation is safe under its contract.
- **Bound the whole budget:** per-attempt timeout plus multiple retries/backoff can exceed the user's overall deadline. Track attempts and elapsed budget, and stop when work is no longer useful.
- **Add jitter where many clients retry:** synchronized retries can create periodic load spikes. Do not use a hardcoded immediate retry loop during an outage.
- **Keep atomicity honest:** recording success after an unrelated committed write leaves a crash gap. A unique key constraint alone does not establish that the result and business change are recorded together.
- **Handle long external operations asynchronously only if appropriate:** a 202 response means accepted for processing, not completed successfully. Provide a job identity/status and a defined failure path when delayed work is part of the contract.
- **Treat repeated/out-of-order webhooks separately:** deduplication stops repeated events; it does not resolve an older event arriving after a newer one. Use the provider/domain ordering contract.

Real use: flaky mobile networks, payment-like provider calls, email jobs and imports all produce uncertain outcomes even when no developer wrote an obvious double-click bug.

## Connections

The design uses [database uniqueness/transactions](../03-backend-data/12-migrations-transactions.md), affects [browser retry UX](../02-frontend/08-client-server-data.md), and needs [observability](../05-quality/17-debugging-observability.md). Background delivery is extended in [lesson 22](../07-engineering/22-files-time-integrations.md).

## Scenario practice — Q4–Q7

4. **Predict:** the server commits, loses the response, then restarts. Compare retries with an in-memory key set, a new client key, and a durable same-key outcome.
5. **Debug:** a service retries every 400/401/429/500 immediately. Identify the distinct policies needed and which provider-specific details must be checked.
6. **Design:** specify an idempotent create contract: key scope, payload mismatch, simultaneous attempts, stored outcome, expiry and client retry behavior. Draw the commit boundary.
7. **Implement:** test same-key replay, different-payload reuse and two simultaneous attempts in a disposable database or a clearly labeled design simulation. Explain what your test cannot prove about real external delivery.

## Interview discussion

- “Can you guarantee exactly-once processing?” Follow-up: distinguish durable intent, delivery attempts and externally visible effects.
- “When would you add a queue?” Follow-up: what user-visible behavior and operational work comes with it?

Use the [scenario guide](../review/scenario-guide.md) to assess guarantees rather than terminology.
