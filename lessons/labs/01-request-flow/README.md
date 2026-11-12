# Lab 01 — Follow a request through multiple modules

**Topics:** 01–04, 10, 13, 16–17. **Budget:** 60–120 minutes. **Prerequisite:** a supported Node.js with `node:test` (verified here with Node 24.19.0). No install, server, credentials or database needed.

This is an in-process simulation, not a production web application. The client calls an injected transport; the route receives a test actor; the repository is in memory. There is no actual HTTP, cookie/session verification, durable persistence, CORS or React here. Those boundaries are the work of the other labs and ClientDesk.

## Run from this folder

```powershell
node demo.mjs
node --test tests/baseline.test.mjs tests/exercise.test.mjs
```

From the repository root, first run `Set-Location lessons/labs/01-request-flow`.

Expected initial state: **9 passing baseline tests and 1 skipped exercise test**. There is **one intentional filtering defect**. The skipped test expresses the missing behavior; remove its skip to reproduce a failure. Baseline green does not mean the implementation is complete.

## File interaction

```text
demo.mjs / tests
  → web/requests-client.mjs      transport and response handling
  → api/requests-route.mjs       simulated route + response mapping
  → domain/requests-service.mjs  validation, permissions and filtering
  → data/memory-repository.mjs   isolated in-memory storage
```

The actor passed to the route is trusted only because this is a local test seam. Never use a caller-submitted actor/role as production authentication. A real app must obtain it from verified session middleware.

## Tasks

1. Draw the import/call path and predict the demo before executing it.
2. Run baseline checks. Remove the exercise test's skip, reproduce the defect and write two hypotheses.
3. Find the cause through actual values. Fix the responsible module without modifying expected behavior to match the bug. Rerun all tests.
4. Add cases for `in_progress`, `resolved`, empty results, client isolation and invalid query status. Check a fix did not remove permission filtering.
5. Feature change: support staff-only status updates. Before coding, list affected files, define validation/not-found/denial behavior, and write a failing test. Clients must not gain write access.

## Acceptance

- Original baseline passes and exercise is enabled/passing after the fix.
- New tests distinguish correct behavior from the original bug.
- Permission checks remain intact; storage snapshots cannot be mutated by a caller.
- Explain the root cause and which real-web boundaries this lab does not test.
- Submit a focused diff and evidence using the lesson template.

The review guide provides investigation hints after your attempt. Do not turn this simulation into your authentication implementation.
