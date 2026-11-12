# 01 — Work safely in a real repository

**Goal:** find the code responsible for behavior, run the project, and submit a focused change. **Prerequisite:** none. **Practice-plan link:** W1-D1 and every later submission.

## Lesson

A repository contains source, configuration, dependencies, tests, and documentation. The current directory affects relative paths and commands. First inspect `README.md`, project instructions, `package.json`, the lockfile and test configuration. A script named `test` is only a command alias; inspect what it actually runs. Never guess that a green command tested the feature you changed.

Source imports form a dependency graph. If `RequestForm` calls `createRequest`, follow that import to the network client, then follow the HTTP path to the backend route. File names are clues, not proof. Search for the URL, function name, or visible error. Use editor “go to definition” and `rg` rather than reading every file in order.

Git distinguishes your working tree, staged changes, and commits. Inspect the diff before staging; a commit should express one reviewable purpose. Include migrations, tests, and docs needed by that purpose. Branches help isolate work but are not backups of uncommitted changes. Reverting a published change preserves shared history; rewriting shared history needs team coordination. Do not run destructive reset/clean commands just to make the status look tidy.

The package manifest describes dependencies and commands; a lockfile records resolved versions for reproducible installs. A successful install is different from a successful build, type check, or runtime startup. Keep private environment files outside Git and provide placeholder names in an example file. If a secret is committed, deleting the line does not revoke it: rotate/revoke it and follow the repository's cleanup procedure.

## Small example: investigation commands

```powershell
Get-Location
Get-ChildItem -Force
rg --files
rg -n 'POST|createRequest|/requests' apps
git status --short
git diff
git diff --staged
```

The `apps` directory in this example is illustrative. Search the directories that actually exist. Run Git commands only after a repository has been initialized.

## Required reading

- [Pro Git](https://git-scm.com/book/en/v2): “Recording Changes,” “Viewing the Commit History,” and “Basic Branching and Merging.” Extract how staging differs from committing and how to resolve a conflict by understanding both changes.
- Your project's manifest and README: list every supported development/check command. This local reading is as important as external documentation.

## Task

Create a small practice repository or use ClientDesk. Make a documented validation change on a branch, inspect/stage/commit it, then create and resolve an intentional conflict in a disposable text file. Draw the import path for one UI action.

**Acceptance:** a clean checkout can follow your setup instructions; the commit contains only intended files; you can explain the conflict resolution; no secrets/generated dependency folders are tracked. Do not overwrite unrelated work.

## Quiz

1. A file has both staged and unstaged edits. What will the next commit include?
2. Why can the application fail after dependencies installed successfully?
3. A teammate asks you to remove a committed API key. What must happen beyond deleting the file?

## Walkthrough: a change that looks frontend-only

A client reports that request titles are cut off. Do not begin by changing every `120` in the repository. First determine whether the text is visually clipped, truncated before sending, rejected by validation, or stored incompletely. Inspect one request in the browser, the HTTP payload, the response, and the saved row. The same symptom can require a CSS fix or a coordinated contract/migration change.

If the actual requirement is to allow 200 characters, map the browser control, runtime validator, database constraint, response contract, fixtures and tests. A focused commit can legitimately change all those files because they implement one behavior. A smaller diff omitting the database constraint is incomplete.

## Techniques and patterns

- **Search from an observable string:** find the visible error or HTTP path, then follow imports/callers. Searching generic words such as `data` creates noise.
- **Inspect before editing:** `git status --short`, `git diff`, and `git diff --staged` distinguish your changes from existing work. `git diff --check` can catch whitespace problems, not logic errors.
- **Stage by intent:** `git add -p` can select hunks; inspect the staged result afterward. If partial staging produces code that never existed as a working state, checks on the working tree alone can mislead.
- **Read history for a reason:** use `git log -- path` or `git blame` to find context, not to assign fault. A comment may reference a requirement still in force.
- **Use reversible investigation:** reproduce in a disposable branch/copy. Do not reset or delete unrelated files to obtain a clean run.

Real use: these habits make you productive in an unfamiliar client repository and make review possible even when a task crosses many folders.

## Connections

Follow the [repository map](../labs/00-repository-map.md) for file interactions, [lesson 10](../03-backend-data/10-api-architecture.md) for contract ownership, and [lesson 20](../06-delivery/20-ci-dependencies.md) for why clean reproducible checks matter. Revisit the “Viewing Your Staged and Unstaged Changes” portion of [Pro Git's recording-changes chapter](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository).

## Scenario practice — Q4–Q7

4. **Predict:** a file initially contains `limit = 120`. You change it to 200, stage it, then change it to 180 without staging. What do the working tree, index and next commit contain? Which version did a normal local build inspect?
5. **Debug:** a teammate's clean install fails but yours works. Give four competing causes and the evidence you would gather before reinstalling everything.
6. **Design:** a title-limit change touches six files. Explain when to keep one commit versus split commits, accounting for whether each intermediate commit works.
7. **Implement:** make a disposable two-file configuration change, stage only one file, and demonstrate how to detect the incomplete staged result. Record the commands; do not commit a deliberately broken change to a shared branch.

## Interview discussion

- “How do you approach a codebase you have never seen?” Follow-up: where do you look when the README is stale?
- “A merge conflict is resolved and the project builds. Is that enough?” Follow-up: what behavior could still have been lost?

Strong answers describe evidence, affected behavior and safe collaboration, not only a memorized Git command list. Use the [scenario marking guide](../review/scenario-guide.md) after your attempt.
