# Working glossary

Explain each term with a ClientDesk example. A memorized definition is only a starting point.

| Term | Practical meaning |
| --- | --- |
| Acceptance criterion | Observable condition showing the requested behavior is complete |
| Invariant | A rule that must remain true across operations, such as valid ownership references |
| Trust boundary | A crossing where one component must not assume incoming data/identity is valid |
| DTO | The explicit data shape crossing a boundary, distinct from an internal database row |
| Pure function | Function whose result depends on inputs without externally observable side effects |
| Mutation | Changing an existing value/object rather than creating a replacement |
| Closure | Function plus access to bindings from its surrounding scope |
| Race condition | Outcome depends on the relative timing of concurrent work |
| Idempotency | Repeating an operation has the same intended effect under its stated contract |
| Atomicity | A defined operation happens as one indivisible unit or commits as all-or-nothing |
| Transaction | Database unit with commit/rollback and specified isolation behavior |
| Isolation | Rules for what concurrent transactions can observe or interfere with |
| Constraint | Database-enforced rule on stored data |
| Migration | Versioned schema/data evolution step |
| Index | Extra data structure supporting certain queries at write/storage cost |
| Query plan | Database's chosen strategy for executing a query |
| N+1 queries | One initial query followed by another per result, causing avoidable round trips |
| Session | Mechanism relating requests to authenticated context with a lifecycle |
| Authentication | Establishing identity |
| Authorization | Deciding whether the identity may perform an action on a resource |
| Origin | Browser identity based on scheme, host and port |
| CORS | Browser cross-origin response-access mechanism |
| CSRF | Unwanted authenticated action exploiting automatically attached browser credentials |
| XSS | Attacker-controlled script execution in another user's browser context |
| SSRF | Server-side request to an attacker-influenced destination, potentially internal |
| Serialization | Converting data to a transport/storage representation such as JSON |
| Hydration | Connecting client behavior to server-rendered markup |
| Cache invalidation | Deciding when a saved result is no longer suitable to reuse |
| Latency | Time for a particular operation/result |
| Throughput | Amount of completed work per unit time under defined conditions |
| Backpressure | Limiting incoming/concurrent work to avoid overwhelming a slower component |
| Connection pool | Bounded reusable database/network connections |
| Artifact | Built output associated with a known source/configuration |
| Readiness | Whether an instance can currently serve its intended traffic |
| Liveness | Whether a process is functioning sufficiently to remain running |
| Regression | Previously correct behavior broken by a change |
| Smoke test | Small critical-path verification after setup/release |
| Mock | Controlled replacement for a dependency; its realism limits evidence |
| Fixture | Known test data/state |
| Correlation ID | Identifier connecting observations for one request/operation |
| RPO / RTO | Recovery point/time objectives: acceptable data-loss window and recovery duration |
| Technical debt | A known compromise with a cost and reason to revisit it |

## Practice

Pick five terms. Give a concrete example, a non-example and one failure caused by misunderstanding each. If two terms sound interchangeable, use your code to explain the difference.
