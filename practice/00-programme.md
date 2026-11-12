# Four weeks of full-stack engineering practice

Start with [the baseline assessment](01-baseline.md), then follow [the daily tickets](02-tickets.md). Use [the submission template](03-submission.md) when asking for review.

The [junior full-stack lesson library](../lessons/README.md) supplies topic explanations, selected official readings, quizzes, answer guides and multi-file labs to study alongside this plan.

## Your starting point and target

This programme targets junior full-stack engineering roles through 50 hours of weekly deliberate practice. It builds on exposure to React, TypeScript, Python/Django, Bun/Elysia and PostgreSQL. Assessment results and submitted code determine the appropriate difficulty.

After four weeks, the target is to independently deliver a small full-stack feature: clarify requirements, model data, implement UI/API/database changes, test failure cases, debug problems, deploy, and explain your decisions. Four weeks cannot guarantee readiness for every client assignment or engineering role. We will measure these specific skills instead.

## One project: ClientDesk

Build a service-request tracker for a small agency. Clients submit requests, staff triage them, and each client sees only their own requests. This gives you real ownership boundaries, relational data, asynchronous UI, and changing requirements without the scope of an entire business platform.

Use React + TypeScript, a TypeScript HTTP API, and PostgreSQL. Keep one backend runtime/framework throughout. Your existing Bun/Elysia experience is a reasonable starting point if it reduces setup work; Node is also acceptable. Explain your choice in three sentences. We are assessing transferable skills, not framework memorization.

The core entities are users and requests; comments arrive in week 3. A request has an ID, title, description, status, owner, and timestamps. Start with statuses `new`, `in_progress`, and `resolved`. Clients create requests and read their own; staff read all requests and change status. Client identity must eventually come from a verified session, never a submitted owner ID.

Scope excludes payments, uploads, chat, microservices, and elaborate visual design. Use synthetic data. Do not spend the training budget on extra infrastructure or dependencies.

## Weekly outcomes

| Week | Ownership level | Evidence required |
| --- | --- | --- |
| 1 | Guided implementation | Working React → API → PostgreSQL create/list flow, validation, meaningful tests, clear setup instructions |
| 2 | Connected feature ownership | Authentication, server-enforced permissions, search/filter/pagination, end-to-end test of a user journey |
| 3 | Debugging and maintenance | Comments, a schema migration, measured query investigation, bug reports with regression tests, automated checks |
| 4 | Independent delivery | New client feature, change request, deployed demo, incident exercise, timed implementation and technical defense |

## Schedule: 50 hours per week

Use five 9-hour working days, one 5-hour review day, and one full rest day. Breaks are additional; hours are an available budget, not a score. Choose your own start date. Stop adding scope when the day's budget ends and record what remains.

Each 9-hour day: 30 minutes planning, 90 minutes targeted study/exercises, 4 hours implementation, 90 minutes testing/debugging, 1 hour explanation and review. On the 5-hour review day: 2 hours assessment, 2 hours corrections/review, 1 hour retrospective. The daily tickets specify how to use those blocks.

Within the study block, spend about 30 minutes on a small programming exercise: arrays/maps, frequency counting, sorting, stack/queue, binary search, or traversing a tree. Explain correctness and complexity, test edge cases, then connect the idea to actual application code when relevant. Do not sacrifice the core deliverable for interview puzzle volume.

## How assistance changes

| Week | Independent implementation target | Allowed help outside assessment |
| --- | --- | --- |
| 1 | 40% of implementation time | Concept explanations, documentation, progressively stronger hints |
| 2 | 60% | Review your proposed design; ask for hints after attempting a solution |
| 3 | 75% | Debugging questions and code review after your investigation |
| 4 | 90% | Review after implementation; independent final assessment |

Independent means no generated implementation or autocomplete suggestions; official documentation, your notes, compiler, debugger, and test runner are allowed. Record assistance honestly. AI-assisted work is useful practice, but only independent attempts demonstrate independent ability.

When stuck, spend 25 focused minutes gathering evidence: expected/actual behavior, smallest reproduction, relevant logs, and a hypothesis. Then request one hint. If you receive a full solution, rebuild that part independently the next day and explain it. Do not spend hours silently stuck to protect an independence percentage.

## Definition of done for every ticket

- Observable acceptance criteria pass, including the specified failure cases.
- Relevant type checks, build, and tests pass; record exact commands and results.
- You can trace the affected data from browser to API to database and back.
- User input is validated at the appropriate boundary; protected operations check permission on the server.
- You can explain one design choice, one alternative, and one remaining limitation.
- The change has a focused Git commit and a short review submission. Do not commit secrets.

## Review scorecard

Each category is scored 0–4: 0 = absent; 1 = major errors or needs a full solution; 2 = partial success or substantial hints; 3 = works and can be explained with minor corrections; 4 = independently handles edge cases and defends trade-offs.

| Category | Weight |
| --- | --- |
| Correct behavior and requirements | 30 |
| Independent implementation and understanding | 25 |
| Testing and evidence-based debugging | 20 |
| Data/API design and security | 15 |
| Delivery and communication | 10 |

Total = sum of `(category score / 4) × weight`. Weekly target: 80/100. Passing also requires the week's core acceptance criteria. Unresolved cross-user data access, data loss, or inability to run the core flow prevents passing regardless of score. Scores come from reviewed evidence; there is no score until work is submitted.

If you miss a gate, use the next day's study block and remove a stretch task to repair it. If the core flow remains broken, defer new scope. If the baseline shows major gaps, reduce the four-week feature scope rather than rushing through insecure or unexplained code.

## How to work with me

Submit the baseline first. For each later ticket, share the submission template plus code/diff or a repository I can access. Ask: “Review ticket W1-D2. Give findings first, score my work, and assign one follow-up exercise. Do not rewrite my solution.” I can adapt the next ticket when you submit evidence; this plan does not automatically schedule reminders or inspect your work in the background.

For a surprise debugging exercise, ask: “Create a separate broken practice copy of my current code with one realistic defect. Hide the cause until I submit my investigation.” This gives unfamiliar-code practice without modifying your working application.
