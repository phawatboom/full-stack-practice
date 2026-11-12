# 14 — Defend the boundaries you actually expose

**Goal:** identify common web threats and demonstrate targeted controls. **Prerequisite:** 13. **Practice-plan link:** W2-D2, W3-D5.

## Lesson

Think in trust boundaries: browser input, session, server, database, external network, storage and deployment credentials. Each crossing needs a policy. Validation checks allowed shape and values; authorization checks allowed actions; output handling depends on the destination. One does not replace the others.

SQL injection happens when input can become query structure. Parameterize values and allowlist structural choices. Cross-site scripting happens when attacker-controlled content executes in a victim's browser. Render user content as text; do not insert unsanitized HTML. Framework escaping helps in ordinary text rendering, but dangerous HTML APIs, URLs and third-party widgets still need review. A content security policy is defense in depth, not a repair for unsafe rendering.

CSRF exploits credentials browsers attach automatically to a request. For cookie-authenticated mutations, follow the framework's supported CSRF mechanism and origin policy, with cookie attributes as additional controls. CORS is a different mechanism. `HttpOnly` reduces token theft by script but does not make XSS harmless.

Bound input sizes and costly actions, rate-limit sensitive operations, use safe logs and keep secrets server-side. A value bundled into frontend JavaScript is public to users. A dependency audit can reveal known advisories but cannot prove your application is secure. Review the actual exposed behavior and update maintained dependencies deliberately.

File upload and outbound URL fetching create extra attack surfaces. A user-supplied URL can target internal services; a file can carry deceptive content or consume storage. Use the deeper lesson 22 controls when those features enter scope. Do not add such features merely to check a curriculum box.

## Worked review table

| Boundary | Attack to test locally | Expected control |
| --- | --- | --- |
| Request title | Markup-like text | Displays as text |
| Query | Quotes in user text | Bound as data |
| Protected mutation | Missing/invalid session | Rejected |
| Cookie mutation | Missing CSRF proof where required | Rejected by chosen mechanism |
| JSON body | Huge/invalid payload | Bounded, useful error |

Only test applications and environments you own or are authorized to test.

## Required reading

- [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): token/origin defenses and cookie considerations.
- [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html): query boundaries.
- [Vite environment handling](https://vite.dev/guide/env-and-mode): client exposure rules.

## Task

Write a one-page threat model for ClientDesk. Implement or verify one control for each table row. Check logs and built frontend assets for accidental sensitive values using synthetic test secrets only.

**Acceptance:** controls have reproducible evidence; invalid inputs cannot modify ownership/query structure; cookie behavior matches the authentication model; test data is synthetic; unresolved security issues block release.

## Quiz

1. Why is “we validate every string” insufficient to prevent XSS everywhere?
2. Which browser behavior makes cookie-authenticated mutations vulnerable to CSRF?
3. Why is a value inside a frontend environment variable not necessarily private?

## Walkthrough: a harmless-looking rich-text requirement

The client asks to allow formatted request descriptions. Existing text rendering escapes markup, so users see literal tags. Switching to a raw-HTML rendering API removes that safety boundary. A length check and login requirement do not make submitted HTML safe: an authenticated malicious user can target staff who read the request.

Clarify whether the product needs HTML at all. Plain text with line breaks may satisfy the requirement. If rich content is necessary, use a maintained, appropriate sanitization/rendering approach, restrict supported content, and test the actual rendering context. Content security policy can reduce some consequences but does not justify injecting unsafe HTML.

## Techniques and patterns

**Map source → transformation → sink:** trace where untrusted content comes from and where it is used. Text output, SQL values, file paths, HTML, URLs and shell commands are different sinks with different controls. “Sanitize everything” is too vague to implement correctly.

**Allowlist sensitive shape:** a create/update body should not accept arbitrary internal fields. This protects against mass assignment independently of SQL injection.

**Layer resource limits:** body size, pagination bounds, per-operation quotas and database statement/time budgets address different failure modes. A rate limit alone does not make one extremely expensive request cheap.

**Treat errors and logs as outputs:** exception messages may contain connection strings or query values. Redact known sensitive fields and log only what the operation needs. Do not “debug” authentication by recording full tokens.

**Test controls where they apply:** a CSRF test must use the chosen authentication/cookie mechanism. A direct unit test of a token helper does not prove every route invokes it.

Real use: security reviews become manageable when attached to the actual new boundary—rich content, export, uploaded file, outbound URL or privileged action—rather than a generic checklist detached from code.

## Connections

[Accessible errors](../02-frontend/05-html-accessibility.md) still need safe content; [authorization](13-authentication-authorization.md) does not replace safe rendering; [CI](../06-delivery/20-ci-dependencies.md) is another code-execution boundary. Use the threat-specific official readings already assigned above when implementing a control.

## Scenario practice — Q4–Q7

4. **Predict:** an application uses bound SQL values and React text rendering. A developer adds raw HTML output. Which earlier controls still work, and which new trust boundary appears?
5. **Debug:** error telemetry contains full session tokens because the server logs every header. Propose immediate containment, safe diagnostic replacement and a regression check using synthetic secrets.
6. **Design:** the client asks for rich formatting and external links. Compare plain text, restricted markup and arbitrary HTML, including rendering/URL policy and maintenance cost.
7. **Implement:** add boundary tests for privileged extra fields, oversized bodies and user text displayed as text. If cookie auth is used, verify the real mutation route's chosen CSRF defense. Explain which threats these tests do not cover.

## Interview discussion

- “SQL injection vs XSS vs CSRF?” Follow-up: trace a different source and sink for each.
- “Is an internal app safe because only employees log in?” Follow-up: consider compromised accounts, untrusted imported data and staff privileges.

Review with the [scenario guide](../review/scenario-guide.md); perform security tests only in authorized environments.
