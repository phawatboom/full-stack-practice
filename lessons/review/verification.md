# Materials verification

Checked on 11 November 2026 in the provided Windows workspace.

- 24 numbered lessons have explanation, required reading, practice task and three foundation quiz questions each (72 total).
- Every lesson also has one expanded walkthrough, techniques/patterns, concept connections, four scenario questions and two interview prompts: 168 numbered lesson questions and 48 interview prompts overall.
- The scenario guide has marking criteria for all 96 new scenario questions. Four additional integrated checkpoints have separate review guidance.
- Local Markdown links and fenced-code balance were checked across the library and root index.
- All included `.mjs` files passed Node syntax checks.
- With Node 24.19.0, the original debugging lab produced 9 passing tests and 1 deliberately skipped exercise test.
- Six new executable teaching patterns have 15 passing tests covering immutable reference updates, strict bounded query parsing, obsolete async success/error/identity handling, fixed-clock due dates, save transitions and binary-search comparison with a linear oracle.
- The combined current run produced **24 passing tests, 0 failures and 1 deliberately skipped exercise test**. The strict parser's invalid cases include trailing whitespace and line terminators.
- In a temporary copy only, enabling the exercise reproduced the intended failure. Applying the focused filtering correction in that copy produced 10 passing tests. The delivered exercise remains unsolved.
- Official reading destinations were inspected through web browsing. Version-specific behavior still needs to be matched to the learner's installed tools.

Current combined test command from the repository root:

```powershell
node --test lessons/examples/patterns.test.mjs lessons/labs/01-request-flow/tests/baseline.test.mjs lessons/labs/01-request-flow/tests/exercise.test.mjs
```

The full lesson library currently contains 61 files. The expansion is reusable study material; it does not add every scenario to the original mandatory weekly workload. See the [curriculum review](curriculum-review.md) for the teaching gaps addressed.

## Limits of this verification

PostgreSQL/`psql` was unavailable, so SQL files were statically reviewed but not executed. The SQL lab requires a disposable database and observed execution results before it can be called passed.

ClientDesk is still the learner's implementation task. These materials do not include a complete React/API application, real authentication integration, cloud deployment, browser test run, backup restore result or performance measurement. Code blocks marked as examples illustrate concepts; they do not claim end-to-end production readiness. The lesson exercises explicitly require you to gather that evidence.
