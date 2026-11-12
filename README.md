# Full-Stack Engineering Practice

A structured engineering practice repository covering JavaScript, TypeScript, React, HTTP APIs, PostgreSQL, security, testing and delivery. It combines topic-based study with realistic feature requests, debugging exercises and explicit acceptance criteria.

The aim is end-to-end feature ownership: clarify requirements, trace data across the stack, implement a focused change, verify failure cases and explain the trade-offs.

## Explore the work

| Area | Contents |
| --- | --- |
| [Lesson library](lessons/README.md) | 24 lessons with walkthroughs, official readings, practical patterns and cross-topic links |
| [Executable patterns](lessons/examples/README.md) | Immutable updates, strict input parsing, async race handling, state transitions, due-date rules and binary search |
| [Request-flow lab](lessons/labs/01-request-flow/README.md) | A multi-file client / route / service / repository debugging exercise |
| [PostgreSQL lab](lessons/labs/02-sql-migrations/README.md) | Relational schema, seed data, migrations, query exercises and concurrency practice |
| [Integrated checkpoints](lessons/review/checkpoints.md) | Browser races, nested-resource permissions, SQL counts and release investigation |
| [Practice programme](practice/00-programme.md) | Four-week roadmap, daily tickets, definition of done and review rubric |

## Run the JavaScript checks

Requires Node.js with the built-in test runner; verified with Node 24.19.0. No package installation or database is needed for these checks.

```sh
node --test lessons/examples/patterns.test.mjs lessons/labs/01-request-flow/tests/baseline.test.mjs lessons/labs/01-request-flow/tests/exercise.test.mjs
```

Current expected result: **24 passing tests and one intentionally skipped exercise test**. The request-flow lab contains a documented filtering defect for investigation; enabling its exercise test reproduces the failure. It is not presented as a complete production implementation.

To run the request-flow demonstration:

```sh
node lessons/labs/01-request-flow/demo.mjs
```

## Engineering focus

- Explicit runtime validation and API contracts.
- Server-enforced identity, ownership and resource permissions.
- Relational modeling, safe queries, migrations and atomic updates.
- Accessible interfaces, clear state ownership and reliable asynchronous behavior.
- Regression tests, evidence-based debugging and measured performance.
- Reproducible setup, release verification and clear technical communication.

## Current scope

This repository contains learning materials, executable JavaScript patterns and practice labs. **ClientDesk**, the planned React/TypeScript/PostgreSQL service-request tracker, is specified in the [daily tickets](practice/02-tickets.md); a complete application is not implemented yet. Future feature work can be tracked through focused commits, tests and decision notes.

The lesson library includes 168 practice questions, 48 interview discussion prompts and separate review guides. These materials are preparation resources; they do not represent completed assessments or claimed production experience.

PostgreSQL exercises require a separately configured disposable database. PostgreSQL-specific scripts have not yet been executed in the verification environment. Browser, cloud deployment and backup-restoration exercises also require their own observed evidence. See [verification notes](lessons/review/verification.md) for details.

## Study and review

Start with the [learning route](lessons/00-start/learning-route.md) and [baseline assessment](practice/01-baseline.md). Use the [concept map](lessons/00-start/concept-map.md) and [pattern catalog](lessons/00-start/pattern-catalog.md) to connect topics, then record actual implementation and test evidence with the [submission template](practice/03-submission.md).

Official readings are linked at the point of use. Examples and exercises state their assumptions and limits so they can be evaluated independently.
