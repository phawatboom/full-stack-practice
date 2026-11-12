# Lab 03 — Network failures across UI and API files

**Topics:** 05–10, 13, 16. **Budget:** 2–3 hours in ClientDesk implementation time. **Requires:** your working frontend/API and a controlled test environment.

## Brief

“Clients say search sometimes shows the wrong results, and Save loses their writing when the connection drops.”

## Before coding

Map the search input, URL state, API client, query key (if any), route, authorization predicate, repository query and rendering. List which parts actually own loading, draft and confirmed state. Do not add a query library merely to avoid understanding the existing flow.

## Reproduce four cases

1. Start search A, then B. Hold A's response until B completes. The final page must show B.
2. Submit a request and force a network failure. The draft remains; the UI cannot claim successful persistence without confirmation.
3. Return a structured 400 and then a non-JSON 502 from a proxy-like stub. Both produce useful feedback without crashing response parsing.
4. Expire the session or sign out while a request is in flight. Sensitive data must not reappear for the wrong identity.

Use test interception or controllable fake promises. For writes, distinguish “request never reached server” from “commit succeeded but response was lost.” The second case needs a retry/duplicate policy, not just form preservation.

## Deliver

- Reproduction and evidence for each case.
- Focused fix in the responsible module(s).
- Component/network tests for draft retention and deterministic ordering.
- One real browser journey and a keyboard check.
- Explanation of cancellation, stale-result handling, retry policy and cache identity.

**Done:** tests fail for the old defect and pass after repair; no arbitrary sleeps; unauthorized rows remain excluded; filters can be revisited through a URL. Keep transport simulations distinct from evidence gathered through the real running API.
