# How to use these lessons without doubling your workload

The original plan already budgets 50 hours/week. Use these lessons inside its study and implementation blocks; do not add all reading times on top. A normal lesson cycle is 25–45 minutes of explanation/selected reading, 45–90 minutes of focused practice, and 10–15 minutes of quiz/explanation. Larger labs replace project implementation time. Topics you cannot yet apply need extra days after the four weeks.

The expanded walkthrough/scenario sections are a reusable deeper study bank. On a first pass, read the core explanation/example and answer foundation questions 1–3. Use a later block for one relevant walkthrough and scenario rather than reading every extension at once. Implementation scenarios can replace that day's small coding exercise or a project subtask. The complete library may take longer than four weeks to work through carefully.

## Four-week companion route

| Practice week | Study these lessons | Apply them here |
| --- | --- | --- |
| 1 | 01–07, 09–12; skim 16 before first tests | One create/list vertical slice; do not try to finish every extension |
| 2 | 08, 13–16 | Identity, ownership, asynchronous UI, tested user journey |
| 3 | 17–20, revisit 12 and 15 | Bug investigation, concurrent edits, performance and checks |
| 4 | 21–24, revisit weak topics | Requirements, time semantics, deployment and independent feature |

If the baseline shows gaps, spend more time on lessons 02–04 and 07, keep only create/list scope initially, and extend the reading route beyond four weeks. Finishing the calendar is less valuable than being able to explain your code.

## Three levels of depth

**Implement independently:** ordinary JS/TS, accessible forms and layouts, React state, HTTP CRUD, SQL relations, validation, permission checks, basic tests, Git, reproducible setup, and systematic debugging.

**Apply with documentation and review:** established authentication tooling, migrations, concurrent updates, query plans, CI, deployment, secrets, monitoring, backups, safe external integrations. Juniors should understand the risks and seek review on sensitive production changes.

**Recognize and explain when relevant:** SSR/hydration, caches, queues, NoSQL, GraphQL, WebSockets, distributed systems, container orchestration and infrastructure as code. These are not prerequisites to your first junior application. Learn a team's actual stack when needed.

## Repeatable study loop

1. Before reading, write what you think the system does.
2. Read only the assigned sections; create a two-paragraph explanation in your own words.
3. Implement the task. List affected files before editing.
4. Check one normal case, one boundary, and one failure. Use automated tests where useful.
5. Answer the three quiz questions without notes.
6. Consult the answer guide and record corrections, then explain the topic aloud in two minutes.
7. Next day, reproduce a smaller variation without generated code.

## Deeper retrieval and transfer

Each lesson now has Q4 prediction, Q5 debugging, Q6 design and Q7 implementation, followed by two interview prompts. Keep prediction answers before you run the code so you can compare your mental model with observations. For debugging, name competing hypotheses and the evidence separating them. For design, state assumptions and an alternative. For implementation, submit actual code/check results.

Use the [scenario rubric](../review/scenario-guide.md) after the attempt. You do not need to do all four scenarios in one sitting. Choose two weaker lessons per week for a full scenario set, and reuse a [checkpoint](../review/checkpoints.md) as an alternative weekly review. Track partially attempted vs completed assessments honestly.

Use the [concept map](concept-map.md) to revisit related lessons and the [pattern catalog](pattern-catalog.md) to compare techniques. Interview practice should point to your own implementation and evidence rather than memorized model answers.

For review, submit evidence with [this template](evidence-template.md). If stuck, gather a reproduction and hypothesis before requesting a hint. Avoid replacing investigation with repeated code generation.

## Reading strategy

“Required” means selected sections for today's task, not the entire site. “Later” means deeper reference when the requirement appears. Keep a glossary of terms you can explain using your own app: origin, process, migration, session, constraint, transaction, race, invariant, idempotency, latency, and permission.
