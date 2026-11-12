# 12 — Change data safely and handle concurrent work

**Goal:** preserve invariants across releases, failures and simultaneous requests. **Prerequisite:** 11. **Practice-plan link:** W2-D6, W3-D1/D4.

## Lesson

A migration is a versioned change to the database, not a manual edit remembered by one developer. Test both a fresh database and an upgrade containing existing rows. Adding a required column requires a policy for those rows. Large backfills and constraints can lock tables or take time, so production rollout design depends on size and database behavior.

When old and new app versions may overlap, consider expand/contract: introduce a compatible field, deploy code that can use it, backfill, and only later remove the old representation. A down migration cannot magically recover deleted data. Restoring the old application also requires schema compatibility, not merely an older container image.

A transaction groups database work that must commit together. A comment plus an audit event might be one unit. External email or HTTP calls are not rolled back by a database rollback; keep slow external operations outside long-held database transactions and use a durable delivery mechanism when required.

Concurrent requests can both read the same old value. A version check must occur in the write predicate, not as an unrelated read followed by an unconditional update. Locks, atomic updates, unique constraints and isolation levels solve different classes of problem. Some transaction failures require retrying the entire transaction; that retry must not repeat unsafe external side effects.

PostgreSQL's default Read Committed isolation does not mean a whole transaction sees one immutable database snapshot. Read the guarantees you actually rely on. Learn to describe a race as two concrete interleavings before choosing a fix.

## Worked example

```sql
UPDATE requests
SET status = $1, version = version + 1
WHERE id = $2 AND version = $3
RETURNING id, status, version;
```

The caller must already be authorized, or equivalent authorized predicates must be included. Zero rows means no row matched; distinguish missing/forbidden/stale outcomes according to your disclosure policy rather than assuming every zero-row result is a conflict.

## Required reading

- [PostgreSQL transaction tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html): commit/rollback and units of work.
- [Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html): Read Committed examples and retry implications. Detailed serialization theory is later study.

## Task

Add `version` and optional due-date fields through migrations in the SQL lab or ClientDesk. Seed old rows first. Simulate two updates from the same starting version and show exactly one succeeds. Plan how the UI handles the rejected update.

**Acceptance:** fresh/upgrade paths work; data is preserved; conflict detection is atomic; permission checks remain present; test demonstrates competing updates; rollback/forward-repair limits are documented.

## Quiz

1. Why can “read version, compare in application, update” still lose an edit?
2. Why does rolling back a transaction not undo an already sent email?
3. What must you check before redeploying an older application against a migrated database?

## Walkthrough: optimistic concurrency with actual interleaving

```text
A reads r1, version 4, status new
B reads r1, version 4, status new
A writes WHERE id=r1 AND version=4 → success, version becomes 5
B writes WHERE id=r1 AND version=4 → zero rows
B refreshes and chooses whether to reapply its intended change
```

If B blindly refetches and retries its original full replacement, it can still erase A's intent. A conflict response is a coordination signal, not an inconvenience to hide. For a small independent counter increment, an atomic increment may be the right rule instead of user-visible version conflicts. Choose the invariant first.

## Techniques and patterns

**Expand → backfill → enforce → contract:** adding a renamed field can require a period where old/new code coexist. Backfills need bounded batches and restart behavior at scale. Validate the data before enforcing a new constraint. A tiny offline training database may use a simpler one-step migration; document that assumption.

**Keep a transaction on one connection:** issuing BEGIN through a pool and later queries through unrelated pooled connections does not establish one transaction. Use the driver's transaction mechanism and pass its transaction-scoped client through the operation.

**Prefer database-enforced uniqueness:** “SELECT to see if email exists, then INSERT” races. A unique constraint makes one contender fail; translate the known constraint violation into the expected product outcome without misclassifying every database error as a duplicate.

**Distinguish isolation from business semantics:** stronger isolation can reject unsafe interleavings but still needs whole-transaction retries and suitable side-effect handling. Locks can serialize work while increasing contention/deadlock risk.

**Separate durable intent from delivery:** recording an outbox event in the transaction solves one database/delivery gap; the consumer still needs retry/deduplication and operational handling.

Real use: concurrent staff edits, unique account creation, inventory-like limits and rolling deployments all require more than “wrap it in a transaction.”

## Connections

[HTTP preconditions](09-web-http.md) can carry versions, [reliability](../04-security/15-api-reliability.md) handles repeated attempts, and [deployment](../06-delivery/19-runtime-deployment.md) determines migration overlap. Revisit [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html) for the exact behavior you rely on.

## Scenario practice — Q4–Q7

4. **Predict:** two transactions both find an email absent, then insert it. Compare the outcome with and without a unique constraint. Is the initial SELECT enough?
5. **Debug:** a service calls BEGIN on one pooled connection and performs writes through the pool object. Why might rollback fail to undo the intended operation? What evidence identifies actual connection/transaction scope?
6. **Design:** rename a populated column while two app versions may run simultaneously. Outline compatibility phases, backfill verification and when removing the old column becomes safe.
7. **Implement:** run the two-session version-conflict exercise and record affected-row counts/waiting. Add a test for a failed second write leaving the first committed data intact. Separately explain the UI conflict policy.

## Interview discussion

- “What does a transaction guarantee?” Follow-up: what does it not guarantee about external HTTP calls or every possible race?
- “Optimistic vs pessimistic concurrency?” Follow-up: which workload/invariant would change your choice?

Check the [scenario guide](../review/scenario-guide.md) for required interleavings and evidence.
