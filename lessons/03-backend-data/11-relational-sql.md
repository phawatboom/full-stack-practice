# 11 — Model relationships and query them correctly

**Goal:** reason about stored data and SQL rather than depending on an ORM to design it. **Prerequisite:** 10. **Practice-plan link:** W1-D4, W2-D3.

## Lesson

A table models a set of records with constraints. Primary keys identify rows; foreign keys express references; unique and check constraints protect invariants even if a second application writes to the database. `NOT NULL` is separate from most checks. SQL's null represents missing/unknown information, so comparisons use three-valued logic: `= NULL` is not how you test absence.

Model one-to-many comments with a `request_id`, and many-to-many membership with a join table when requirements need it. Avoid storing comma-separated lists of IDs. Normalization prevents independent copies of the same fact drifting apart; deliberate duplication may be appropriate for measured read needs but requires an update policy.

Joins combine related rows. A left join preserves unmatched rows from the left side; a WHERE condition on the nullable right side can accidentally remove them. Joining requests to comments multiplies rows, so `COUNT(*)` can count comments rather than requests. Understand your query's unit of counting before adding an ORM include.

Bind values as parameters. Sort column names and SQL keywords usually need an allowlist rather than a value placeholder. For pagination, use a deterministic order such as `(created_at DESC, id DESC)`. Offset pagination is simple but changes between requests can move rows. Cursor pagination needs a compatible ordering and encoded position; neither approach is automatically ideal for every list.

Indexes support particular access patterns and impose write/storage costs. A composite index's column order matters. Verify a real query plan with representative data instead of indexing every column. Connection pools also have a total budget across all running application instances.

## Worked example

```sql
SELECT id, title, status, created_at
FROM requests
WHERE owner_id = $1 AND status <> 'resolved'
ORDER BY created_at DESC, id DESC
LIMIT $2;
```

Here the application supplies a verified owner ID and a validated bounded limit. Parameter notation depends on your database driver.

## Required reading

- [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html): queries, joins and aggregates.
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html): keys, nulls, checks and references.
- [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html): parameterized queries and allowlists.

## Task

Complete the [SQL lab](../labs/02-sql-migrations/README.md). Draw users → requests → comments, write a list with comment counts including zero, and explain every grouping/join. Add an owner-scoped filter and stable pagination.

**Acceptance:** results include requests without comments; one client never sees another's rows; invalid references/statuses fail; user text is bound rather than concatenated into SQL; explain index candidates without claiming unmeasured speedups.

## Quiz

1. Why does `WHERE due_at = NULL` not find missing due dates?
2. How can joining comments inflate a request count?
3. Why does safe binding of values not automatically make a dynamic ORDER BY column safe?

## Walkthrough: count the entity you mean

Fixture: `r1` has two comments, `r2` has none. A left join creates two result rows for r1 and one null-comment row for r2. `COUNT(*)` per request produces 2 and 1; `COUNT(c.id)` produces 2 and 0 because the unmatched comment key is null.

```sql
SELECT r.id, r.title, COUNT(c.id) AS comment_count
FROM requests r
LEFT JOIN comments c ON c.request_id = r.id
WHERE r.owner_id = $1
GROUP BY r.id, r.title
ORDER BY r.id;
```

If you add a condition on `c.body` in WHERE, requests without matching comments disappear. Put a comment-matching condition in the join when you intend to preserve requests and count only matching comments. The right placement depends on the desired result, not a blanket “WHERE is wrong” rule. Read the join examples in [PostgreSQL table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html).

## Techniques and patterns

- **Use EXISTS for existence:** when the question is “has any qualifying comment?”, a correlated EXISTS can express intent without multiplying request rows.
- **Name the result grain:** one row per request, one per comment, or one per owner. Many count/pagination defects come from changing that grain accidentally.
- **Keep list/count predicates consistent:** authorize and filter before counting. A count of other clients' requests is still a disclosure.
- **Understand cursor boundaries:** for descending `(created_at, id)` ordering, a later page uses a compatible strict “less than cursor tuple” comparison with non-null fields. A cursor encodes position, not authorization.
- **Beware implicit representations:** database aggregate/numeric values can arrive as driver-specific strings or larger numeric types. Map them deliberately instead of promising an unsupported JS number range.

Real use: dashboards, exports and paginated admin tables frequently miscount because joins or filters silently change which entity is being counted.

## Connections

In-memory map joins in [lesson 23](../07-engineering/23-cs-interviews.md) express a related operation at a different boundary. Correct queries precede [performance tuning](../05-quality/18-performance.md). Use the deterministic fixture in the [SQL lab](../labs/02-sql-migrations/README.md).

## Scenario practice — Q4–Q7

4. **Predict:** using the r1/r2 fixture above, give the joined rows and results of COUNT(*) and COUNT(c.id). Then add `WHERE c.body LIKE '%error%'`; what happens to r2?
5. **Debug:** a paginated request list shows duplicates and fewer unique requests than the limit. It joins comments before applying LIMIT. Explain the changed result grain and propose a correction.
6. **Design:** compare offset and cursor pagination for an actively updated support queue. Define ordering, null handling, cursor validation and what consistency you promise between pages.
7. **Implement:** return one row per authorized request with zero-inclusive comment counts. Test list/count consistency with two owners, equal timestamps and multiple comments. Do not solve it by fetching every row into the browser.

## Interview discussion

- “INNER JOIN vs LEFT JOIN?” Follow-up: how can a WHERE clause make a left join behave like an inner join for a condition?
- “How would you investigate an N+1 query?” Follow-up: why can one giant join also be wrong for pagination?

Use the [scenario guide](../review/scenario-guide.md) to assess result correctness before query cleverness.
