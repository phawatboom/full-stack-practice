# Quiz review guide — open after attempting the work

These are the expected ideas, not scripts to memorize. Give a concrete example from your code and explain a failure case. Each answer scores 0–2; target 5/6 per lesson plus the practical acceptance criteria. Do not award full credit for repeating a definition you cannot apply.

This file covers foundation questions 1–3. The [scenario guide](scenario-guide.md) separately covers Q4–Q7, and the [checkpoint guide](checkpoint-guide.md) covers the integrated assessments. Open each after your independent attempt.

## 01 — Workspace and Git

1. The next commit includes the staged snapshot, not later unstaged edits to the same file. Inspect both diffs.
2. Installation resolves dependencies; configuration, type errors, missing services, incompatible APIs or runtime assumptions can still fail later steps.
3. Revoke/rotate the key, assess exposure and follow cleanup policy. Deleting it from the current tree does not remove history or invalidate existing copies.

**Task review:** setup is independently reproducible; the diff is focused; the conflict resolution preserves intended behavior from both sides.

## 02 — JavaScript

1. Array spread copies the array, but nested objects still share references. Copy the changed record/path too.
2. Maps provide explicit keyed storage, avoid accidental inherited-property keys, and can use keys other than strings. An object can also work with careful key semantics, such as a null-prototype dictionary.
3. Import-time startup makes reuse/tests unpredictable, can claim ports or perform unwanted I/O, and obscures dependency boundaries. Keep an explicit entry point.

**Task review:** no input mutation; missing-ID behavior is specified; sort ties are deterministic; complexity matches the actual operations.

## 03 — Async runtime

1. `await` suspends the current async function's continuation. CPU-bound synchronous work still occupies its execution thread; asynchronous I/O does not create unlimited CPU capacity.
2. The aggregate rejects when an input rejects, while other operations may continue. Cancellation needs a separate supported mechanism.
3. The first write may have committed before its response was lost. A retry can create a duplicate unless the operation has a suitable idempotency policy.

**Task review:** controlled completion order; errors are observed; concurrent work is justified; the explanation does not equate cancellation with server rollback.

## 04 — TypeScript

1. A cast changes the compiler's view without checking the runtime JSON. Parse/validate unknown data at the boundary.
2. Use `unknown` when the value is not yet established; callers must narrow it. `any` bypasses useful checking and lets unsupported operations propagate.
3. A discriminant restricts available fields by state, so success data cannot be read from an error state without a type error. The design still needs correct runtime transitions.

**Task review:** strict checks; finite statuses; no casts as validation; shared contracts contain no server secrets/dependencies; missing and null update semantics differ deliberately.

## 05 — HTML and accessibility

1. Native buttons supply semantics, keyboard activation and expected focus/interaction behavior. A custom clickable element needs those behaviors implemented and tested.
2. Placeholder text disappears, may be low contrast, and is not a reliable persistent/programmatic label or instruction.
3. Automated tools cannot fully judge focus flow, task completion, understandable feedback or every assistive-technology interaction. Combine checks with manual use.

**Task review:** labels and errors are associated; controls work by keyboard; failure preserves values; focus/zoom behavior is observed.

## 06 — CSS

1. With content-box sizing, padding/borders add to the content width. Investigate the computed box; border-box often matches the intended sizing.
2. Grid fits coordinated rows and columns; flex fits a primary axis. Content and alignment requirements decide, not device names.
3. Clipping can hide controls or text and make them unreachable. Repair sizing/wrapping or provide intentional usable scrolling where appropriate.

**Task review:** real long content and zoom are tested; no global overflow hiding used to conceal clipped content.

## 07 — React

1. Two states can become inconsistent when one changes without updating the other. Derive a filtered list from the source items and filter when practical.
2. An effect synchronizes with an external system. Unsubscribe, close or cancel/ignore obsolete work as applicable. User-triggered actions and pure calculations usually belong elsewhere.
3. Index-based identity can stay at a position while records move, so local row state may become associated with a different item. Stable record IDs preserve intended identity.

**Task review:** rendering is pure; state has one owner; derived data is not redundantly synchronized; routing and unsaved drafts have a clear policy.

## 08 — Browser data

1. HTTP error responses usually resolve the fetch promise; `ok`/status tells you whether the HTTP result is successful under your contract. Response parsing can fail separately.
2. Debouncing limits starts but existing requests may still complete out of order. Cancel and/or ignore obsolete results.
3. Include inputs that change results, such as filters, page and sort. Partition or clear by identity/tenant and privilege changes; do not reuse sensitive results across accounts.

**Task review:** forced reverse completion succeeds; drafts survive failure; logout cannot repopulate sensitive data; distinguish transport failure from an HTTP error.

## 09 — HTTP

1. No. Scheme differs; host and port also contribute to origin identity.
2. CORS is enforced by browsers for script access. The server still needs verified identity, authorization and any relevant CSRF protection.
3. A read should have no intended application mutation. A create may already have committed, making blind retry duplicate work. Method semantics and the specific contract determine policy.

**Task review:** actual headers/status/timings recorded safely; source of failure identified; personalized caching is intentional.

## 10 — API architecture

1. Callers could update privileged/internal fields through mass assignment. Explicitly validate and map allowed fields; derive identity/privileges on the server.
2. A stable machine code lets clients act consistently while message wording/localization evolves. Neither should leak internal details.
3. Split when boundaries clarify behavior, reduce meaningful duplication or permit useful tests. A tiny operation does not require a multi-layer class hierarchy.

**Task review:** useful error contract, resource bounds and explicit server-owned fields; no server startup hidden in helper imports.

## 11 — SQL

1. Comparisons with null evaluate as unknown rather than true; use `IS NULL` for absence.
2. One request produces one joined row per comment, so naive counts duplicate requests. Count the intended entity, aggregate separately or use an appropriate distinct strategy.
3. Value parameters do not represent arbitrary SQL identifiers/keywords. Choose dynamic sort columns/directions through an allowlist of known SQL fragments.

**Task review:** zero-comment requests included; no count inflation; proper binding; deterministic order; index claim supported by a plan when measured.

## 12 — Migrations and transactions

1. Another transaction can change the row after the read. Put the expected version condition in an atomic update or use an appropriate locking/isolation design.
2. Email is an external side effect outside the database transaction. Durable delivery intent and idempotent processing need an explicit design.
3. Check schema/behavior compatibility, data transformation effects, required configuration and whether removed data can be recovered. Older code may not understand the new schema.

**Task review:** both fresh and upgrade paths; preservation of existing data; version predicate; real concurrent evidence where claimed.

## 13 — Authentication and authorization

1. A caller can bypass the UI and send HTTP directly. Permissions belong in server operations, with UI hiding only improving usability.
2. Decoding reads payload fields; verification establishes signature and applicable token claims using trusted configuration. A decoded role is not automatically trustworthy.
3. Data can leak through lists, counts, exports, comments or background processing even when one detail route is secure. Test all entry points.

**Task review:** two-client and staff scenarios; no client-selected identity; verified session mechanism; expiry/logout behavior tested; nested routes covered.

## 14 — Web security

1. Output context matters. HTML, JavaScript, URLs and attributes have different safety requirements; ordinary string validation does not make unsafe rendering safe.
2. The browser may attach existing cookies to a request initiated elsewhere. Use an appropriate CSRF defense and cookie/origin policy for the authentication mechanism.
3. Client build tooling can substitute values into public JavaScript. An environment-file origin does not keep a browser-delivered value secret.

**Task review:** clear trust-boundary map and observed controls; no unverified “secure” claim based only on an audit scanner.

## 15 — Reliability

1. Only that the caller did not receive the result within its limit. The server may have done nothing, partially progressed, or committed successfully.
2. Each process has different memory and restarts lose it. Durable shared uniqueness/state is needed for cross-instance guarantees.
3. A worker can complete the external action and fail before acknowledging/storing completion. Redelivery can repeat it unless the side effect is safely idempotent/deduplicated.

**Task review:** defined scope, replay/payload behavior, retention and concurrency; retries bounded; external provider contract respected; simulated durability not presented as real.

## 16 — Testing

1. A fake may never execute the real ownership predicate or query. The test can prove orchestration but not the actual database boundary.
2. Executing lines does not prove the result was asserted correctly or that relevant inputs/failures were included.
3. Use manually controlled promises or request interception to complete B before A, then assert only B is displayed. No timing guess is needed.

**Task review:** meaningful pre-fix failure, isolated fixtures, denied-operation postconditions and user-facing assertions.

## 17 — Debugging

1. Compare browser network events, server request IDs and database write evidence. Two client POSTs differ from one POST causing two inserts.
2. Include safe operation/outcome/duration/correlation information. Omit credentials, tokens, session cookies and sensitive bodies unless an explicitly justified redacted policy permits specific data.
3. Schema/configuration/data changes may be incompatible with old code; rollback can worsen impact. Establish compatibility and preserve data first.

**Task review:** distinguish observations from hypotheses; locate root cause; regression catches it; incident timeline uses actual evidence.

## 18 — Performance

1. An average can hide a small group of very slow operations. Inspect distributions/tails with sufficient data and the actual workload.
2. It executes the statement. Writes can change data and functions/triggers can have consequences. Use controlled environments and understand what executes.
3. An incorrect cache key or sharing policy can return another user's results. Performance changes must preserve authorization and freshness semantics.

**Task review:** representative workload, comparable repeated measurements, unchanged correct results and acknowledged environment limits.

## 19 — Deployment

1. Localhost inside a container refers to that container. The database may need a service hostname/internal address rather than the host's local address.
2. A migration or data transformation may prevent old code working or destroy data the old version expects. Release recovery includes schema and data strategy.
3. A successful backup job does not prove the artifact is complete, accessible or restorable. Restoring and validating records/application behavior checks the actual recovery path.

**Task review:** no real secrets in artifacts; versioned release; real smoke tests; recovery verified in isolation or explicitly marked unverified.

## 20 — CI and dependencies

1. Manifests often permit version ranges; lockfiles capture resolved direct/transitive versions for reproducible installation with the appropriate package-manager mode.
2. That code could read/exfiltrate secrets or alter a release using its job privileges. Separate trust levels and minimize permissions.
3. It may run zero/relevant-missing tests, use unrealistic mocks, skip migration upgrades, use stale artifacts or never test permissions/deployment configuration.

**Task review:** deliberate test failure makes the job fail; lockfile install; privileges narrow; sensitive environment not exposed to untrusted source.

## 21 — Requirements and design

1. Ask which operation, which users/devices/network, data size/concurrency, acceptable latency and measurement conditions. Define an observable threshold with a realistic budget.
2. Public crawlable content, first-content needs or application-specific data/loading constraints may favor it. Account for server work, caching and hydration complexity.
3. Repeated meaningful logic, a real independent change/scale boundary or measured constraints can justify it. File count, trendiness or hypothetical scale alone cannot.

**Task review:** clarifications affect behavior; permissions/failures are specified; scoped estimate includes checks/release; design record includes costs and reconsideration triggers.

## 22 — Time/files/integrations

1. A date has calendar meaning; an instant is a unique point in time. Timezone conversion can move calendar dates. Define which semantics the product needs.
2. Both are caller-controlled claims; content can differ, names can collide or contain unsafe paths, and storage/download behavior matters. Use validated types, generated keys, limits and access controls.
3. It can reach private/internal services using the server's network privileges. Validate destinations with established SSRF controls, considering redirects and resolution.

**Task review:** null/boundary/timezone cases tested; private file access and idempotent jobs described if implemented; deeper infrastructure is not added without a requirement.

## 23 — Computer science

1. Each of n outer items can search n inner items. A keyed lookup structure can avoid repeated scans when semantics permit.
2. The input must be sorted under the same ordering/comparator used by the search, with consistent boundaries.
3. Async operations still occupy finite connections while waiting. Concurrency across all app instances can exceed database capacity.

**Task review:** complexity matches code, examples include edge cases, Unicode/duplicate assumptions explicit, no unsupported worst-case map claims.

## 24 — Teamwork and capstone

1. Problem/trigger, resulting behavior, necessary design trade-offs, validation evidence, rollout implications and known limitations, proportional to complexity.
2. A blocker has a concrete correctness/security/data-loss/requirement impact. A preference is a style or design choice without comparable demonstrated impact; label it accordingly.
3. A completed independently implemented change, meaningful checks, a real bug investigation, reproducible delivery and a convincing explanation with alternatives. A polished screenshot or self-awarded score is insufficient.

**Task review:** assess actual evidence using the original weighted rubric; record help; separate timeboxed performance from corrected final work.

## Lab 01 hints — spoilers after you attempt it

1. Log or inspect the list before and after permission filtering, then before and after status filtering. Which stage loses the expected row?
2. Compare the selected status with the predicate's truth condition. The UI contract asks for matching rows.
3. Fixing status selection must not bypass owner filtering. Add mixed-status and mixed-owner cases, including no matches.
4. The baseline's nine passing tests intentionally omit the broken status-selection behavior. The skipped exercise demonstrates the evidence gap.

## Lab 02 review checks

Count a non-null comment key for left-joined comment totals. A request with no comments still creates one joined result row, so COUNT(*) differs. Qualify tables with the practice schema. Use `IS NULL` for missing due dates. SQL bindings belong in the driver/query API; changing quote escaping manually is not a substitute. An index experiment must use representative data, and a simulated sequential version check is not evidence of actual simultaneous-session behavior.
