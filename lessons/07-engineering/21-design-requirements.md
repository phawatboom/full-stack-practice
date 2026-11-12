# 21 — Requirements and design judgment

**Goal:** turn an ambiguous request into a small, testable change. **Prerequisites:** 10–12. **Practice-plan link:** W4-D1/D3.

## Lesson

“Make search instant” is an intention, not an implementable acceptance criterion. Clarify who uses it, what data is visible, expected scale, acceptable latency, failure behavior and the time budget. Ask questions that change scope or design. Where answers are unavailable, state assumptions and make reversible choices rather than silently inventing requirements.

Write examples before architecture: given these records and this user, this operation should produce that result. Include denied, empty, boundary and failure examples. Non-functional requirements such as accessibility, privacy, latency and recoverability must be concrete enough to verify. An estimate should include tests, migrations, review and release, not just typing code.

A modular monolith can separate capabilities while remaining one deployment. An SPA plus API is one reasonable learning architecture, not the universal best product architecture. Server rendering can help first content, crawlability and some network patterns; client rendering can fit interactive authenticated tools. Hydration connects server-rendered markup to client behavior and introduces consistency constraints. Choose based on product needs and team skills, not a popularity contest.

Keep business rules in a place that can be tested and consistently reused, but do not turn every function into an interface/class/factory. Duplication is a signal to investigate, not proof that two pieces need the same abstraction. Similar-looking validation for a client draft and a server trust boundary may have different responsibilities.

A design decision needs context, choice, alternatives, consequences and a trigger to revisit it. For example, “offset pagination fits the current admin list; we accept movement during concurrent inserts; investigate cursor pagination if stable browsing becomes a requirement.” That is better judgment than “cursor is always better.”

## Worked mini decision record

```text
Requirement: staff can triage requests; first version has modest traffic.
Choice: one API process and PostgreSQL; feature-oriented modules.
Alternative: independently deployed request/comment services.
Reason: shared transactions and simple operations fit current needs.
Cost: components scale/release together.
Revisit: measured independent load or organizational ownership warrants it.
```

## Required reading

- [Thinking in React](https://react.dev/learn/thinking-in-react): turn a UI into data/state boundaries.
- [MDN core curriculum](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core): locate its design/version-control material as reference. Your main design evidence is the requirement examples and trade-offs you write, not framework slogans.

## Task

Take the due-date brief from W4-D1 or the [feature-change lab](../labs/05-feature-change.md). Write five clarifying questions, eight acceptance examples, an affected-file map, a short estimate with uncertainty, and one decision record. Then implement only the agreed slice.

**Acceptance:** assumptions explicit; permissions and failure cases included; scope fits budget; no speculative infrastructure; another person can tell whether the feature is complete from your examples.

## Quiz

1. Which questions turn “make it fast” into a measurable requirement?
2. When could server rendering be more appropriate than a client-only application?
3. What evidence would justify splitting a service or adding an abstraction?

## Walkthrough: turn “add assignment” into decisions

Client: “Assign requests to staff.” Before choosing components, ask who may assign, whether unassignment is allowed, which staff are eligible, what clients may see, and what happens when two staff change assignment. These answers affect schema, authorization, response projection, UI and concurrency—not merely the dropdown.

```text
Given a new unassigned request owned by client A,
when staff S assigns eligible staff T,
then T's public display name is visible to A and staff,
and other clients still cannot read the request.

Given a client caller,
when they submit assigneeId directly,
then assignment is denied and stored data is unchanged.
```

These examples are specification by behavior. They identify what to test before creating a generic “assignment framework.” The smallest coherent slice may omit assignment history while explicitly noting that future auditing would need it.

## Techniques and patterns

- **Separate requirements from implementation suggestions:** “must use a queue” might mean “must not make the user wait.” Clarify the outcome before accepting an infrastructure prescription.
- **Make trade-offs conditional:** state the current workload/constraints and the observation that would change your choice. Avoid “microservices are scalable” as the whole argument.
- **Group things that change together:** feature-oriented modules can keep related UI/API rules discoverable, while shared low-level capabilities remain separate where useful.
- **Use a small decision record:** context, options, choice, consequences, revisit trigger. One paragraph can be sufficient.
- **Estimate a vertical slice:** include migration, UI, API, permission tests and delivery. Reduce scope coherently rather than completing every UI detail while persistence stays unfinished.
- **Distinguish validation from duplicated rules:** frontend feedback and server trust enforcement both matter. Share a compatible schema where useful, but do not assume browser checks remove server responsibilities.

Real use: junior engineers become trusted when they surface costly ambiguity early and deliver a complete small feature rather than silently expanding scope.

## Connections

Apply the [assignment lab](../labs/05-feature-change.md). The decision spans [DTOs](../01-foundations/04-typescript.md), [API contracts](../03-backend-data/10-api-architecture.md), [permissions](../04-security/13-authentication-authorization.md), [concurrent writes](../03-backend-data/12-migrations-transactions.md) and [team handoff](24-teamwork-capstone.md).

## Scenario practice — Q4–Q7

4. **Predict:** the brief omits whether inactive staff may receive requests. Name four layers likely to need changes if you guess wrong and the client clarifies later.
5. **Debug:** three copies of an overdue rule disagree between count/list/UI. Identify which parts should share a business definition and which must still enforce their own boundary responsibilities.
6. **Design:** compare a modular monolith and two independently deployed services for a two-person team shipping ClientDesk. Include transaction, release, testing and operational costs.
7. **Implement:** write an assignment specification with eight examples, a file map, a scoped estimate and one decision record. Ask a reviewer to identify one ambiguity before coding.

## Interview discussion

- “How do you handle unclear requirements?” Follow-up: what if the client cannot answer today?
- “How do you avoid overengineering?” Follow-up: name a small abstraction you would keep because it protects a real invariant.

Use the [scenario guide](../review/scenario-guide.md) to evaluate reasoning under constraints.
