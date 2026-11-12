# Baseline: 100 minutes, 100 points

Do this before the daily tickets. No AI, generated autocomplete, or searching for solutions. You may use a compiler/test runner and documentation for syntax. Predict outputs before running code. Submit incomplete answers too; record time and documentation used. There is deliberately no answer key here.

Budget: 60 minutes coding, 25 minutes reasoning, 15 minutes tests and self-review. Timing is diagnostic, not a reason to hide uncertainty.

## 1. Transform data — 15 points

Write a TypeScript function `countOpenByOwner(requests)` returning the number of requests per owner whose status is not `resolved`. Allowed statuses: `new`, `in_progress`, `resolved`.

Example input:

```ts
[
  { id: 'r1', ownerId: 'a', status: 'new' },
  { id: 'r2', ownerId: 'a', status: 'resolved' },
  { id: 'r3', ownerId: 'b', status: 'in_progress' },
  { id: 'r4', ownerId: 'a', status: 'new' },
]
```

Expected output: `{ a: 2, b: 1 }`. Empty input returns an empty result. Do not mutate the input. Define types, write at least three meaningful tests, and state time/space complexity.

## 2. Async reasoning — 10 points

Predict the order and explain the mechanism:

```js
console.log('start');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
```

Then explain a realistic way two search requests can cause the UI to show results for an older query. Propose a fix.

## 3. Repair React state — 15 points

Identify the problem, write a corrected function, and explain the behavior:

```tsx
type RequestItem = { id: string; title: string };
const [requests, setRequests] = useState<RequestItem[]>([]);

function addRequest(item: RequestItem) {
  requests.push(item);
  setRequests(requests);
}
```

What if two updates happen before the next render? Where should a count of requests live, and why?

## 4. Trace and design a request — 15 points

A user submits a request form. Explain what happens through browser → HTTP → route handler → database → response → React update. Include:

- Method, path, example body, and success response.
- Where validation occurs and how an invalid title appears in the UI.
- What the UI does when the network fails.
- Whether a retry can create duplicates and how you would investigate or prevent that.

## 5. SQL and data boundaries — 15 points

Given `users(id, email)` and `requests(id, owner_id, title, status, created_at)`, write a PostgreSQL query for the newest 10 unresolved requests belonging to one user. Use a query parameter for the user ID and a deterministic tie-breaker. Suggest one index and explain how to verify whether it helps.

Where must that user ID come from in an authenticated application? What happens if the client sends somebody else's ID?

## 6. Debug a production complaint — 15 points

“Sometimes clicking Save creates two requests. It is more common on slow Wi-Fi.”

Give an ordered investigation: reproduction, evidence to collect, hypotheses to distinguish, smallest fix supported by evidence, and a regression test. Discuss whether disabling the button alone solves every duplicate scenario. Do not assume the cause is already known.

## 7. Scope and explain — 15 points

You have four hours to add search and filtering to 50,000 requests. The client says “make it instant.” Write a short response covering:

- Three clarifying questions that affect implementation or acceptance.
- A minimal implementation proposal and what you would defer.
- A measurable acceptance criterion.
- One trade-off and one test of that trade-off.

## What the result changes

Each question is graded for correctness (60% of its points), reasoning (25%), and evidence/edge cases (15%). Unanswered questions receive zero. This diagnostic score is separate from the weekly scorecard.

- **80–100:** standard tickets; consider stretch tasks after gates pass.
- **60–79:** standard project, but spend the first 45 minutes of each study block repairing the weakest two topics.
- **Below 60:** replace W1-D2 and W1-D3 implementation blocks with targeted JS/TS/React work, then retry different questions. Aim for create/list only in week 1 and defer stretch work across the month.
- **Security or SQL gap at any score:** add a targeted exercise before beginning authentication in week 2.

Submit your actual answers, code/tests, elapsed time, assistance used, and your two least-confident topics. These thresholds guide practice; they do not establish employment readiness.
