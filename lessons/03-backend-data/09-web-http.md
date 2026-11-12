# 09 — Understand the web between your files

**Goal:** explain a browser request beyond “the API was called.” **Prerequisite:** 03. **Practice-plan link:** W1-D3–D5.

## Lesson

A URL identifies a scheme, host, port, path and other components. DNS resolves a host to connection information; a transport connection carries data; HTTPS uses TLS to protect traffic in transit and authenticate the server through certificates. Reverse proxies and CDNs can sit between browser and application. A database failure, TLS problem and bad route can all appear to a user as “the page doesn't work,” but require different evidence.

HTTP requests carry methods, headers and sometimes bodies; responses carry status, headers and optionally bodies. Use GET for reads without application state changes, POST for creation/actions, PATCH for defined partial updates and DELETE for removal according to the API contract. Idempotent means repetition has the same intended effect, not that every response is byte-for-byte identical. A 204 response has no content to parse as JSON.

Browsers enforce origin rules. An origin includes scheme, host and port. CORS controls browser access to cross-origin responses; it is not server authorization and does not prevent a command-line client from sending a request. Some requests cause a preflight. Cookie credentials, allowed origins and server policy must agree; “allow everything” is not a considered authentication design.

Cookies have scope and attributes affecting when the browser sends them. `HttpOnly` prevents normal script access to a cookie but does not stop injected scripts making actions as the user. `Secure` limits transport to secure contexts; SameSite affects cross-site sending and is not a complete CSRF policy by itself.

Caches can exist in the browser, proxy/CDN and application. Choose freshness and validation rules deliberately, especially for personalized responses. Understand the difference between `no-store` and revalidation rather than disabling caches by folklore. Compression reduces transfer size, not database execution time.

## Worked trace

```text
URL / DNS / TLS
  → reverse proxy routes /api/requests
  → API checks session, validates, executes query
  → HTTP 200 with JSON and chosen cache headers
  → browser permits access under origin/CORS rules
  → client parses response and updates UI
```

## Required reading

- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview): requests, responses and intermediaries.
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): preflight and credentialed requests.
- [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching): freshness vs validation; private data.

## Task

Inspect a successful save and a failed API call in browser network tools. Record method, URL, status, relevant headers, payload and timing without exposing credentials. Compare browser and command-line behavior on a cross-origin request. Explain the difference rather than disabling security controls.

**Acceptance:** trace identifies which layer failed; statuses match the contract; a personalized response has an intentional caching policy; you can explain why a cookie or preflight was involved.

## Quiz

1. Are `https://example.com` and `http://example.com` the same origin?
2. Why does CORS not stop an attacker calling your API outside a browser?
3. What differs between retrying a read and retrying a create after a timeout?

## Walkthrough: conditional reads and writes solve different problems

A server can return an ETag describing a representation. On a later read the client may send `If-None-Match`; if the representation is unchanged, a 304 response lets the client reuse cached content under the relevant caching rules. The 304 itself is not a fresh JSON body to parse.

A conditional write may instead use `If-Match` with a suitable strong validator to prevent replacing a version the caller did not read. A failed precondition normally uses 412. Your application may instead send a version field and use a documented 409 conflict contract. Do not mix these mechanisms or status codes without defining which contract is in use. Read [MDN conditional requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests) for the distinction.

```http
GET /api/requests/r1 HTTP/1.1
If-None-Match: "request-r1-v3"

HTTP/1.1 304 Not Modified
ETag: "request-r1-v3"
```

This is a representation-validation example, not a permission bypass. Authentication and cache privacy still apply; an identifier/version alone does not authorize access.

## Techniques and patterns

- **Separate origin from site:** different subdomains can be different origins while some cookie SameSite decisions use site concepts. Do not assume these words are interchangeable.
- **Classify the failure layer:** DNS/TLS connection errors occur before an application HTTP response; a 404/502 is a response with a potentially different producer. Inspect headers and infrastructure logs.
- **Prefer one origin when suitable:** a frontend and reverse-proxied API on one origin can simplify browser configuration. It does not remove authentication, authorization or CSRF requirements.
- **Know cache directives:** `no-cache` permits storage but requires validation before reuse; `no-store` directs caches not to store. Personalized data needs a deliberate browser/shared-cache policy.
- **Define HTTP semantics:** if DELETE of an already-absent record returns 404, that does not by itself make the intended delete effect non-idempotent.

Real use: these distinctions explain why a request works with a command-line client but fails in a browser, why cached content looks stale, and why an edit conflicts.

## Connections

Conditional writes connect to [database version predicates](12-migrations-transactions.md). Cache partitioning connects to [client identity](../02-frontend/08-client-server-data.md). Cookie attachment connects to [CSRF](../04-security/14-web-security.md).

## Scenario practice — Q4–Q7

4. **Predict:** can a `Cache-Control: no-cache` response be stored? Why is “no-cache means never store” an unsafe interpretation for sensitive data?
5. **Debug:** a command-line GET succeeds but browser JS cannot read it. Give a diagnostic sequence covering origin, credentials, preflight and response headers without assuming the server is unreachable.
6. **Design:** choose HTTP/error/cache behavior for a private detail page, a public static asset and a conflicting edit. State which rules differ and why.
7. **Implement:** capture real headers for one request, then add a conditional-read or versioned-write test in a controlled API. Show that an unauthenticated caller still cannot obtain private data through the conditional path.

## Interview discussion

- “Explain what happens after entering a URL.” Follow-up: where can a reverse proxy or cache respond without the application running a query?
- “Safe vs idempotent methods?” Follow-up: why might two DELETE responses differ while the intended effect remains idempotent?

Use the [scenario guide](../review/scenario-guide.md) to check distinctions rather than memorize status lists.
