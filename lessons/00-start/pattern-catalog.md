# Patterns worth recognizing and when to stop

A pattern is a recurring solution under stated conditions, not something to force into every project. Learn the problem, guarantee, cost and failure case. Follow the lesson links for worked examples.

| Pattern / technique | Useful when | Limit or common misuse | Learn/practice |
| --- | --- | --- | --- |
| Explicit boundary parser | Accepting JSON/query/external data | A TypeScript cast is not a parser | [04](../01-foundations/04-typescript.md), [10](../03-backend-data/10-api-architecture.md) |
| Explicit DTO projection | Internal rows contain privileged fields | Returning the whole ORM row can leak data | [10](../03-backend-data/10-api-architecture.md), [13](../04-security/13-authentication-authorization.md) |
| Immutable path update | Updating shared/UI objects | Shallow copy does not clone nested records | [02](../01-foundations/02-javascript.md), [examples](../examples/README.md) |
| Minimal source of truth | Counts/filters derive from records | Duplicated state drifts | [07](../02-frontend/07-react-state.md) |
| Discriminated state machine | Several related loading/save transitions | Too many independent booleans permit impossible combinations | [04](../01-foundations/04-typescript.md), [07](../02-frontend/07-react-state.md) |
| Latest-result authority | Overlapping searches or identity changes | Guard error/cleanup too; abort does not undo writes | [03](../01-foundations/03-async-runtime.md), [08](../02-frontend/08-client-server-data.md) |
| Functional core with visible I/O | Business rules reused/tested independently | Do not invent a class hierarchy for every helper | [10](../03-backend-data/10-api-architecture.md) |
| Query scoped to verified actor | Multi-user/tenant data access | Cursor/UUID/client-side filtering does not grant permission | [11](../03-backend-data/11-relational-sql.md), [13](../04-security/13-authentication-authorization.md) |
| Database-enforced invariant | Uniqueness/references/atomic limits | A prior SELECT alone can race | [11](../03-backend-data/11-relational-sql.md), [12](../03-backend-data/12-migrations-transactions.md) |
| Optimistic concurrency | Users edit a previously read version | Blind auto-retry can erase another edit | [12](../03-backend-data/12-migrations-transactions.md) |
| Expand/contract migration | Old/new versions overlap | More steps may be unnecessary for a tiny offline exercise | [12](../03-backend-data/12-migrations-transactions.md), [19](../06-delivery/19-runtime-deployment.md) |
| Durable idempotency key | Retried logical writes | Scope/payload/expiry/atomicity must be defined | [15](../04-security/15-api-reliability.md) |
| Bounded concurrency/backoff | Large batches or failing dependencies | Unbounded promises and instant retries overload systems | [03](../01-foundations/03-async-runtime.md), [15](../04-security/15-api-reliability.md) |
| Transactional outbox | DB change and durable delivery intent must agree | Does not itself guarantee exactly-once external effects | [12](../03-backend-data/12-migrations-transactions.md), [22](../07-engineering/22-files-time-integrations.md) |
| Controlled clock/completion | Time/race tests need deterministic evidence | Sleeps are not a reliable ordering mechanism | [16](../05-quality/16-testing.md), [examples](../examples/README.md) |
| Reproduce → regression → focused repair | Fixing a concrete defect | A test passing before the bug fix may not detect the bug | [16](../05-quality/16-testing.md), [17](../05-quality/17-debugging-observability.md) |
| Measure dominant cost first | An operation misses a performance target | Micro-optimization can miss I/O or result-grain defects | [18](../05-quality/18-performance.md) |
| Known artifact + smoke verification | Delivering to another environment | Build success is not deployed permission/recovery evidence | [19](../06-delivery/19-runtime-deployment.md), [20](../06-delivery/20-ci-dependencies.md) |
| Small decision record | A choice has meaningful trade-offs | “Best practice” without constraints is weak reasoning | [21](../07-engineering/21-design-requirements.md), [24](../07-engineering/24-teamwork-capstone.md) |

## Useful tricks, with boundaries

- Search an error string or route before guessing a filename.
- Draw object references when mutation behavior surprises you.
- Draw a timeline when promises or concurrent edits surprise you.
- Write the SQL result grain before adding joins, counts or LIMIT.
- State absent/null/empty/zero meanings before applying defaults.
- Verify a test can fail for the relevant regression before trusting it.
- Compare an optimized algorithm against a simple deterministic oracle.
- Keep a short affected-file list before a full-stack change.

These techniques save time because they expose assumptions. They do not replace understanding the actual runtime/framework/database contract.
