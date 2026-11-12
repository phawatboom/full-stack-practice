# 22 — Edge cases that cross the whole stack

**Goal:** recognize data semantics and external boundaries before they cause production defects. **Prerequisites:** 12–15. **Practice-plan link:** W4 due dates; other sections are guided/later practice.

## Lesson

**Time:** distinguish an instant from a calendar date and a local wall-clock appointment. An instant can be stored as a timezone-aware timestamp and displayed in the user's timezone. “Due on Friday” might instead be a date under a business timezone; converting it casually to midnight UTC can shift the visible date. PostgreSQL `timestamptz` represents an instant but does not preserve an original named timezone. Specify timezone, inclusivity, optional/null behavior and resolved-request semantics. Test boundaries using a controllable clock. Bangkok currently has no daylight-saving shift, but clients elsewhere may.

**Money:** ordinary binary floating-point is not a general-purpose decimal money representation. Use a deliberate decimal strategy or integer minor units with currency metadata and explicit rounding rules. Not all currencies have the same minor-unit convention. Do not add billing to ClientDesk just to practice this concept; a small pure calculation exercise is enough.

**Files:** separate upload authorization, storage and download authorization. Limit size, allow intended formats, distrust names/content-type headers, generate storage keys, store privately, and choose content scanning and download behavior according to risk. A signed URL grants access for its scope and lifetime; it is not a permanent ownership rule.

**Outbound requests:** accepting arbitrary URLs can let an attacker reach internal services (SSRF). Prefer an allowlist of intended destinations when feasible and handle resolution/redirect/network boundaries through established controls. A URL regex alone does not establish a safe destination.

**Background work:** sending email, generating exports and processing webhooks may outlive an HTTP request. Define durable state, retry limits, idempotency, authorization at execution time where needed, and user-visible progress. A job scheduled only in process memory disappears on restart. A transactional outbox can record delivery intent with the database change, but operating it adds work; use it when durable delivery is a real requirement.

## Worked due-date examples

```text
Instant policy: overdue when now > dueAt and status != resolved.
Date policy: overdue after the due calendar day ends in business timezone.
No due date: not overdue.
Exactly at boundary: must be defined and tested.
```

These are alternatives; pick one coherent policy and propagate it through UI/API/database/query/tests.

## Required reading

- [PostgreSQL date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html): timestamp vs timestamp with time zone.
- [OWASP file uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html): storage, validation and access controls.
- [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html): destination boundaries.
- If implementing webhooks/jobs, your provider's official signature/retry contract. Do not invent it.

## Task

Core: implement and test the agreed due-date semantics through all layers. Guided extension: design an authorized private attachment workflow or an idempotent export job on paper. Mark controls needing a specialist review.

**Acceptance:** boundary cases include null/exactly-due/resolved and two timezones; no unsafe date assumptions; extension describes access, retries, retention and limits. Use synthetic data only.

## Quiz

1. Why is a date-only deadline different from an instant?
2. Why is trusting an upload's filename or content-type unsafe?
3. Why is a server fetching a user-supplied URL a security boundary?

## Walkthrough: a due date moves when the user travels

Suppose an instant deadline is `2026-12-01T00:00:00Z`. It displays as 07:00 on 1 December in Bangkok and 16:00 on 30 November in a UTC−08 offset. Those are the same instant. If the actual promise was “due on 1 December in the agency's business calendar,” an instant chosen without that business rule may be wrong.

For an instant policy, define `now > dueAt` versus `now >= dueAt` and exclude resolved requests as specified. For a date policy, determine the relevant timezone/day boundary. Use a supplied clock in tests rather than reading the real current time inside every helper. Date parsing must reject invalid/ambiguous input according to a documented format, not accept whatever a permissive parser happens to normalize.

## Techniques and patterns

**Align character rules across layers:** JS string length counts UTF-16 code units; PostgreSQL text length and user-perceived graphemes have different semantics. Sixty-one common supplementary-plane emoji can be 122 JS code units but 61 Unicode code points. Choose a contract and test frontend/API/database compatibility. This is why “both say max 120” does not prove the rules match.

**Make money units explicit:** 10,005 minor units is 100.05 only for a two-minor-digit currency. Specify currency, quantity, rounding mode and when rounding occurs. A display formatter is not the business calculation.

**Separate file metadata from access:** an opaque object key does not prove permission. Check who may obtain/download it, how links expire, and how deletion/retention works. Untrusted file names must not become filesystem paths.

**Use durable job states:** accepted, running, succeeded and failed need defined transitions, attempts and visibility. A job acknowledged before its result is durable may be lost; a crash after a side effect may cause a duplicate on retry.

**Verify webhooks over the documented representation:** providers may require signatures over raw request bytes. Parsing/re-serializing JSON can change those bytes. Verify using the official contract, then validate meaning and process idempotently.

Real use: these details appear in scheduling, international clients, exports, document attachments and email notifications—even in small business applications.

## Connections

These semantics connect [runtime validation](../01-foundations/04-typescript.md), [SQL storage](../03-backend-data/11-relational-sql.md), [retries](../04-security/15-api-reliability.md), [security](../04-security/14-web-security.md) and [controlled tests](../05-quality/16-testing.md). Use the official time/upload/SSRF readings above for implementation-specific controls.

## Scenario practice — Q4–Q7

4. **Predict:** convert the instant above into the two stated offsets. Then explain why this arithmetic does not define a date-only business deadline.
5. **Debug:** the UI rejects a title the database accepts; both limits say 120. Propose a Unicode fixture and inspect trimming/length semantics before changing limits.
6. **Design:** an authorized export job is queued, then the user's access is revoked before execution. Define whether/how permission is rechecked at execution and download, with retention and audit implications.
7. **Implement:** table-test overdue behavior for missing date, before/exactly/after the boundary, resolved status and two display timezones using a fixed clock. Document invalid input behavior.

## Interview discussion

- “How would you handle dates across timezones?” Follow-up: instant vs calendar day vs local appointment?
- “How would you process an uploaded file or webhook safely?” Follow-up: which trust boundary remains after authentication?

Use the [scenario guide](../review/scenario-guide.md); file/job extensions remain guided practice beyond the core due-date task.
