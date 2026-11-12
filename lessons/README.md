# Junior full-stack engineering lesson library

This is your study companion to [the four-week practice plan](../practice/00-programme.md), tailored to your React/TypeScript, Django, Bun/Elysia and PostgreSQL exposure and your goal of needing less generated code. It is a core junior curriculum, not a claim that a junior must master every technology or that reading alone proves competence.

**Start here:** [learning route](00-start/learning-route.md), then lesson 01. Read the explanation, follow the selected official readings, do the task, answer the quiz, and only then open the [review guide](review/answer-guide.md). Save your work with the [evidence template](00-start/evidence-template.md).

## Expanded study material

Every lesson now adds a worked walkthrough, practical techniques with limits, workplace uses, linked concepts, four scenario questions and two interview discussion prompts. The library has **168 lesson questions** (72 foundation + 96 scenario) and **48 interview prompts**. These are original practice prompts, not a list of actual company interview questions.

- [Concept map](00-start/concept-map.md): trace a feature through the stack and connect related lessons.
- [Pattern catalog](00-start/pattern-catalog.md): when common patterns help, what they guarantee and how they fail.
- [Executable examples](examples/README.md): six small patterns with standard-library tests.
- [Four integrated checkpoints](review/checkpoints.md): realistic code, data and deployment scenarios crossing several lessons.
- [Scenario marking guide](review/scenario-guide.md): expected reasoning and evidence for questions 4–7; open after attempting them.
- [Curriculum review](review/curriculum-review.md): gaps found and how this revision addresses them.

Complete foundation questions 1–3 first; choose deeper questions according to the task/weakness you are practicing. The expanded bank is not extra mandatory work to squeeze into the original four weeks.

Use the [stack translation](00-start/stack-translation.md) to connect this material to Django/Bun experience, the [glossary](00-start/glossary.md) when terminology is unfamiliar, and the [mastery checklist](review/mastery-checklist.md) to track demonstrated skills.

The [framework reading choices](00-start/framework-readings.md) add specific Elysia/Bun, Django and OpenAPI references. See [verification notes](review/verification.md) for checks performed on these materials and their limits.

## Contents

| Lesson | Topic | Prerequisites |
| --- | --- | --- |
| [01](01-foundations/01-workspace-git.md) | Terminal, repository navigation, Git, dependencies | None |
| [02](01-foundations/02-javascript.md) | Values, references, functions, collections, modules | 01 |
| [03](01-foundations/03-async-runtime.md) | Promises, event loop, concurrency, cancellation | 02 |
| [04](01-foundations/04-typescript.md) | Types, narrowing, runtime validation, contracts | 02 |
| [05](02-frontend/05-html-accessibility.md) | HTML, forms, keyboard and accessible behavior | 01 |
| [06](02-frontend/06-css-responsive.md) | CSS cascade, layout, responsive interfaces | 05 |
| [07](02-frontend/07-react-state.md) | Components, state, effects, forms, routing | 03–06 |
| [08](02-frontend/08-client-server-data.md) | Fetch, server state, races, browser storage | 07, 09 |
| [09](03-backend-data/09-web-http.md) | DNS, TLS, HTTP, cookies, CORS, caching | 03 |
| [10](03-backend-data/10-api-architecture.md) | Routes, business rules, validation, error contracts | 04, 09 |
| [11](03-backend-data/11-relational-sql.md) | Modeling, joins, SQL, constraints, pagination | 10 |
| [12](03-backend-data/12-migrations-transactions.md) | Migrations, transactions, conflicts, retries | 11 |
| [13](04-security/13-authentication-authorization.md) | Sessions, identity, roles, object permissions | 09–12 |
| [14](04-security/14-web-security.md) | XSS, CSRF, injection, secrets, abuse prevention | 13 |
| [15](04-security/15-api-reliability.md) | Idempotency, retries, rate limits, external APIs | 03, 12–14 |
| [16](05-quality/16-testing.md) | Unit, integration, component and browser tests | 07, 10–13 |
| [17](05-quality/17-debugging-observability.md) | Reproduction, debugging, logs, incident response | 16 |
| [18](05-quality/18-performance.md) | Measurements, query plans, browser performance | 08, 11, 17 |
| [19](06-delivery/19-runtime-deployment.md) | Processes, environment, Docker, deployment | 09–14 |
| [20](06-delivery/20-ci-dependencies.md) | CI, lockfiles, supply chain, release checks | 16, 19 |
| [21](07-engineering/21-design-requirements.md) | Requirements, boundaries, trade-offs, architecture | 10–12 |
| [22](07-engineering/22-files-time-integrations.md) | Files, time, money, background jobs, webhooks | 12–15 |
| [23](07-engineering/23-cs-interviews.md) | Data structures, complexity, OS/network basics | 02–03, 11 |
| [24](07-engineering/24-teamwork-capstone.md) | Reviews, estimates, handoffs, full-stack delivery | Core lessons above |

## Practical environments

- [Repository map](labs/00-repository-map.md): where real application changes go and how the files interact.
- [Multi-file debugging lab](labs/01-request-flow/README.md): actual runnable JavaScript modules with a deliberately incomplete behavior test. No package install or database required.
- [SQL and migration lab](labs/02-sql-migrations/README.md): runnable PostgreSQL schema and isolated exercises, requiring your own disposable database.
- [Browser integration lab](labs/03-browser-integration.md): UI/network tasks in your ClientDesk project.
- [Release and incident lab](labs/04-release-incident.md): deployment, recovery, and operational evidence.
- [Feature change lab](labs/05-feature-change.md): a client brief that crosses UI, API, database, tests, and documentation.

## How current guidance is used

Official sources were checked on **11 November 2026**. Each lesson links specific readings and tells you what to extract. These links are reading assignments; the explanations and exercises are original teaching material. Versions and hosting behavior change. Use documentation matching your installed versions, keep a lockfile, and check the [Node release schedule](https://nodejs.org/en/about/previous-releases) before selecting a supported runtime. Do not copy a version number from an old tutorial.

The main habits emphasized here are explicit boundaries, observable behavior, server-enforced permissions, accessible interfaces, and changes supported by tests and measurements. No single framework, folder structure, test ratio, or database fits every team.

## What counts as learning

You should be able to build, explain, test, and modify the behavior on a different example the next day. Each lesson retains three foundation questions and its original applied task, plus four deeper scenarios. Score foundation answers 0–2: 0 incorrect/missing, 1 partly correct, 2 correct with an example. Target 5/6 plus the task's acceptance criteria. The scenario guide uses a separate 0–4 rubric, targeting 12/16 when all four are attempted. An answer guide supports self-review, not a hiring certification.

Independent assessments allow official docs, your notes, compilers and debuggers, but no generated implementation. Outside assessment, use AI to explain unfamiliar concepts, challenge your hypothesis, or review your work. Record help and reattempt difficult parts independently.
