# Map a real full-stack change across files

This is an illustrative ClientDesk structure, not an application generated for you and not a requirement to use a monorepo. Match responsibilities to the structure your actual project uses. Begin with fewer files when that is clearer.

```text
clientdesk/
  apps/
    web/
      src/
        features/requests/
          RequestForm.tsx       # draft, labels, validation feedback
          RequestList.tsx       # rendering, filters, interaction
          requests.api.ts       # HTTP calls and response/error handling
          requests.test.tsx     # user-visible component behavior
        routes/                 # URL → screen; route loading/error behavior
        styles/                 # layout, tokens, responsive rules
    api/
      src/
        app.ts                  # creates app; no listen-on-import
        server.ts               # config, listen, shutdown
        auth/session.ts         # established auth tool integration
        requests/
          routes.ts             # HTTP boundary
          service.ts            # business/permission rules if separation helps
          repository.ts         # safe queries
      tests/                    # HTTP + real test DB integration
  packages/contracts/           # optional shared serializable schemas/types
  db/
    migrations/                 # versioned schema changes
    seeds/                      # synthetic development/test data
  tests/e2e/                    # real browser journeys
  docs/                         # decisions, contract, operations
  .github/workflows/            # CI if using GitHub
  .env.example                  # names/placeholders, never real secrets
  package.json                  # commands + dependencies
  <package-manager-lockfile>    # committed resolved dependencies
```

## Example: “Clients can set a due date”

Before editing, clarify whether clients actually have permission; the original W4 brief leaves that question open. Then map the change:

1. **Contract:** choose date/instant, optional/null semantics, permissions, request/response fields and errors.
2. **Database:** migration and existing-row policy; repository selects/writes the field.
3. **Backend:** validate and authorize; use the same overdue rule in list/count queries.
4. **Frontend:** labeled control, serialization, display timezone, loading/error/conflict state.
5. **Tests:** boundary validation, permissions, query semantics, UI and an end-to-end journey.
6. **Delivery:** setup/release notes, migration compatibility and known limitations.

## Trace exercise

Choose one actual click. Write the file and function at every step: event handler → HTTP helper → method/path → route → identity → rule → query → result mapping → response → rendered state. Record where you crossed a trust boundary and which module enforced it.

## Import rules to investigate

- Browser code must not import database credentials or server modules.
- Shared contracts should not require importing server startup code.
- Tests should construct the app without starting a permanent listening process.
- One folder per trivial function is not required. Every split should make ownership, reuse or testing clearer.

**Done:** you can explain why changing a response property often affects multiple files and why a database column is not automatically a public API field.
