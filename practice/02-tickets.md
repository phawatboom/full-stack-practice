# Daily engineering tickets

Work in order. D1–D5 are 9 hours each, D6 is 5 hours, and D7 is rest. Every ticket also uses the definition of done and submission format in the README. Stretch tasks are optional and come only after the core gate passes.

## Week 1 — Understand and build one vertical slice

### W1-D1: Establish your baseline and product contract

- Complete the 100-minute baseline. Use the remaining study/implementation time to correct gaps after review, initialize Git, and set up the chosen stack.
- Write five user stories and sketch one request's trip through the system.
- Specify title length (1–120 characters after trimming), description limit (2,000 characters), statuses, and error response shape.
- Acceptance: fresh setup starts the UI and API; a health endpoint responds; README lists exact commands and prerequisites. No generated application implementation during the baseline.
- Explain: what TypeScript checks, what it cannot validate at runtime, and why both boundaries matter.

### W1-D2: Build the browser interaction

- Build the request form and list using in-memory state. Add create, edit title/description, status filter, and derived counts.
- Acceptance: blank/whitespace titles fail; input survives validation failure; lists have stable keys; controls have labels and work with a keyboard. Refresh losing data is acceptable today.
- Write tests for title validation and filtering, including empty input and mixed statuses.
- Explain: state vs derived values, immutable updates, and component boundaries. Do not introduce reducers or global state without a concrete need.

### W1-D3: Implement the API contract

- Implement create/list routes using temporary in-memory storage. Treat this as development-only persistence. Single-user mode is temporary; do not expose it publicly.
- Acceptance: valid create returns 201 and a server-assigned ID; list returns created items; invalid fields and malformed JSON receive documented 4xx responses; unexpected failures use a consistent 5xx response without internal details.
- Test valid creation, boundary lengths, invalid status, and malformed bodies at the HTTP boundary.
- Explain: why client validation alone is insufficient and which layer owns each rule.

### W1-D4: Persist in PostgreSQL

- Create a versioned migration for users and requests, seed a development user, and replace in-memory storage with database access.
- Use parameterized queries or equivalent safe query bindings. Add foreign keys and constraints for essential invariants.
- Acceptance: create/list survive an API restart; a fresh database can be created from migrations; tests use an isolated test database; seed steps are repeatable and documented.
- Explain: database constraints vs API validation, why IDs need uniqueness, and how you would undo a failed migration.

### W1-D5: Connect the whole flow

- Replace the browser's local data source with real API calls. Add loading, empty, validation-error, server-error, and retry states.
- Acceptance: submit → persist → display works; refreshing keeps data; failed submission preserves form input; repeated clicks while saving are handled. Do not claim this alone guarantees duplicate prevention across retries.
- Test a failed request and successful retry. Inspect the actual HTTP traffic in developer tools.
- Explain: distinguish HTTP error responses from network failures and trace one saved row back to the browser.

### W1-D6: Review gate and independent challenge

- Two-hour assessment: implement client-side sorting by newest/oldest, add a deterministic tie-breaker, and test it without AI. Documentation is allowed.
- Use two hours for review/corrections and one hour for the retrospective.
- Gate: another developer can run the project; create/list work across UI/API/database; validation and failure states work; checks pass. Record baseline-to-current improvements and two remaining gaps.

## Week 2 — Own a connected, protected feature

### W2-D1: Design identity and permissions

- Write a permission matrix for anonymous visitors, clients, and staff before implementing it. Choose an established authentication library/provider and describe session verification and storage. Do not invent cryptography.
- Add sign-in/out and session handling. Use seeded development accounts if signup would consume the budget.
- Acceptance: server derives identity from a verified session; protected APIs reject unauthenticated requests; sign-out invalidates access according to the chosen session mechanism. Document expiry behavior.
- Explain: authentication vs authorization, password handling if applicable, and browser/session threats relevant to your chosen approach, including CSRF for cookie-based authentication.

### W2-D2: Enforce ownership end to end

- Clients create and view their own requests; staff view all and change status. Use an explicit policy for client edits: allowed only while status is `new`.
- Acceptance: changing an ID, owner field, query parameter, or direct API call cannot expose or modify another client's data. Reject or ignore submitted ownership/role fields consistently. List, detail, edit, and status routes enforce the matrix.
- Test with client A, client B, staff, and an unauthenticated caller at the server boundary. UI visibility alone is not a permission check.
- Explain: how a valid signed-in user can still be forbidden from an operation.

### W2-D3: Search, filter, and paginate

- Implement server-side title search, status filtering, and pagination. Specify page size limits, ordering, and empty-search behavior before coding.
- Acceptance: filters compose; ordering is deterministic; invalid parameters receive clear responses; unauthorized rows never enter results; pagination preserves filters. Describe what happens when data changes between pages.
- Test with enough seeded rows for three pages, including equal timestamps and titles containing special characters.
- Explain: offset vs cursor pagination and why your current scale justifies your choice.

### W2-D4: Handle slow and failing networks

- Reproduce out-of-order search responses, session expiry, and a failed save using controlled delays or request interception.
- Acceptance: an old search response cannot overwrite the latest results; failed saves preserve edits; expired sessions produce a useful recovery path; UI loading states do not get stuck.
- Add a regression test for the stale-response scenario. Document how you reproduced it.
- Explain: cancellation vs ignoring stale results and the limits of each approach.

### W2-D5: Prove the user journey

- Add an end-to-end scenario: sign in as a client, create a request, refresh, and find it through a filter. Add server integration coverage for denied cross-user access.
- Acceptance: tests run from a documented, repeatable state; one user's fixtures do not contaminate another's; the important checks pass from a clean setup.
- Review your diff for unnecessary abstractions, exposed secrets, and unhandled errors. Explain one abstraction you deliberately avoided.

### W2-D6: Independent feature and permission defense

- Two-hour assessment: add a `priority` field (`normal`/`high`) through migration, API validation, UI, and tests. Existing rows must remain valid. Specify who can set priority using the existing permission matrix.
- Two hours review/corrections; one hour retrospective.
- Gate: identity is verified, ownership is enforced at every implemented route, filters work, and the main user journey passes. Defend a five-minute browser-to-database trace of the new field.

## Week 3 — Maintain software under change

### W3-D1: Add comments with a migration

- Add comments belonging to requests, with author and creation time. Clients may comment on their own requests; staff may comment on any request. Comments are plain text, 1–2,000 trimmed characters. Editing/deleting comments is out of scope.
- Acceptance: foreign keys prevent orphan comments; existing data survives migration; list/create permissions match request visibility; the UI safely displays plain text.
- Test cross-user attempts and a missing request. Explain whether creation needs a transaction and why.

### W3-D2: Investigate a slow list

- Seed at least 10,000 synthetic requests in a disposable development database. Measure a representative search/filter query and inspect its execution plan.
- Acceptance: report dataset, query, plan, timings across several runs, and a justified change or decision to keep the query. Check results remain correct. Do not assume every search can use a basic B-tree index.
- Explain: read benefit vs write/storage cost, and why local timing is limited evidence about production behavior.

### W3-D3: Debug from symptoms

- Request a separate broken copy of your app or use an unfamiliar small repository. Investigate two defects: one UI/async issue and one API/data issue. Do not read a supplied solution first.
- Acceptance per defect: reproducible report, evidence distinguishing hypotheses, root cause, smallest justified fix, and a regression test that fails before and passes after.
- If no broken copy is available, investigate the W2-D4 slow-network scenarios and a duplicate-create retry scenario. Mark these as known-scenario practice rather than unfamiliar-code assessment.
- Explain: why your fix addresses the cause and what evidence would disprove your conclusion.

### W3-D4: Handle concurrent staff edits

- Two staff members open the same request and both change its status. Define the desired conflict behavior and implement version-based conflict detection.
- Acceptance: the first valid update succeeds; a stale update receives a documented conflict response; the UI explains how to refresh/retry; the version check and write are atomic.
- Add an integration test submitting two updates with the same starting version. Explain why a separate read-then-write check can race.

### W3-D5: Make delivery repeatable

- Add automated checks for type checking, tests, and build. Document environment variables, migrations, seed data, and startup. Add actionable server logs without passwords, tokens, or sensitive bodies.
- Acceptance: checks run in the repository's CI or a documented local script if remote CI is unavailable; deliberately breaking a relevant test makes the check fail. Keep deployment credentials outside source control.
- Explain: how you would recognize a failed release and restore the last working application version without assuming schema rollback is always safe.

### W3-D6: Incident rehearsal

- Two-hour assessment: in a disposable environment, make the database unavailable. Diagnose from the UI symptom through logs/API/database; restore service and write a short incident report.
- Acceptance: API fails predictably without exposing internals; UI gives a recovery path; no false success; restoration is verified. Record actual observations rather than inventing an incident timeline.
- Two hours review/corrections; one hour retrospective.
- Gate: comments and conflict handling work, measured query investigation exists, regression tests demonstrate fixes, and delivery checks are repeatable.

## Week 4 — Independently scope, deliver, and defend

### W4-D1: Turn an ambiguous request into a specification

Client brief: “We need due dates so staff can see overdue requests. Clients should understand when to expect a response.”

- Write your clarifying questions, proposed behavior, assumptions, permission changes, and a 12-hour estimate split into tasks. Ask a reviewer to answer; if unavailable, document assumptions and proceed.
- Resolve date-only vs timestamp semantics, timezone, optional values, resolved-request behavior, and who can edit due dates.
- Acceptance: reviewable specification, examples at date/time boundaries, API/schema/UI proposal, test plan, and explicit deferred scope. Spend the remaining day beginning implementation.

### W4-D2: Deliver due dates end to end

- Finish migration, validation, permissions, form/display, overdue filtering, and tests within the remaining feature budget. If scope exceeds the budget, write a scope adjustment and deliver a coherent slice.
- Acceptance: old requests remain valid; unauthorized users cannot change due dates; boundary examples match the specification; server and browser agree on overdue behavior. Use a controllable clock in tests.
- Explain: your chosen time representation and a credible alternative.

### W4-D3: Respond to a change request

Client change: “Resolved requests should retain their due date, but should never count as overdue. Staff need a count of overdue requests matching the current search.”

- Before editing, identify affected behavior, query semantics, tests, and estimate. Update the specification if your original assumptions differ.
- Acceptance: count covers all matching authorized results, not just the current page; resolved requests are excluded; stored due dates remain intact; UI list/count stay consistent.
- Explain: how you avoided applying subtly different filters to the count and the list.

### W4-D4: Release and verify

- Deploy a demonstration environment using synthetic data and a chosen host. Configure secrets outside source control; apply migrations deliberately; verify HTTPS, authentication, permissions, and the core journey.
- Acceptance: a reachable demo, passing release checks, setup/runbook, known limitations, and a tested backup/restore procedure in a disposable database. Do not publish the initial unprotected week-1 version.
- If account access or hosting is unavailable, produce a reproducible local release and record deployment as unverified. That is useful progress but does not satisfy the deployed-demo criterion. Do not buy services without choosing an acceptable budget first.

### W4-D5: Final assessment — own the whole change

- **Four-hour independent ticket:** staff can archive/unarchive a request; clients see archived requests as read-only; active lists exclude archived requests by default; staff can explicitly include them. Existing requests start unarchived. Archived requests reject edits, comments, and status changes from clients; staff can unarchive to resume normal work.
- Before coding, write remaining assumptions and acceptance examples. Implement schema, API, UI, permissions, tests, and a migration. Documentation is allowed; AI implementation is not.
- **One-hour bug investigation:** reviewer supplies a separate broken copy. If unavailable, reproduce a real failure you have not already solved and clearly label the assessment limitation.
- **One-hour defense:** walk through the change, explain two decisions and alternatives, demonstrate a denied request, and discuss a failure mode.
- Use the remaining three hours for deployment verification, corrections, and submission. Corrections count as learning; report what worked at the original time limit separately.

### W4-D6: Final review and next-month decision

- Use two hours to reattempt the weakest skill with a different small task, two hours to review/correct the final deliverable, and one hour to summarize evidence.
- Gate: final feature meets agreed requirements; important permission tests and checks pass; deployment status is honestly recorded; you can diagnose a problem and explain the implementation independently.
- Compare baseline vs final evidence in five areas: implementation, debugging, SQL/data modeling, permissions, and technical explanation. Choose the next month from your weakest area, not another list of frameworks.
- Passing this simulation is evidence of small-feature ownership. Interview preparation, larger systems, and unfamiliar codebases remain continued practice.

## Weekly oral quiz

Answer each without notes in about two minutes. Give a concrete example from your code, then verify uncertain claims. A reviewer can probe with “what would break if we changed that?”

| Week | Questions |
| --- | --- |
| 1 | Why does mutating React state cause problems? Where is input validated? What happens between clicking Save and committing a database row? Which failures can happen after a successful insert? |
| 2 | How does the server know who I am? How do you stop client A accessing client B? Why can search show stale results? Why did you choose this pagination strategy? |
| 3 | What evidence made you change that query? What does your regression test prove? Why must a version check be atomic? What can go wrong when rolling back a schema change? |
| 4 | What did you clarify before implementation? Why did you represent time that way? What did you defer? How do you verify a release? Which part would you redesign if usage grew, and what measurement would trigger it? |

## Stretch bank — only after core gates pass

- Implement idempotent request creation; define key scope, expiry, replay behavior, and concurrent retries.
- Compare cursor pagination with the existing approach using concrete insertion/deletion cases.
- Create an append-only status history and explain its transaction boundary.
- Trace a request using a correlation ID across browser-visible errors and server logs.
- Review a peer's patch or unfamiliar open-source change and explain one substantive correctness finding.
