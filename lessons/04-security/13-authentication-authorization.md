# 13 — Identity is not permission

**Goal:** protect data at every server entry point. **Prerequisites:** 09–12. **Practice-plan link:** W2-D1/D2.

## Lesson

Authentication establishes who is making a request. Authorization decides whether that identity can perform this action on this resource. A valid login does not authorize access to every request ID. Ownership and staff permissions must be checked on the server for lists, details, writes, nested comments, exports and any background action using that data.

Use established authentication tooling and documented verification. If passwords are in scope, use a maintained password hashing facility with appropriate parameters; do not invent encryption or store plaintext. Recovery, throttling, session expiry and credential changes matter as much as the login form. Keep authentication scope small in training by using seeded accounts or a supported provider, while learning what the mechanism guarantees.

An opaque server session and a signed token are different mechanisms with different revocation/storage considerations. A token's readable payload is not secret, and decoding is not verification. Verification needs the correct signature/key and applicable issuer, audience and expiry checks. A framework helper can do this, but you should know the contract you rely on.

Roles express broad capabilities; ownership expresses a relationship to a particular row. “Staff can change status” and “client can edit their own new request” are separate rules. Start with a small explicit permission matrix. Default to denial for unknown roles/actions. Derive identity and privileges from verified server-side context, not submitted JSON or editable frontend state.

Avoid revealing more than necessary through error differences. A consistent 404 policy can hide resource existence, while internal logs still distinguish causes. This is a product/security choice; apply it consistently and test it.

## Worked permission matrix

| Action | Anonymous | Owning client | Other client | Staff |
| --- | --- | --- | --- | --- |
| Create request | Deny | Allow, server assigns owner | Allow for self only | Define explicitly |
| Read request | Deny | Allow | Deny | Allow |
| Edit new request | Deny | Allow | Deny | Allow |
| Change status | Deny | Deny | Deny | Allow |

## Required reading

- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): password handling, recovery and abuse defenses.
- [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): least privilege, default denial and checks on every request.
- Your authentication tool's official session verification, logout/revocation and browser-storage documentation. Record which tool/version you used.

## Task

Implement and test the matrix with two clients and staff. Send direct API calls with changed path IDs, owner fields and roles. Test expiry, logout and a missing session. Keep test-only identity fixtures out of deployable request handling.

**Acceptance:** cross-user reads/writes fail; the browser cannot grant privileges; unauthorized nested resources are protected; errors follow one disclosure policy; no homemade password/token cryptography.

## Quiz

1. Why is hiding the staff button insufficient?
2. What is the difference between decoding and verifying a signed token?
3. Why must list/export endpoints be tested in addition to a protected detail endpoint?

## Walkthrough: three separate decisions on one update

1. Session verification establishes actor A.
2. Resource lookup identifies request R and its relevant ownership/status.
3. Policy decides whether A may edit R now.

A valid client session passes step 1 but fails step 3 for another client's request. A valid staff session may pass editing rules but still not permit editing account credentials. “Authenticated” is not one universal allow flag.

```text
policy input: verified actor + action + resource attributes
policy result: allow or deny with a defined internal reason
write: applies authorized conditions atomically where they can change
response: follows the API's non-disclosure policy
```

For a nested comment URL, do not authorize the parent request then fetch an arbitrary comment ID without verifying that comment belongs to that parent. The attacker can combine an authorized parent ID with an unrelated child ID.

## Techniques and patterns

- **Scope from the actor:** repository list queries should include the verified visibility conditions before pagination/counting. Filtering unauthorized rows after LIMIT creates incorrect pages and can leave side channels.
- **Test resource/action combinations:** client A/B, staff, anonymous, missing resource, wrong parent and stale session are different cases.
- **Separate broad roles from relationships:** “client” is not enough; “owns this new request” contains relationship and state constraints.
- **Define session lifecycle:** expiration, logout, password changes and staff-role removal need explicit guarantees. A signed token may remain valid until expiry unless your design checks revocation/current authority.
- **Keep verification server-side:** client-decoded roles can help presentation only after the server still enforces the real operation.
- **Fail closed on uncertainty:** a failed permission lookup must not fall back to treating the caller as staff or returning all rows.

Real use: multi-client portals and internal tools often leak data through secondary routes, counts or exports while their main page appears protected.

## Connections

Visibility must agree across [SQL queries](../03-backend-data/11-relational-sql.md), [browser caches](../02-frontend/08-client-server-data.md), [files/background jobs](../07-engineering/22-files-time-integrations.md) and [tests](../05-quality/16-testing.md). Review least privilege and per-request checks in [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## Scenario practice — Q4–Q7

4. **Predict:** A owns request r1; B owns comment c2 under r2. A requests `/requests/r1/comments/c2`. Why can checking only ownership of r1 be insufficient?
5. **Debug:** staff access is removed, but an old signed token still grants staff actions. Identify what must be known about expiry, role lookup and revocation before proposing a fix.
6. **Design:** build a permission matrix for reads, comments, edits, exports and archive operations, including wrong-parent and missing-resource cases. Choose a non-disclosure response policy.
7. **Implement:** add a nested-resource integration test that verifies both denial and unchanged data. Test a list count and export with the same two-client fixture.

## Interview discussion

- “How do you prevent insecure direct object references?” Follow-up: does a random UUID remove the need for authorization?
- “What happens after a user's privileges are revoked?” Follow-up: compare server sessions, short-lived tokens and server-side current-authority checks without claiming one is always best.

Use the [scenario guide](../review/scenario-guide.md) to check lifecycle assumptions.
