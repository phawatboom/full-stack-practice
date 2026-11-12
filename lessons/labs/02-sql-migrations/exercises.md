# SQL exercises

Create your own `answers.sql` after running `verify.sql`. Preserve the fixture until you have recorded expected results. For experiments use a transaction and roll back intentional data changes.

## Core

1. List client A's unresolved requests in deterministic newest-first order. Expected IDs: `r1`.
2. List every request with comment count, including zeros. Expected map: `r1 → 2`, `r2 → 0`, `r3 → 0`. Explain why `COUNT(comment.id)` differs from `COUNT(*)` for a left join.
3. Count requests per owner without inflating totals through the comments join. Expected: `a → 2`, `b → 1`.
4. Find requests without a due date. Explain null semantics.
5. Add a parameterized title search through your API. Specify whether `%` and `_` are literal text or pattern characters and test that contract. Binding prevents query-structure injection but does not automatically escape LIKE wildcards.
6. Page through rows ordered by creation time then ID. Explain tie-breaking and what happens when a new row arrives between pages.
7. Propose an owner/newest-first index. Inspect a representative plan after adding larger synthetic data in the disposable DB. A sequential scan on three rows is not proof the index is broken.
8. Test a migration adding a required priority with a default to existing rows. Explain rollout compatibility and whether the default is a business rule or a migration convenience.

## Two-session conflict exercise

Open two SQL sessions to the same disposable DB. Both first read `r1`'s version. Session A performs a version-predicate update but holds the transaction open. Session B attempts an update with the same old version. Observe waiting. Commit A and inspect B's affected-row count. Roll back/restore your test fixture deliberately after recording evidence.

**Expected principle:** a correctly versioned stale update cannot overwrite the successful update. The sequential verification script checks the predicate, but this two-session exercise supplies real concurrent behavior evidence.

## Important limits

This schema models relationships, not a production authentication system. Database foreign keys do not enforce all ClientDesk authorization rules. SQL `char_length` and JavaScript string length can differ for some Unicode content; choose/document a compatible validation policy before claiming cross-layer character limits match.
