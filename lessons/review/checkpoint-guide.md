# Checkpoint review guide — spoilers

Review the [checkpoint artifacts](checkpoints.md) first. These are reference directions, not a demand for one folder structure or framework.

## A — Expected diagnosis

Under the given completion order, A's old callback runs last and can replace both record and draft. Current route heading may still be based on B's URL while data comes from A. Correct response authority uses an active request/identity generation or the framework's equivalent loader/query lifecycle. Guard rejection and cleanup too; abort supported I/O as useful, but do not present abort as proof of remote rollback.

Draft navigation is a separate product rule: preserve drafts by ID, prompt, or discard intentionally. Do not let a background refresh overwrite newly typed input without that policy. Good tests control A/B completion and identity changes; good UI evidence includes usable pending/error feedback and retained edits.

Do not require backend changes just because this is a full-stack exercise if response evidence shows the backend returns correct data. Inspect relevant contracts but repair the demonstrated cause.

## B — Expected diagnosis

Actor A can use parent r1 with child c2; the parent check passes, but the child is unrelated and belongs under B's request. Fetch using both parent/child relationship and appropriate visibility, or verify the relationship explicitly under a coherent policy. Return only allowed fields. The authenticated actor must still come from verified middleware.

Good tests cover a real wrong-parent pair, not two comments accidentally seeded under one request. Staff behavior must follow the contract: staff access to all requests does not necessarily mean a URL may misrepresent the parent-child relationship. Unknown/missing/forbidden paths should respect the agreed non-disclosure policy.

Lists/counts/exports require their own direct evidence. Fixing one route does not prove every entry point is scoped.

## C — Expected diagnosis

The current inner join yields two qualifying r1 comment rows for A. r2 is resolved but has zero comments, so its missing status exclusion is hidden by this fixture. The broken query returns **2**; the correct request count is **1**. Add a resolved request with a comment to expose the separate missing-status defect. A count over authorized requests with the proper status and due predicate avoids comment multiplication; if comments are a filter, use a correct existence/aggregation design.

No due date does not qualify under the chosen rule; exactly-due does not qualify under strict comparison. Use a fixed clock and the same semantic predicates for list/count. Count all matching authorized requests, not only the page.

Both staff read version 4; without an atomic condition both can overwrite. A version-predicate update lets one reach version 5 and the stale contender affect zero rows. Distinguish absent/forbidden/stale according to the API policy, and do not blindly repeat a full stale replacement.

Fresh/upgrade migrations preserve old rows with explicit defaults/null policy. Real two-session behavior is stronger evidence than an always-successful repository mock.

## D — Expected diagnosis

The built browser calls its own user's localhost; the supplied server runtime value has not rewritten that artifact. Two app revisions also coexist, which requires compatibility verification or a controlled consistent rollout. The facts do not establish data loss or justify destructive schema rollback. The untested upgrade path is a verification gap, not proof it failed.

Trace known source/lockfile/public build config/artifact to each serving instance and static asset. Correct browser-reachable URL/proxy behavior, use the actual tool's configuration mechanism, verify HTTPS/origin/session behavior and run two-user protected smoke checks. Add reproducible fresh/upgrade checks where needed. Distinguish readiness, local unit checks and actual target-environment evidence.

Strong status reports say what users cannot do, what was observed, what mitigation is in progress, which risks remain and what check closes the incident. They do not claim restored data or tested backups without a restore observation.
