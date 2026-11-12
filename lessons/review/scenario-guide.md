# Scenario marking guide — questions 4–7

Attempt the questions before reading this file. The original [answer guide](answer-guide.md) still covers questions 1–3. These new questions assess prediction, diagnosis, trade-offs and transferable implementation; they are not claimed to be questions from any particular employer.

## Scoring

Score each scenario 0–4: **0** missing/incorrect; **1** names a relevant idea but cannot apply it; **2** reaches a mostly correct result with an important gap; **3** correct reasoning with a concrete example/evidence; **4** also handles the stated edge/failure case and explains a credible alternative or limit. Target **12/16** per fully attempted scenario set. This score is separate from the weekly project rubric.

For implementation questions, full credit requires actual code plus observed checks, not a proposed solution. A permission/data-loss defect cannot be averaged away by strong verbal answers. For design questions, several answers may be valid; assess consistency with stated requirements rather than matching a favored framework. Interview prompts are follow-up discussions: explain your mechanism, show an example, compare an alternative, and state a limit.

## 01 — Workspace and Git

- **Q4:** working tree 180, index/next commit 200. A normal build from working files checks 180, not necessarily the staged snapshot. Full credit identifies why green local output may not validate a partially staged commit.
- **Q5:** plausible alternatives include runtime version, lockfile/install mode, untracked config, manually changed DB schema, missing service, case-sensitive paths or working directory. Pair each with an observation/command; reinstalling everything is not a discriminating investigation.
- **Q6:** keep a coherent vertical contract change together when splitting leaves broken intermediate behavior. Split independently useful preparation/refactors when each commit remains understandable and valid. File count alone is irrelevant.
- **Q7:** inspect working/staged diffs and reproduce the staged state in a disposable mechanism if needed. Evidence must show which input the check used; no destructive cleanup of unrelated work.

## 02 — JavaScript

- **Q4:** results are 10, 0, `x`, and empty string. Examples include a valid zero amount/count or false preference. State when empty/zero should instead be rejected by validation.
- **Q5:** sorting mutates the copied array's order, while assigning the nested row title changes a shared row object. Create a replacement row on the path being edited. Preserve unaffected records rather than deep-cloning everything.
- **Q6:** reject gives explicit data quality; first/last-wins need ordering and duplicate reporting. Full credit ties the choice to import meaning, reproducibility and user feedback rather than calling one universally correct.
- **Q7:** new container and changed item when matched; unchanged items retain references; original fields remain untouched. Test missing ID, empty list and known priority values under a specified boundary contract.

## 03 — Async runtime

- **Q4:** yes, finished can print before completion. Awaiting forEach awaits its undefined return, not callback promises. Return/await a real aggregate or use an awaited sequential loop as appropriate.
- **Q5:** obsolete A must not change B's data/error/loading state. A generation/identity check must guard all relevant commits; cancellation alone is not the full state-authority policy.
- **Q6:** sequential may underuse capacity, unbounded promises can overwhelm memory/pool/DB, and bounded concurrency trades throughput for controlled resource demand. Measure latency, errors, queueing and DB capacity; pool size is not an automatic optimal worker count.
- **Q7:** both outcomes retained, errors observed, no unhandled rejection and deterministic completion tests. Reject a solution that silently replaces all failures with false success. State how the UI represents partial availability.

## 04 — TypeScript

- **Q4:** omission preserves, null clears, valid instant replaces. Undefined can be a JS property value but ordinary JSON object serialization omits it; invalid input must not collapse into clearing. Compiler optional-property settings do not replace runtime semantics.
- **Q5:** a cast checks neither JSON structure nor authenticity/authority. Validate external data and derive identity/roles through verified server mechanisms. An untrusted API's claimed role is not sufficient authorization.
- **Q6:** empty success is ready with an empty list. Refreshing with prior data may be a separate valid state if UX needs it; avoid contradictory booleans. Explain what data is safe to preserve on identity change.
- **Q7:** reject non-object/array/wrong-field shapes, distinguish presence/null/value, validate timestamps under the chosen contract and construct explicit allowed updates. Include evidence that omitted dueAt leaves old storage unchanged.

## 05 — HTML and accessibility

- **Q4:** a button in a form defaults to submission in the ordinary case. Use explicit type button for a non-submit Cancel and implement the agreed navigation/reset behavior.
- **Q5:** inspect `document.activeElement` and keyboard order. After removal, choose a meaningful next/previous row control or stable list heading/creation control, including empty-list behavior. Do not merely blur focus.
- **Q6:** field errors need associations and correction; an outage needs retained input and recovery; success needs confirmation appropriate to the journey. Focus changes and live announcements should be intentional and tested.
- **Q7:** summary links lead to correct fields; errors/names are programmatic; drafts survive; manual keyboard evidence exists. Do not claim screen-reader support based only on an automated role query.

## 06 — CSS

- **Q4:** outer width is 344px with content-box; with border-box and the same stated width it is 300px, leaving 256px for content. Margins, if any, are additional.
- **Q5:** inspect ancestors' stacking contexts, positioning, transforms, opacity and containment as applicable, plus how the dialog is rendered. Raising a descendant's z-index cannot always escape its ancestor context.
- **Q6:** preserve data relationships and meaningful headers; intentional table scrolling may fit, cards can simplify narrow views but alter comparisons. Explain focus, discoverability and screen-reader implications; hiding essential columns is not automatically acceptable.
- **Q7:** actual viewport/content/zoom/focus evidence; content shrinks/wraps appropriately; intentional overflow remains operable. No clipped action disguised as a layout fix.

## 07 — React

- **Q4:** replacement queues 1, updater makes it 2; the existing handler logs its render's 0. Full credit distinguishes queued next state from changing the handler's captured value.
- **Q5:** a custom hook invocation normally owns its own state. Lift ownership to the common parent or use an appropriate existing shared mechanism. A global store is not required for every pair of siblings.
- **Q6:** all listed policies can fit different products. Address losing work, memory/lifetime, identity and user expectation. Explain why key changes reset state and when that is intentional.
- **Q7:** draft separate from confirmed data; explicit transitions; failed save retains draft; cancel/reopen behavior proven. Side effects stay outside pure render/reducer logic.

## 08 — Browser data

- **Q4:** same query text can belong to an old account. Invalidate or partition in-flight authority/cache by identity; old work cannot repopulate after logout.
- **Q5:** delete succeeded at HTTP level, then JSON parsing failed on a bodyless response. Respect the response contract. A retry can report not-found or repeat other side effects depending on implementation; do not misrepresent the first success.
- **Q6:** valid choices include confirmation with navigation to detail, or refetching the current filtered page without inserting a nonmatching record. Explain page ordering/filter semantics and how the user finds the new request.
- **Q7:** three controlled timelines plus loading/error authority and no cross-account update. Full credit uses no sleeps and states the chosen cancellation mechanism's limits.

## 09 — HTTP

- **Q4:** no-cache allows storage with revalidation before reuse; it does not mean never store. Sensitive caching policy must consider shared and private caches and actual requirements.
- **Q5:** compare actual origins, browser error/network trace, preflight, credentials and response headers. A server-accessible endpoint can still have a browser-access policy failure; do not remove authorization to repair CORS.
- **Q6:** private data needs auth and appropriate cache policy; versioned public assets can use different caching; conditional writes must follow the selected ETag/precondition or application-version contract. Do not interchange 409 and 412 without explanation.
- **Q7:** capture real non-secret headers; tests demonstrate conditional behavior and continued access checks. A header-only mock is not proof of full browser cache behavior.

## 10 — API architecture

- **Q4:** 0, NaN and 2 respectively. A strict positive integer contract should reject malformed/empty syntax rather than relying on permissive coercion; specify defaults only for actual absence.
- **Q5:** status may change between check/write. Include applicable status/ownership/version predicates atomically or use an appropriate transaction/lock design. Explain both the invariant and zero-match outcome policy.
- **Q6:** only allowed DTO fields, explicit absence/null semantics, server-derived identity and safe projection. Renaming/removed fields, new required fields, nullability and error semantics can break existing consumers.
- **Q7:** evidence includes exact valid range and malformed/empty/repeated inputs. Check syntactic form, safe integer conversion and bounds; document whether duplicate parameters are rejected or follow another deliberate rule.

## 11 — SQL

- **Q4:** r1 has two non-null comment rows; r2 has one null-extended row. COUNT(*) yields 2/1; COUNT(c.id) yields 2/0. A WHERE condition requiring matching comment text removes r2.
- **Q5:** LIMIT applies to joined rows instead of unique requests. Page the request relation first then attach aggregates, or use a query whose grain remains one row per request. Confirm ordering/count/authorization stay correct.
- **Q6:** offset is simple but rows can shift; cursor needs stable ordering, a tie-breaker and compatible predicates. Neither inherently creates a historical snapshot across mutations. Cursor tampering must not bypass owner filters.
- **Q7:** verify fixture results and wrong-owner exclusion. Include zero-comment rows, ties, one-row-per-request semantics and count/list agreement; do not let a convenient mock hide the real query.

## 12 — Migrations and transactions

- **Q4:** without a unique constraint duplicate rows may both commit; with one, both contenders cannot successfully commit the same constrained value. A separate prior SELECT cannot eliminate the race.
- **Q5:** transaction scope belongs to a connection/client. Queries through the unrelated pool may autocommit or use another connection. Trace the driver's transaction client usage; do not log connection secrets.
- **Q6:** introduce compatible storage, deploy compatible read/write behavior, backfill/verify, enforce constraints when safe, then remove old fields after old callers are gone. Exact phases depend on requirement and table size; explain recovery limits.
- **Q7:** actual two-session waiting/row-count evidence, correct version predicate and preserved first update. Sequential unit checks alone do not demonstrate concurrent database behavior. UI must not silently overwrite the conflict.

## 13 — Authentication and authorization

- **Q4:** parent access says nothing about an arbitrary child ID unless the query also binds the child to that parent and applies visibility. Verify both relationship and actor permissions.
- **Q5:** establish token lifetime, verification, role source/cache and revocation design. Immediate revocation needs a mechanism supporting it; a long-lived self-contained claim does not automatically notice server-side changes.
- **Q6:** explicit matrix across actors/actions/relationships/state; consistent response disclosure. Include counts/exports/nested resources and privilege changes, not just frontend route guards.
- **Q7:** direct server calls show denial and unchanged storage; count/export reveal no cross-user data; wrong-parent test uses truly different resources. Random IDs are defense in depth, not permission checks.

## 14 — Web security

- **Q4:** SQL parameterization still protects its query values; new HTML rendering introduces a script-execution sink. Login/length validation do not establish HTML safety.
- **Q5:** stop sensitive logging, limit exposure/access, revoke compromised credentials as applicable and preserve appropriate incident evidence. Replace with safe categories/correlation. Test that synthetic token values are absent from output, not merely that a logger was called.
- **Q6:** plain text is simplest if sufficient; restricted markup requires safe rendering and URL rules; arbitrary HTML has much larger security/maintenance cost. State supported content and context-specific controls.
- **Q7:** actual boundary checks and postconditions; chosen CSRF mechanism exercised through the route if relevant. Clearly state uncovered threat classes instead of claiming total security.

## 15 — Reliability

- **Q4:** restart loses in-memory dedupe; a new key is a new logical operation under the contract; durable same-key outcome can prevent duplicates if atomically coordinated. Storage alone without correct transaction design is insufficient.
- **Q5:** 400 usually needs input correction, 401 identity recovery, 429 provider-specific delay/rate handling, and 500 may be transient but repetition still needs safety. Bound attempts/elapsed time and honor the actual provider contract.
- **Q6:** actor/operation scope, stable key, payload comparison, concurrent first attempt, outcome recording and expiry all defined. Draw a coherent atomic commit; do not promise external effects are rolled back by a database transaction.
- **Q7:** replay and concurrent attempts are distinct tests. Label fake/durable/real external boundaries separately. A local handler test cannot establish a provider's exactly-once guarantee.

## 16 — Testing

- **Q4:** mocking persistence can conceal an unauthorized committed write, wrong query predicates or a partial transaction. Check real stored state through the relevant integration boundary.
- **Q5:** inspect test order dependence, reset/fixture scope, globals, mocks, clock/timers, DOM/storage and background work. Reproduce a minimal failing pair before adding timeouts/retries.
- **Q6:** focused rule tests plus HTTP/DB permission and atomic-update tests, with a small browser journey for wiring. The concurrent status/write invariant requires relevant real database behavior, not a permissive repository fake.
- **Q7:** explicit boundary values and denied-operation data postcondition; actual old-code failure and repaired success. High line coverage does not substitute for these assertions.

## 17 — Debugging and observability

- **Q4:** client response mapping, stale closures, cache identity or rendering remain plausible. SQL changes lack evidence when row/response values are confirmed correct for the same operation.
- **Q5:** compare running source/artifact/runtime/config identities per instance, schema/migration state, routing and local state/caches. Correlate observed failures with the actual instance; avoid assuming one deployed image means all instances run it.
- **Q6:** safe request ID, route/outcome/duration/error class in logs; bounded aggregate categories in metrics. Explain cardinality, sensitive values and user-visible support reference without exposing internals.
- **Q7:** two competing hypotheses with distinguishing observations; focused fix/regression and honest limits. Changing many variables until failure disappears is weak causal evidence.

## 18 — Performance

- **Q4:** at most 100/1200 ≈ 8.3% reduction in total time under the stated additive model. Real work can overlap and measurements can differ; arithmetic is a prioritization bound, not a production prediction.
- **Q5:** tiny tables can favor a scan. Use representative size/distribution, matching queries, repeated measurements and plan/result comparison. Do not force an index simply to obtain a prettier plan.
- **Q6:** pagination bounds server/browser work; virtualization bounds rendered DOM but changes interaction; caching reduces repeated work with identity/freshness costs. Fit the product workflow and preserve access checks.
- **Q7:** before/after under comparable inputs, correct authorized results, repeated observations and limits. Reject capacity claims extrapolated from one local sample.

## 19 — Deployment

- **Q4:** not automatically; already-built public assets usually retain substituted values. Inspect generated assets/network URL and the actual tool's configuration lifecycle.
- **Q5:** browser uses public URL; API uses its listening/proxy/internal interfaces; DB uses private service address. Inspect process binding, exposed ports/proxy route, scheme and browser policy with concrete network evidence.
- **Q6:** nullable compatible addition can precede usage; enforce required semantics only after old writers/data are compatible. Recovering code and recovering deleted/transformed data are different problems.
- **Q7:** known release/config/schema, two-user smoke checks, controlled outage and observed restoration. Local evidence is useful but does not prove hosted TLS/network/secret configuration.

## 20 — CI and dependencies

- **Q4:** dependency resolution is constrained by the lockfile under its install mode; a downloaded moving script remains uncontrolled executable input. Pin/review the actual inputs and permissions.
- **Q5:** inspect test discovery/config, reported test count and real command. Introduce a known failing relevant test in an isolated change and verify failure; fast execution alone proves neither success nor omission.
- **Q6:** untrusted checks isolated with minimal permissions and synthetic services; protected release uses authorized source/artifacts and scoped credentials. Explain event trust and avoid running attacker-controlled code with release secrets.
- **Q7:** both failures observed and restored; source/artifact linkage recorded. A screenshot of a green check without commit/context is incomplete evidence.

## 21 — Requirements and design

- **Q4:** eligibility validation, repository/schema relationships, API contract, UI staff choices, fixtures/tests and docs can change. Full credit identifies a clarifying question before implementing an arbitrary policy.
- **Q5:** one agreed definition of overdue/status/timezone/authorization, consistent query semantics, and independent runtime enforcement where needed. Shared types alone cannot prevent every implementation divergence.
- **Q6:** a monolith simplifies local transactions/releases/operations; separate services can offer independent ownership/scale but add network failures, contracts, coordination and operational burden. Two-person/current workload assumptions matter.
- **Q7:** observable examples include denied/missing/invalid/concurrent cases, actual affected paths, uncertainty and deferred scope. A review must identify whether another person can implement/test the contract.

## 22 — Time/files/integrations

- **Q4:** 07:00 on 1 December Bangkok and 16:00 on 30 November at UTC−08. They represent one instant. A calendar promise requires business timezone and day semantics beyond offset arithmetic.
- **Q5:** supplementary-plane emoji and combining sequences expose different length models; compare JS UTF-16 count, SQL characters and product graphemes, plus normalization/trim rules. Do not silently expand one limit while retaining inconsistent contracts.
- **Q6:** decide visibility at queueing, execution and download; revocation can require rechecking authority and preventing existing links from bypassing policy. Retention, auditing and credential scope are explicit product/security choices.
- **Q7:** fixed clock, null/exact boundary/status cases and stable instant comparison; display timezone must not accidentally alter an instant rule. Invalid timestamps fail under the stated input contract.

## 23 — Computer science

- **Q4:** 0, 1, 0, 4. Correct trace preserves a half-open range and returns an insertion position even when no element meets the target.
- **Q5:** for `[1,3]` target 2, a half-open implementation using high = middle - 1 can return 0 instead of 1. Keep interval conventions consistent and prove the remaining candidate is not discarded.
- **Q6:** sets for membership, maps for counts, queue/indegree or another justified traversal for dependencies. Define duplicate policy, cycles, expected scale and storage costs.
- **Q7:** deterministic comparison against a correct simple oracle; duplicates/empty/extremes; termination and logarithmic shrinking explained. Array access assumptions and auxiliary/output space distinguished.

## 24 — Teamwork and capstone

- **Q4:** unit checks and local behavior can be claimed with their evidence. Upgrade compatibility, hosted release, restore and full readiness remain unverified. Avoid “all tests pass” when only a subset ran.
- **Q5:** unauthorized committed write is a blocker with concrete reproduction/postcondition. Naming inconsistency is lower priority unless it causes a real error. Repair ordering/atomic authorization and add a regression before stylistic cleanup.
- **Q6:** communicate a coherent safe slice, completed evidence, optional deferred behavior and revised estimate/decision needed. Missing security/data integrity is not an ordinary optional polish item.
- **Q7:** real diff, reproducible commands, assistance disclosure, release evidence and a defensible explanation. Assess independent variation; later correction is valuable but does not rewrite the original timeboxed outcome.
