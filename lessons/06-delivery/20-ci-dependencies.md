# 20 — Repeat checks and manage dependencies deliberately

**Goal:** make failures visible before release without giving automation unnecessary power. **Prerequisites:** 16, 19. **Practice-plan link:** W3-D5.

## Lesson

Continuous integration runs repeatable checks on changes. Start with the repository's real commands: dependency installation from its lockfile, type checking, relevant tests and production build. Use isolated test data and services. A check that succeeds because it ran zero tests is not evidence. Keep the log useful enough to reproduce a failure locally.

Dependencies are code executed with your application's or build system's privileges. Review the need, maintenance, license and transitive footprint before adding one. Commit the correct lockfile and use your package manager's reproducible-install mode. Update intentionally with tests and changelog review; neither freezing forever nor blindly upgrading everything is a sound security strategy.

CI executes code from branches and pull requests. Limit token permissions, protect secrets, and do not run untrusted pull-request code in a privileged job. Treat script interpolations of branch names, titles or other user-controlled data as potential injection paths. Pin third-party actions according to current GitHub guidance and the team's update policy; review what they can access.

Caching accelerates work but needs correct keys and separation from secrets. A cached build is not necessarily from the source you intend to release. Prefer a traceable artifact built from a known commit and use the same artifact for the relevant release step when the platform supports it.

Automate checks that inform a decision. Avoid adding a maze of services or tools before a simple workflow covers the risk. Deployment automation also needs environment protection and schema compatibility; green unit tests do not establish safe production operations.

## Worked pipeline checklist

```text
Checkout known source
Set supported runtime
Install using committed lockfile
Start isolated test DB if needed
Apply test migrations
Type check → meaningful tests → build
Publish test result/artifact identity
Release only through authorized environment policy
```

## Required reading

- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use): permissions, untrusted inputs and third-party actions.
- [Docker build practices](https://docs.docker.com/build/building/best-practices/): dependency/build reproducibility.
- The official install/lockfile documentation for your chosen package manager; record the exact command supported by your installed version.

## Task

Add the smallest workflow or local check script that covers your feature's actual failure modes. Deliberately break a permission test and verify the pipeline fails. Restore it and rerun. Inspect workflow permissions and secret exposure paths.

**Acceptance:** deterministic install; correct commands; meaningful failing-regression proof; isolated database; no broad deployment credential exposed to untrusted changes; release commit/artifact traceability documented.

## Quiz

1. Why commit a lockfile if `package.json` already lists dependencies?
2. Why is executing untrusted pull-request code with release secrets dangerous?
3. How can a green pipeline provide false confidence?

## Walkthrough: a check passed on different inputs

Local tests use an existing database with a manually added column. CI starts an empty database but does not apply migrations, so tests fail. The fix is not to skip CI or make tests ignore missing columns. Make setup reproducible from versioned migrations, and test the upgrade path separately when old rows are affected.

A different false positive occurs when the pipeline runs tests on one source/configuration but deploys a rebuilt artifact from another. Trace commit → lockfile → checks → artifact → release. Be explicit about public build-time configuration if it requires environment-specific artifacts.

## Techniques and patterns

**Use separate check and release trust levels:** untrusted changes should not receive deploy privileges or production secrets. Repository events have different trust implications; understand the configured workflow, not only its filename.

**Pin with an update policy:** immutable action revisions improve traceability; they also need deliberate updates. A lockfile prevents unintended resolution drift during supported deterministic installs, not malicious code from being malicious.

**Run the smallest complete checks:** type-checking can catch a broken contract while integration tests catch query/permission failures. Avoid redundant pipelines while preserving the different evidence each check supplies.

**Cache dependencies, not correctness assumptions:** key caches according to inputs and toolchain; do not cache secrets or reuse an artifact whose source identity is unclear.

**Make failure diagnosis local:** print non-secret runtime versions, relevant commands and useful test output. A junior should be able to reproduce the failing command without reading an opaque orchestration script for hours.

**Review dependency changes as behavior changes:** inspect package source/maintenance advisories, API compatibility and installation scripts. Adding a dependency for a standard-library one-liner adds ongoing work without necessarily reducing risk.

Real use: CI should make a clean teammate machine more predictable, not become a separate environment that only one developer understands.

## Connections

[Git staging](../01-foundations/01-workspace-git.md) controls checked source, [tests](../05-quality/16-testing.md) determine meaningful evidence, [migrations](../03-backend-data/12-migrations-transactions.md) determine setup, and [deployment](19-runtime-deployment.md) determines release identity. Recheck [GitHub secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use) when changing workflow privileges.

## Scenario practice — Q4–Q7

4. **Predict:** dependencies come from a lockfile but the pipeline downloads an unpinned build script from a moving URL. Which part is reproducible and which remains uncontrolled?
5. **Debug:** CI reports success in 0.2 seconds after tests were moved to a new folder. How do you establish whether it found meaningful tests before accepting the green result?
6. **Design:** outline a pull-request check and a protected release job with minimum necessary credentials. Explain how untrusted code is kept away from release secrets.
7. **Implement:** prove your pipeline fails for one real permission regression and a type error. Restore both, rerun, and record the source/artifact identity rather than screenshots alone.

## Interview discussion

- “What checks belong in CI?” Follow-up: how do you prove the workflow ran the checks you care about?
- “How do you evaluate a new dependency?” Follow-up: when does the standard library solve the requirement more simply?

Use the [scenario guide](../review/scenario-guide.md) for expected traceability and trust-boundary evidence.
