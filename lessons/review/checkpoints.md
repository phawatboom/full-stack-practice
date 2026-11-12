# Four integrated checkpoints

Use one checkpoint instead of that week's existing review exercise, or save it for a later retry. Do not add all four on top of the 50-hour schedule. Suggested timebox: 60–90 minutes, followed by separate review/correction. Documentation/debuggers are allowed; no generated implementation during the independent attempt.

The artifacts below are **synthetic teaching scenarios**, not observations from your app. Framework-like snippets are illustrative, not runnable route/component files. Implement a minimal reproduction in your actual project or an isolated test before claiming the issue is fixed. Do not read [the checkpoint guide](checkpoint-guide.md) until you have submitted your reasoning.

For each checkpoint deliver: expected/actual, ranked hypotheses, affected-file map, proposed/implemented repair, tests with observed results, one trade-off and a brief status report. If you did not run code, label it a design/investigation answer.

## Checkpoint A — A detail page shows another record's draft

**Connect:** lessons 02–09 and 16. User opens request A, then quickly switches to B. B's heading appears, but A's description sometimes appears in the edit form.

```tsx
// RequestDetails.tsx — simplified excerpt
const [request, setRequest] = useState<RequestItem | null>(null);
const [draft, setDraft] = useState('');
useEffect(() => {
  fetchRequest(requestId).then(data => {
    setRequest(data);
    setDraft(data.description);
  });
}, [requestId]);
```

```text
Observed in this scenario:
10:00:00.000 start GET A
10:00:00.100 start GET B
10:00:00.200 complete B with B data
10:00:00.800 complete A with A data
```

1. Trace which promise can set which state and predict final values. Separate a response-ordering defect from a policy about unsaved drafts.
2. Repair authority for success/error/cleanup and define behavior when request ID or identity changes. Explain what cancellation does and does not guarantee.
3. Design deterministic tests for reverse completion, old rejection, unmount/account change and save failure preserving edits. Include an accessible loading/error interaction.
4. List the component, API helper, route/error contract and tests you would inspect. Which files actually need changes for the observed defect, and which only need verification?

**Done:** no old result overwrites the current record, draft policy is explicit, tests demonstrate the relevant old failure, and user feedback is usable. Do not solve it by removing navigation or suppressing every error.

## Checkpoint B — Parent authorization, wrong child

**Connect:** lessons 10–14 and 16. Actors are already verified by supported session middleware in this scenario.

```text
Requests: r1 owned by A; r2 owned by B
Comments: c1 belongs to r1; c2 belongs to r2
```

```js
// comments.routes.ts — illustrative existing handler
const parent = await repository.getRequest(params.requestId);
if (!parent) return notFound();
if (actor.role !== 'staff' && parent.ownerId !== actor.id) return notFound();
const comment = await repository.getComment(params.commentId);
if (!comment) return notFound();
return ok(comment);
```

1. Construct a direct request showing the problem. Explain why random IDs and a hidden UI link do not establish the missing guarantee.
2. Propose a repository/query and route policy that verifies the requested relationship and authorization. Which public fields should the response expose?
3. Write a table of tests for A/B/staff/anonymous, missing parent/child and wrong-parent combinations. Include a client-supplied owner/role attempt where relevant.
4. Extend the review to list, count and export routes. State what evidence would show they share the same visibility boundary.

**Done:** child identity cannot escape the authorized parent; response policy is consistent; no cross-user data is disclosed; test fixtures truly contain different owners/parents.

## Checkpoint C — Counts, due dates and competing updates

**Connect:** lessons 11–12, 18 and 22. For this checkpoint use **instant-based deadlines**, strict `now > dueAt`, and resolved requests never count as overdue.

```text
Fixed now: 2026-12-01T00:00:00Z
r1: owner A, new, due 2026-11-30T23:00:00Z, 2 comments, version 4
r2: owner A, resolved, due 2026-11-30T22:00:00Z, 0 comments, version 1
r3: owner B, new, due 2026-11-30T21:00:00Z, 3 comments, version 1
r4: owner A, new, no due date, 0 comments, version 1
```

```sql
-- Simplified query currently used for A's overdue count:
SELECT COUNT(*)
FROM requests r
JOIN comments c ON c.request_id = r.id
WHERE r.owner_id = $1 AND r.due_at < $2;
```

1. Predict the current count and correct count for A. Identify wrong query grain and missing business predicates independently.
2. Write the correct owner-scoped count and define list/count agreement. Add exactly-due, null and resolved boundary fixtures.
3. Two staff edit r1 from version 4. Show the losing-write interleaving for read-check-unconditional-write, then write a version-predicate update. Explain zero-row result handling.
4. Plan a migration introducing dueAt and version to old rows, and identify what concurrent database evidence you still need beyond a sequential mock test.

**Done:** authorized count is correct without depending on comment quantity; old rows survive; atomic version logic is demonstrated; no claim that stronger-looking SQL alone proves concurrency behavior.

## Checkpoint D — Green build, broken release

**Connect:** lessons 17–21 and 24. A synthetic deployment has these facts:

```text
Build:
  source revision: rev-12
  public API URL substituted: http://localhost:3000/api
CI:
  unit tests pass; test DB upgrade was not exercised
Runtime:
  server PUBLIC_API_URL=https://demo.example.test/api
  instance one: rev-12; instance two: rev-11
Database:
  new nullable column exists; no rows lost in this scenario
Browser:
  downloaded JS calls http://localhost:3000/api
```

1. Identify supported conclusions and separate multiple problems. Why does changing the API runtime variable not necessarily repair the built browser asset?
2. Give an investigation/release plan covering artifact identity, routing, configuration lifecycle, schema compatibility and authenticated smoke checks. Do not prescribe a destructive schema rollback without evidence.
3. Define checks that would have detected these failures and explain which require hosted/browser evidence instead of unit tests.
4. Write a client/team status update: impact, observed cause(s), mitigation, remaining uncertainty and next verification step. Include backup/restore limits honestly.

**Done:** each running instance and asset is traceable, browser URL/routing is correct, protected journey verified, and status claims match evidence. Passing an old CI job alone does not close the incident.

## Marking

Use 25 points for behavior/correctness, 25 for reproduction/tests/evidence, 20 for explanation/trade-offs, 15 for complete focused change scope and 15 for communication/limits. Target 80/100 with the checkpoint's critical criteria met. A paper-only answer may score well on design but cannot earn implementation evidence points for commands it did not run.
