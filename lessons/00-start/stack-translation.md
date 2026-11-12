# Transfer what you already know

Your notes mention Django/Python and Bun/Elysia. Do not learn several backends simultaneously during this month. Use this table to connect familiar concepts to the same engineering responsibility.

| Responsibility | TypeScript API | Django/Python comparison | What stays the same |
| --- | --- | --- | --- |
| HTTP entry point | Framework route handler | URL configuration and view | Parse/validate input, obtain identity, map outcomes |
| Data validation | Runtime schema/parser; TS DTO | Form/serializer/schema validation | Untrusted data needs runtime checks |
| Persistence | Driver/query builder/ORM | Django ORM/querysets | Understand generated SQL, constraints and transactions |
| Schema changes | Versioned migration tooling | Django migrations | Preserve old rows and deployment compatibility |
| Identity | Auth tool/session integration | Authentication/session middleware | Verify identity; do not trust submitted roles |
| Permissions | Per-operation/object policy | View/queryset/object permission logic | Protect list/detail/nested/write paths |
| Startup | Runtime entry point | ASGI/WSGI application/server | Configuration, process lifetime and shutdown |
| Tests | Chosen JS/TS test runner | Python/Django test tools | Isolation, meaningful assertions and regression proof |

These are conceptual comparisons, not API instructions. Framework defaults differ; read the official documentation for the exact installed tool before relying on behavior. For example, the presence of an ORM does not mean every query is permission-scoped, and a middleware name alone does not prove every route uses it.

## Frontend tool roles

- **Runtime:** executes code. Browser and server runtimes offer different APIs.
- **Type checker:** checks TypeScript's static model; it is not a runtime validator.
- **Build tool:** resolves/transforms/bundles assets according to configuration. A development server is not necessarily your production server.
- **Linter:** catches configured suspicious patterns; it does not prove correctness.
- **Formatter:** standardizes layout; it does not repair business logic.
- **Source map:** connects transformed code to original source for debugging. Consider whether published maps expose source you intend to keep private; source maps must never contain secrets.
- **Test runner:** discovers and executes tests. Check discovery and assertions rather than trusting a green exit blindly.

## React tools to recognize

`useState` stores local state; `useReducer` can centralize meaningful transitions; context shares a value through a subtree; a custom hook shares stateful logic, not automatically the same state instance. `useRef` holds a mutable value or DOM reference without scheduling a render. `useMemo`/`useCallback` are performance/identity tools with costs and dependency semantics; use them for a reason supported by the project's tooling and behavior, not on every expression. A router controls URL-to-screen behavior; a server-data library controls fetching/cache lifecycle. These jobs are distinct even when a framework combines them.

## Small transfer exercise

Choose a feature you previously built with assistance. In 15 minutes, draw the same behavior using the responsibilities above. Then implement one small rule without framework APIs. Explain which knowledge transfers and which framework-specific details need documentation. If you cannot explain the original feature, treat that as useful diagnostic evidence rather than assumed experience.
