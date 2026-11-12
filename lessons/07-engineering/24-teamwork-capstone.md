# 24 — Deliver work another engineer can trust

**Goal:** demonstrate feature ownership, clear communication and honest limits. **Prerequisite:** core lessons 01–23; advanced extensions are optional. **Practice-plan link:** W4-D5/D6.

## Lesson

Ownership begins before code and continues after merge. Confirm the problem, inspect current behavior, identify affected files, state assumptions, estimate uncertainty, implement a coherent slice, test it, request review, release through the team's process, and check the outcome. Being independent includes knowing when a risky decision needs review.

A useful pull request explains the concrete problem, resulting behavior, key trade-offs and validation. A reviewer should understand it without your chat history. Keep the diff focused but complete: omitting a migration or permission test to make a patch smaller leaves the work unfinished. Separate unrelated formatting or dependency churn.

Review correctness first: can the code expose data, lose updates, misrepresent a failed save or corrupt existing rows? Then consider tests, maintainability and measured performance. Explain impact with a reproducible case and a specific direction. Distinguish a blocker from a preference. When responding, inspect the evidence; neither defending every line nor accepting every suggestion demonstrates judgment.

Communicate blockers early with what you tried, what evidence you have and the decision needed. Avoid confident claims unsupported by tests. “Unit checks passed; production restore remains unverified” lets a teammate make a better decision than “all done.” Estimates improve when you compare forecast to actual work and explain surprises.

A portfolio should make this evidence easy to find: a running synthetic-data demo, clear setup, a focused feature diff, meaningful tests, one debugging write-up and a decision record. Discuss what you personally implemented and what help you used. This is more useful than claiming expertise in every framework.

## Required reading

- [Git branching and collaboration](https://git-scm.com/book/en/v2): revisit branching and remotes for the actual team workflow.
- [Your four-week review rubric](../../practice/00-programme.md): use the same scoring so claims are comparable.
- [Evidence template](../00-start/evidence-template.md): review your own work as if someone else must maintain it.

## Final task

Complete the [cross-stack feature change](../labs/05-feature-change.md) or the independent W4-D5 archive ticket. Use the specified timebox, record help, and report the original-time-limit result separately from later corrections.

Deliver: requirement examples, affected-file map, implementation, migration, permission/regression tests, setup/release notes, known limitations and a five-minute technical explanation. Then review a separate patch or ask for a deliberately flawed review example.

**Acceptance:** another developer can run it; defined requirements pass; no unresolved critical security/data-loss defects; you can explain browser-to-database behavior and two trade-offs; checks and release status are evidenced. Ask for external review using the original weighted rubric. Self-scoring alone is not proof of readiness.

## Quiz

1. What should a reviewer understand from your PR description without reading chat history?
2. How do you distinguish a blocking correctness issue from a preference?
3. What evidence supports saying you can independently own a small full-stack feature?

## After the month

Use observed gaps to select deeper practice: unfamiliar-repository debugging, another deployment, stronger SQL, accessibility testing, or timed interview exercises. Explore GraphQL, WebSockets, NoSQL, queues, SSR, distributed systems or infrastructure automation when a real requirement or target role makes them useful. No junior curriculum can exhaust software engineering; the transferable skill is learning the needed system while preserving correctness.

## Walkthrough: communicate a coherent partial result

Instead of “almost done,” report: “The API and migration support assignment, including denial tests. The staff control works locally. Client display and hosted smoke testing remain. I underestimated filtering changes; I can finish the core display in two hours or defer Unassigned filtering with client agreement.”

This identifies completed behavior, evidence, uncertainty and a concrete scope decision. It does not disguise an incomplete feature as complete. If a security invariant is missing, do not offer to ship that gap as an ordinary cosmetic deferral.

## Techniques and patterns

**Write a reviewer-facing description:** trigger/problem → resulting behavior → key trade-off → validation → release/data implications. Remove conversational history that does not help assess the final patch.

**Classify findings by consequence:** “client A can update B's row with this direct request” is a blocker. “I prefer a different variable name” is a preference unless ambiguity causes a concrete correctness problem. Give reproducible evidence and a direction for repair.

**Keep estimates revisable:** record assumptions and uncertainty; update as evidence arrives. A range with identified unknowns can be more honest than an unsupported exact number.

**Prepare a technical defense from your own code:** trace one request, show one denied operation, explain one failure/recovery path, compare two plausible designs and identify a remaining limit. Do not memorize an architecture speech unrelated to the implementation.

**Use AI transparently:** distinguish generated implementation from reviewed suggestions and independent work. Demonstrate understanding by modifying/debugging a variation yourself.

**Close the delivery loop:** confirmation after release matters. A merged PR is evidence of code integration; a verified user journey supplies different evidence of behavior in the target environment.

Real use: teammates and clients need an accurate picture of what they can rely on, especially when deadlines require reducing scope.

## Connections

[Requirements](21-design-requirements.md) define done, [testing](../05-quality/16-testing.md) supplies behavioral evidence, [incident notes](../05-quality/17-debugging-observability.md) explain failures, and [deployment](../06-delivery/19-runtime-deployment.md) verifies the target environment. Use the [mastery checklist](../review/mastery-checklist.md) to link claims to artifacts.

## Scenario practice — Q4–Q7

4. **Predict:** all unit tests pass, migration upgrade is untested, and the demo is local only. Which completion claims are supported and which are not?
5. **Debug/review:** a patch returns 403 after updating the row and also contains a naming inconsistency. Write two findings with correct priority, concrete impact and smallest repair direction.
6. **Design:** a client deadline is today; the core feature works but an optional history view does not. Propose a scope/status message distinguishing optional deferral from a critical permission or data-integrity gap.
7. **Implement:** submit a capstone diff plus requirement examples, command/results, assistance log, release status and a five-minute explanation. Have a reviewer ask one unexpected change and assess whether you can implement it independently.

## Interview discussion

- “Tell me about a trade-off or disagreement.” Follow-up: what evidence changed the decision and what did you personally do?
- “How do you know a feature is done?” Follow-up: distinguish coding, review, deployment and observed user behavior.

Use the [scenario guide](../review/scenario-guide.md) and original scorecard; polished writing cannot compensate for a missing invariant.
