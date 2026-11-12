# 04 — Types inside the program, validation at its boundaries

**Goal:** use types to make valid states clear without trusting unverified data. **Prerequisite:** 02; 03 helps. **Practice-plan link:** W1-D1–D3.

## Lesson

TypeScript checks a model of your code before execution. It does not authenticate a user, inspect arbitrary JSON at runtime, or guarantee a database row matches your expectations. Start new training code with strict checks. Fix uncertainty by narrowing and explicit handling, not by scattering `any`, non-null assertions, or casts.

Use a union for a finite set of values. A discriminated union can describe loading/error/success states so that code cannot read success data while the state is an error. Optional fields deserve a precise meaning: does absence mean “not supplied,” “clear the value,” or “use default”? This matters especially for PATCH requests and database updates.

Treat boundary data as `unknown` until it is validated. A schema validator or careful parser should check shape and values, normalize deliberately, and return a useful error. Sharing a frontend/backend type helps editors but does not make an attacker obey that type. A request DTO should contain only fields the caller is allowed to supply; a database row may contain internal fields that must never be returned.

Generics preserve relationships between input and output types. Use them when that relationship is real, not to make a simple helper look advanced. Keep public types close to the contract they describe. Watch for circular imports and browser imports that accidentally pull in server-only code.

## Worked example

```ts
type Status = 'new' | 'in_progress' | 'resolved';
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseTitle(input: unknown): Result<string> {
  if (typeof input !== 'string') {
    return { ok: false, error: 'Title must be text' };
  }
  const title = input.trim();
  return title.length >= 1 && title.length <= 120
    ? { ok: true, value: title }
    : { ok: false, error: 'Title must be 1–120 characters' };
}
```

For this exercise, length means JavaScript string length. A product supporting user-perceived characters may need a different rule. State the contract instead of assuming all character counts are equivalent.

## Required reading

- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): guards, discriminated unions and exhaustiveness.
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/): `strict`, especially null handling. Know which options your project actually enables.

## Task

Define create/update DTOs, a request response, and a discriminated UI loading state. Parse an unknown create body using a validator or parser; reject client-supplied owner/role fields or explicitly exclude them from use. Put shared serializable contracts in a module with no server dependencies.

**Acceptance:** strict type check passes; invalid runtime values fail; a cast alone is never used as validation; partial updates distinguish missing and explicit null; tests cover boundary lengths and wrong types.

## Quiz

1. Why does `response.json() as RequestItem` not validate a response?
2. When should a value be `unknown` rather than `any`?
3. How does a discriminated union prevent an invalid UI state?

## Walkthrough: a PATCH is not a replacement

Suppose a request has an optional due date. The update contract says missing `dueAt` means “leave unchanged,” `null` means “clear,” and a valid instant string means “replace.” Do not apply `body.dueAt ?? null`: that turns omission into deletion. Check property presence during parsing, reject unsupported values, then construct an explicit update.

```ts
type DueDatePatch = { dueAt?: string | null };
type LoadState<T> =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: T };

function assertNever(value: never): never {
  throw new Error('Unexpected state');
}
```

Use `assertNever` in an exhaustive switch's default branch. Adding a union member should force the handling code to change. This catches missing branches at compile time; runtime boundary data still needs validation. Optional-property behavior also depends on compiler options such as `exactOptionalPropertyTypes`, so read the effective configuration.

## Techniques and patterns

**Parse once at entry:** transform unknown data into a known DTO; internal code should not repeatedly cast the same unverified object. Validate meaning too: a string is not necessarily a permitted status or a valid timestamp.

**Separate storage and response types:** a database driver may return a Date or a decimal string. JSON transport has its own representation. Define mapping explicitly; do not promise a JavaScript Date instance arrives through JSON.

**Prefer useful inference:** annotate public boundaries and ambiguous values; let obvious locals infer. Generics should preserve a real relation, such as `Result<T>`, not bypass uncertainty.

**Use literal configuration checks carefully:** `satisfies` can check a configuration against a target type while preserving useful inferred information. Neither it nor a readonly type freezes data at runtime.

Real use: these patterns prevent accidental field clearing, unhandled UI states and leaking internal user data through “shared” row types.

## Connections

PATCH semantics connect to [API mapping](../03-backend-data/10-api-architecture.md), [SQL nulls](../03-backend-data/11-relational-sql.md), and [time representation](../07-engineering/22-files-time-integrations.md). Use [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to inspect exhaustiveness; use [TSConfig](https://www.typescriptlang.org/tsconfig/) to check optional-property rules.

## Scenario practice — Q4–Q7

4. **Predict:** under the contract above, what do `{}`, `{ dueAt: null }`, and `{ dueAt: '2026-12-01T10:00:00Z' }` each mean? Why is undefined a separate concern in JS objects vs JSON transport?
5. **Debug:** a function returns `await response.json() as User`, including `role: 'staff'` from an untrusted API. Explain which assumptions the cast fails to establish and where identity/permission decisions belong.
6. **Design:** define loading/error/success states for a list that may legitimately be empty. Explain whether you also need a refreshing state preserving prior results.
7. **Implement:** write a patch parser distinguishing missing/null/string and rejecting arrays, invalid field types and unknown privileged fields. Test omission does not clear an existing value.

## Interview discussion

- “What is the difference between a type assertion and a type guard?” Follow-up: can a badly implemented guard lie?
- “When would you use a discriminated union?” Follow-up: how would you add cancellation without contradictory booleans?

Use the [scenario guide](../review/scenario-guide.md) for expected evidence, not only final type definitions.
