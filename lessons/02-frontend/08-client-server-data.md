# 08 — Make browser/API integration reliable

**Goal:** handle network behavior and keep UI state honest. **Prerequisites:** 07 and 09; read 09 first if needed. **Practice-plan link:** W1-D5, W2-D3–D5.

## Lesson

Browser state and server state have different lifetimes. A form draft belongs to the user until submitted; persisted records may change through another browser. A server-data cache needs a policy for freshness, invalidation and identity. A key containing search but omitting status or account identity can return the wrong view. Clear or partition sensitive cached data when identity changes.

`fetch` can resolve even when the response is a 4xx/5xx. Check status and parse the expected response carefully; a proxy may return HTML instead of your normal JSON. Distinguish invalid input, expired identity, forbidden action, missing resource, conflict and temporary server failure so the user can take an appropriate action. Error text should not leak stack traces or secrets.

Slow networks reveal races. If search A starts before search B but finishes later, A must not replace B. Cancel supported requests and/or ignore results that no longer belong to the active query. A debounce reduces request volume; it does not establish response ordering. A cancelled write may still have reached the server.

Optimistic UI changes the screen before confirmation and needs reconciliation on failure or conflict. For your first implementation, waiting for confirmation can be easier to reason about. `localStorage` is synchronous, readable by same-origin scripts, and not a source of authorization. Store harmless preferences there; select authentication storage through the security model rather than habit.

## Worked example

```js
export async function getRequests(signal) {
  const response = await fetch('/api/requests', { signal });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}
```

This is a small transport example, not a complete client. Production code also needs a response contract, safe error translation, session behavior, and protection against stale results at the caller.

## Required reading

- [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch): checking status, response parsing, credentials and aborting.
- [Vite environment variables](https://vite.dev/guide/env-and-mode): understand which values become browser-visible. A frontend API key is not secret just because it came from an environment file.

## Task

Implement a search/filter page with loading, empty, failure and retry states. Force two requests to complete in reverse order. Sign out while a request is in flight. Reload a deep-linked filtered URL.

**Acceptance:** no stale/account-inappropriate results appear; failed saves preserve drafts; retry is deliberate; filters round-trip through the URL; tests control completion order. Document whether data caching is needed yet.

## Quiz

1. Why does `fetch` need an explicit HTTP status check?
2. Why is debouncing insufficient to prevent stale results?
3. Which query inputs and identity boundaries must your cache policy account for?

## Walkthrough: an older response must lose authority

```text
t0: query A starts with generation 1
t1: query B starts with generation 2
t2: B succeeds → generation 2 is current → display B
t3: A succeeds/fails → generation 1 is obsolete → ignore its UI updates
```

Guard success, failure and cleanup, not just data assignment. Otherwise an old failure can replace a current success with an error, or an old `finally` can clear a newer loading state. When identity changes, invalidate the old generation even if the query text is unchanged. Cancellation reduces waste when supported; the identity/generation policy establishes which result may affect the screen.

## Techniques and patterns

**Encode query state deliberately:** use `URLSearchParams` rather than manually joining strings. Validate parsed status/page values. Reset or clamp pagination when filters change according to a documented rule.

**Classify recovery:** validation errors need correction, 401 may require signing in, 403 needs a permissions explanation, 409 needs reconciliation, and a temporary outage may permit retry. Keep drafts where recovery needs them.

**Reconcile after mutations:** a new row may not match the current filter or page ordering. Refetch/invalidate the affected list or update the cache according to its actual semantics; blindly append is not universally correct.

**Optimistic actions need rollback scope:** removing a row before confirmation may be appropriate, but a later retry or another concurrent action can make “restore the old entire array” overwrite newer changes. Start pessimistically when simplicity wins.

**Know error boundary limits:** a React render error boundary does not automatically handle rejected event-handler promises. Use the framework's documented route/load/error mechanisms and explicit event-level handling.

Real use: an apparently successful save must reflect the server's committed record, including server-normalized values and generated fields.

## Connections

UI races are [async ownership](../01-foundations/03-async-runtime.md). Retry safety is [API idempotency](../04-security/15-api-reliability.md). URL and response details come from [HTTP](../03-backend-data/09-web-http.md). Test the timeline using [controlled promises](../examples/README.md), then use [the browser lab](../labs/03-browser-integration.md).

## Scenario practice — Q4–Q7

4. **Predict:** search A is active, logout occurs, then A succeeds. Why can a query-text-only stale check still expose old data?
5. **Debug:** the API returns 204 after delete, but the UI reports a failure from `response.json()`. Identify the successful operation and failing client assumption. How could blind retry worsen the experience?
6. **Design:** a user creates a request while viewing page 3 filtered to resolved requests. Choose whether to navigate, refetch, show confirmation or insert locally, and defend consistency.
7. **Implement:** cover old-success/new-success, old-error/new-success and identity-change timelines in deterministic tests. Verify obsolete cleanup cannot alter the current loading state.

## Interview discussion

- “How do you avoid stale search results?” Follow-up: what about stale errors and logout?
- “When would you use optimistic UI?” Follow-up: show exactly what is rolled back without deleting a later successful action.

See the [scenario guide](../review/scenario-guide.md) after your attempt.
