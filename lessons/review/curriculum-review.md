# Curriculum review and changes

What this change does: it expands the existing 24-lesson curriculum while keeping the original tasks and four-week project. The added material makes reasoning, failure cases, cross-file changes and assessment criteria more explicit.

## Findings addressed

1. **Worked examples jumped from idea to result.** For example, [async lesson 03](../01-foundations/03-async-runtime.md) originally showed Promise.all composition but no callback/ownership failure walkthrough. Added unawaited forEach, resource limits and stale success/error/cleanup reasoning. Similar step-by-step examples now appear in every lesson.
2. **Quizzes under-tested transfer.** The original [React quiz](../02-frontend/07-react-state.md) and [SQL quiz](../03-backend-data/11-relational-sql.md) mainly asked conceptual explanations. Added four scenarios per lesson: prediction, debugging, design and implementation. The separate marking guide states minimum evidence and edge cases rather than rewarding vocabulary alone.
3. **Pattern names lacked consistent selection criteria.** Transactions, caching and retries were mentioned, but a learner could copy them without knowing the guarantee/limit. Added concrete interleavings, alternatives, misuse examples and a linked pattern catalog.
4. **Concept connections required too much inference.** Repository, browser, authorization and query lessons were separate. Added local concept links per lesson, a cross-stack map and integrated checkpoints using realistic files, code and observations.
5. **Most snippets were illustrative only.** Added six small executable patterns with 15 meaningful standard-library tests, including obsolete asynchronous results and algorithm-oracle comparisons. These are explicitly separated from actual HTTP/database/React evidence.
6. **Expansion could overload the original schedule.** Updated study guidance to select deeper practice inside existing blocks. The full new question bank is reusable study material, not an additional mandatory four-week workload.

## Deliberate exercise, not a defect to repair here

The [multi-file lab](../labs/01-request-flow/README.md) intentionally retains one filtering defect and a skipped exercise test. Solving it is the learner's task. Its baseline is not described as proof of complete correctness.

## Review scope and limits

Reviewed lesson text, selected readings, local links, answer criteria and existing lab boundaries. New code examples receive executable checks. No learner application has been implemented, deployed or assessed. SQL files require PostgreSQL execution; examples do not establish real authentication, cloud operation or external-service behavior.

Verdict: use the expanded material for study and reviewed practice. Read [verification notes](verification.md) for observed checks and remaining limits.
