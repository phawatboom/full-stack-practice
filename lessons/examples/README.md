# Executable teaching patterns

These small modules turn several lesson ideas into observable behavior. They use only Node's standard library and do not install packages. They are teaching examples, not a full API, React integration, authentication system or production utility package. Read the contracts before adapting them.

From the repository root:

```powershell
node --test lessons/examples/patterns.test.mjs
```

## Read in this order

| Example in `patterns.mjs` | Observe | Lesson links |
| --- | --- | --- |
| `renameRequest` | New changed record, same untouched references | [02](../01-foundations/02-javascript.md), [07](../02-frontend/07-react-state.md) |
| `parseLimit` | Missing default vs invalid syntax/range | [04](../01-foundations/04-typescript.md), [10](../03-backend-data/10-api-architecture.md) |
| `createLatestRunner` | Obsolete success/error cannot change current state | [03](../01-foundations/03-async-runtime.md), [08](../02-frontend/08-client-server-data.md) |
| `isOverdue` | Explicit clock, null and boundary behavior | [22](../07-engineering/22-files-time-integrations.md) |
| `reduceSave` | Valid transitions rather than contradictory flags | [04](../01-foundations/04-typescript.md), [07](../02-frontend/07-react-state.md) |
| `lowerBound` | Half-open interval and reference-oracle testing | [23](../07-engineering/23-cs-interviews.md) |

## Contracts and limits

- `renameRequest` receives already validated domain records/title. IDs are unique. Absent ID returns a new array with original element references; it does not mean a backend update succeeded.
- `parseLimit` accepts one raw query-string value or undefined. Default is 20; explicit inputs must be decimal integers 1–100 with no leading zero, whitespace, signs or exponent syntax. Repeated query values supplied as arrays fail. Your framework must expose duplicates if your contract rejects them; do not silently discard them upstream.
- `createLatestRunner` owns only authority to commit results. Callbacks are local and commit is synchronous/non-throwing. `invalidate()` prevents old completions from committing; the caller separately clears account-specific UI/cache. It does not abort network I/O, deduplicate writes or roll back server work. Errors here are synthetic/local; production error messages need safe translation.
- `isOverdue` receives finite epoch-millisecond instants, a validated domain status and a nullable due instant. The rule is strictly after the instant and not resolved. It does not parse user strings or implement a date-only business calendar.
- `reduceSave` receives validated events/states. It is a small illustrative transition policy. It neither sends requests nor handles obsolete network completions; pair async authority with UI state where needed.
- `lowerBound` receives an ascending numeric array and comparable target. It returns the first index at/after target, or length. It does not validate/sort the input for you; NaN and incompatible comparator semantics violate the contract.

## Practice variations

Predict each test before running it. Then change one requirement: allow priorities instead of title editing, preserve prior data during refresh, make exactly-due count as overdue, or find the upper bound instead of the lower bound. Update the contract/tests first. Use the original tests as regression checks rather than changing assertions until they match the code.
