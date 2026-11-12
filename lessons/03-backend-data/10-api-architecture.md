# 10 — Routes, rules and persistence boundaries

**Goal:** make behavior traceable across backend files without adding unnecessary layers. **Prerequisites:** 04, 09. **Practice-plan link:** W1-D3, W2-D2.

## Lesson

A route translates HTTP into application behavior. It parses request data, obtains verified identity, invokes the operation and translates outcomes into responses. Domain rules describe allowed behavior such as “clients can edit only their own new requests.” Persistence code performs data access. These responsibilities can begin in a few files; split them when readability, reuse or testing actually benefits.

Keep trust boundaries explicit. Request JSON, query strings, path parameters and external service responses are untrusted. Normalize where the contract calls for it, validate types and ranges, and allow only intended fields. Do not spread the entire request body into a database update: that lets callers attempt to change internal fields such as owner, role or version.

Write an error contract the frontend can use. An error code can be stable while user-facing language evolves. Use status codes consistently: malformed/invalid input gets a defined 4xx policy, missing authentication 401, denied access 403 or an intentionally non-disclosing 404 policy, and concurrent stale updates often 409. Internal exceptions should be logged safely and translated into non-sensitive responses.

Bounded work matters: cap page size, request body size and expensive operations. A route that accepts unlimited input is also a capacity decision. Use the framework's documented async error-handling pattern. A controller that catches everything and returns 200 makes monitoring and user recovery harder.

Dependency injection can simply mean passing a repository into a function. It does not require a container or elaborate interface hierarchy. Keep server startup separate from the application factory so integration tests can create an isolated instance.

## Worked contract

```text
POST /api/requests
Body: { title: string, description: string }
Identity: verified session; owner assigned by server
201: { request: { id, title, description, status, createdAt } }
400: { error: { code: 'INVALID_INPUT', fields: {...} } }
401: { error: { code: 'UNAUTHENTICATED' } }
500: { error: { code: 'INTERNAL_ERROR', requestId } }
```

This is one consistent design, not a universal response standard. A team may use a different error shape; preserve its consistency.

## Required reading

- [Node.js security guidance](https://nodejs.org/learn/getting-started/security-best-practices): resource exhaustion and dependency concerns. Translate the risks to your selected runtime.
- Your chosen HTTP framework's official routing, validation and error-handling documentation for the installed version. Record the exact pages and version in your evidence; no framework was imposed on your original plan.

## Task

Write the create/list/detail/update contract before implementation. List files touched by each route, rule and query. Implement one operation with HTTP integration tests and one rule tested independently.

**Acceptance:** server owns ID/identity/internal fields; bad input has useful errors; unknown exceptions do not leak internals; body/page limits exist; application import does not start a listening server.

## Quiz

1. Why should a route not pass an arbitrary JSON body directly to an ORM update?
2. What makes an error code more useful than relying on matching English text?
3. When would you split route/business/persistence code, and when would that be unnecessary?

## Walkthrough: make an update explicit

Suppose a client may update only title/description while its request is new. The route must validate the body; the operation must enforce ownership/status; persistence must avoid a race between checking that status and writing.

```text
requests.routes.ts: parse known fields + obtain verified actor
requests.service.ts: decide permitted operation and expected version
requests.repository.ts: UPDATE with allowed fields and atomic predicates
route: map changed/not-found/denied/stale outcome to documented response
web/requests.api.ts: classify response
RequestForm.tsx: preserve draft or show confirmed server data
```

If status changes after an earlier read, a later unconditional update can violate the business rule. Put applicable conditions in the atomic write, use a suitable transaction/lock, or use another design that preserves the invariant. A separate service file does not automatically provide correctness.

## Techniques and patterns

**Functional core, I/O boundary:** keep a simple pure validation/transition rule testable; make database/network work visible. This pattern is useful when it reduces repeated decision logic, not a requirement to wrap every call.

**Return expected outcomes, throw unexpected failures:** a discriminated result can represent validation/forbidden/conflict; unexpected database failures can propagate to a safe error boundary. Teams differ, so choose a consistent convention and retain useful causes in internal logs.

**Validate query strings as strings:** `Number('')` is 0 and `parseInt('2abc')` is 2. Define accepted syntax and range rather than accepting whatever a conversion happens to produce.

**Map output fields explicitly:** returning an ORM user row can leak password hashes, tokens or internal metadata. Serialize only the response contract.

**Document contract changes:** adding fields may be backward-compatible for some clients, but renaming fields, changing nullability or error behavior can break callers. Inspect actual consumers and their assumptions.

Real use: one client change often touches several modules; explicit contracts let each file change for a clear reason and make failures diagnosable.

## Connections

[TypeScript parsing](../01-foundations/04-typescript.md) defines trusted shapes; [transactions](12-migrations-transactions.md) protect changing invariants; [permission tests](../04-security/13-authentication-authorization.md) prove the policy at the server boundary. Use the [framework readings](../00-start/framework-readings.md) to map these responsibilities to your actual framework.

## Scenario practice — Q4–Q7

4. **Predict:** what do `Number('')`, `Number('2abc')` and `parseInt('2abc', 10)` return? Which should a page-size parser accept under your chosen strict contract?
5. **Debug:** the route checks `status === 'new'`, waits for another query, then updates. Staff resolve the request in between. Show the interleaving and propose a condition that makes the write safe.
6. **Design:** define a PATCH endpoint's allowed fields, null/omission rules, permission policy, conflict response and output mapping. Which changes would break an existing frontend?
7. **Implement:** parse page/limit with explicit integer syntax and bounds. Test empty, negative, fractional, excessive, repeated and malformed parameters according to a documented contract.

## Interview discussion

- “Where does business logic belong?” Follow-up: which invariants also require database enforcement?
- “How would you design API errors?” Follow-up: how does the frontend recover without matching English messages?

Review with the [scenario guide](../review/scenario-guide.md).
