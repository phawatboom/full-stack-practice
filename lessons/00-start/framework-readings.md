# Framework-specific reading choices

Pick the branch that matches the project you actually use. These readings supplement lessons 10–13; they are not an instruction to switch frameworks. Check documentation against installed versions. Links were checked on 11 November 2026.

## If continuing with Bun and Elysia

1. [Elysia validation](https://elysiajs.com/essential/validation): read body/query/response validation and validation errors. Implement the same title limits in a route, then send a deliberately invalid body outside the frontend.
2. [Elysia lifecycle](https://elysiajs.com/essential/life-cycle): identify where request data, verified identity and error handling become available. Explain hook scope for the routes you protect; do not assume a hook applies to every nested/plugin route.
3. [Bun SQL](https://bun.sh/docs/runtime/sql): study parameter binding, connection handling and transactions if using this client. Write one safe owner-scoped query. Do not introduce this client if your existing driver already meets the requirement.

**Check:** demonstrate the actual runtime validation and permission behavior with HTTP tests. Inferred TypeScript types alone do not prove either.

## If using Django for a separate transfer exercise

[Django query documentation](https://docs.djangoproject.com/en/stable/topics/db/queries/): read filtering, relationships and query evaluation in the version matching your installation. Express the same owner-scoped request list and comment-count behavior from lesson 11. Inspect the executed queries for an N+1 pattern.

**Check:** compare the result to your raw SQL fixture. Do not rebuild the month-long project in a second stack unless that becomes your explicit learning goal.

## API documentation, whichever backend you choose

[OpenAPI specification](https://spec.openapis.org/oas/latest.html): use it as reference for Paths, Operations, Parameters, Request Bodies, Responses and Security Requirements. You do not need to read the entire specification. Use the specification version supported by your tooling, not automatically its newest published version.

Document one endpoint's normal, validation, unauthenticated and denied responses. Compare the document to actual integration-test requests/responses. Generated documentation can drift or omit business rules; generated client types do not replace runtime verification or authorization.

**Task:** give another developer only that endpoint contract and ask them to predict a valid request and three failures. Correct ambiguities before adding more documentation tooling.
