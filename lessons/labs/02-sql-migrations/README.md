# Lab 02 — PostgreSQL schema, joins and safe upgrades

**Topics:** 11–12, 18, 22. **Budget:** 2–4 hours. **Requires:** PostgreSQL and `psql`, with a separately created **empty disposable database** that you own. No database is provisioned by these materials. This lab was statically reviewed here; PostgreSQL execution remains unverified because `psql` was not available.

The scripts create a schema named `junior_practice`. They do not drop existing schemas or databases. Do not point them at production or a shared database. They intentionally fail on a second schema creation rather than concealing an unexpected state. For a fresh rerun, create another empty disposable database; no destructive reset script is provided.

## Files and order

1. `001-initial.sql`: users, requests, comments, keys and constraints.
2. `002-seed.sql`: deterministic synthetic fixture.
3. `003-add-due-and-version.sql`: upgrade existing rows.
4. `verify.sql`: assertions for fixture, new fields and constraints; run **before** changing fixture data for exercises.
5. `exercises.md`: your query and concurrency work.

Set a task-specific connection variable in your own terminal. Do not commit its real value or include it in submissions. When possible use your normal PostgreSQL connection service/credential mechanism rather than putting a password into shell history.

```powershell
# Replace with a connection service you configured for the empty practice DB.
$env:JUNIOR_PRACTICE_DB = 'service=junior_practice'
psql "$env:JUNIOR_PRACTICE_DB" -v ON_ERROR_STOP=1 -f 001-initial.sql
psql "$env:JUNIOR_PRACTICE_DB" -v ON_ERROR_STOP=1 -f 002-seed.sql
psql "$env:JUNIOR_PRACTICE_DB" -v ON_ERROR_STOP=1 -f 003-add-due-and-version.sql
psql "$env:JUNIOR_PRACTICE_DB" -v ON_ERROR_STOP=1 -f verify.sql
```

These commands run from this folder. An SQL editor can execute the files in the same order if your environment does not use `psql`. Stop on the first error and inspect it. The verification script ends with `ROLLBACK` so its temporary test updates are not kept.

## Acceptance

- Explain every constraint and relationship.
- Initial fixture has 2 users, 3 requests, 2 comments; request `r1` has 2 comments and `r2`/`r3` have 0.
- Upgrade preserves those rows and gives each version 1 with no due date.
- Solve all core exercises using bound parameters in application code. Raw literals in an interactive demonstration are not a safe production query-binding mechanism.
- Record actual execution results. Do not call the lab passed based on static inspection alone.
