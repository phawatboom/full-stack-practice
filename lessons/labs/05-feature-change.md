# Lab 05 — A client change that crosses every layer

**Topics:** 10–16, 21–24. **Budget:** 4 hours independent implementation, then separate review/correction time. **Requires:** your protected ClientDesk application. This is an alternative to W4-D5, not extra mandatory scope.

## Client brief

“Staff need to assign a request to one staff member. Clients should see who is handling their request. We also need an Unassigned filter.”

## Clarify and specify first

Determine who may assign/reassign/unassign, whether a staff member can be deactivated, whether assignment changes status, and whether clients should see a public display name or internal account details. If no reviewer is available, choose and record assumptions. Existing unassigned requests must remain valid.

## Required slice

- Optional assignee relationship with a migration for existing data.
- Server validation that an assignee exists and is eligible staff.
- Server-enforced permission to change assignment. Submitting a role or hidden form field cannot grant it.
- UI control for staff; safe assignee display for authorized clients.
- Composable Unassigned filter; existing search, ownership and pagination still apply.
- Defined behavior for missing, forbidden, invalid-assignee and concurrent-change outcomes.

## File map before edits

List migration, seed/test fixtures, database query, rule/permission, route/DTO, shared contract if present, API client, form/list/filter, tests and docs. Refer to the repository map but use actual file paths. Do not expose an entire staff row just to display a name.

## Required evidence

1. Normal assignment, reassignment and unassignment.
2. Client trying a direct API assignment is denied without changing data.
3. Assignee not found/non-staff produces the agreed error.
4. Existing rows survive migration.
5. Ownership/search/Unassigned filters compose and do not leak other clients' requests.
6. A browser journey confirms wiring; server tests prove permission and data invariants.

## Technical defense

Explain why a foreign key alone does not guarantee “assignee is staff,” how you represent absence, what happens if two staff change assignment simultaneously, and what you would change if reassignment history became required.

At the four-hour mark, record completed and missing criteria, commands/results, help used and limitations. Then seek review with the original weighted rubric. A coherent incomplete slice with an accurate report is more useful evidence than an undocumented generated solution.
