# Lab 04 — Release and recover

**Topics:** 17–20. **Budget:** 3–5 hours within project time. Use only a disposable/staging environment with synthetic data. Hosting is optional until you have an account and acceptable budget; record local-only evidence honestly.

## Part A: release checklist

1. Record source commit, runtime, dependency lockfile and exact checks.
2. Create a fresh install/build using your real project commands.
3. Supply server configuration without committing secrets. Prove missing required config fails clearly.
4. Apply migrations to the intended disposable database; inspect old-row compatibility.
5. Start/deploy the intended artifact. Verify health/readiness, HTTPS if hosted, session behavior, and a create/read permission smoke test with two clients.
6. Record the working release identity and database schema state. Explain which rollback or forward-fix path is compatible.

## Part B: controlled incident

Make the database unavailable through a reversible environment action you understand. Do not delete data or kill unrelated services. From the user's symptom, inspect request status/timing, logs, connection errors and UI recovery behavior. Restore connectivity, then verify the core journey and existing data.

Record actual timestamps in a consistent timezone, user impact, observations, rejected hypotheses, mitigation and remaining uncertainty. Add a regression/integration check where it genuinely prevents recurrence. Do not claim a production availability guarantee from a local rehearsal.

## Part C: restore evidence

Back up synthetic data using the database's supported tooling. Restore into a different empty disposable database. Compare row counts and key records, then run an application read/write smoke test against the restored copy. Document what would be lost between backups and how credentials/retention would be handled.

## Acceptance

Setup/release steps are reproducible; tests and build results are recorded; permission checks work after deployment; logs reveal no secrets; outage produces honest UI errors; restoration has observed results. If tooling/account access prevents a step, mark it unverified and name what is needed instead of checking it off.
