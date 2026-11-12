# 19 — Run the software outside your editor

**Goal:** deliver a reproducible application and understand its process/environment boundaries. **Prerequisites:** 09–14. **Practice-plan link:** W3-D5, W4-D4.

## Lesson

An application process has arguments, environment variables, working directory, permissions, open connections and a lifetime. A build may transform frontend code into static assets and backend code into deployable output. Configuration supplied at browser build time is different from server configuration read at startup. Fail startup clearly when required server configuration is missing; never silently connect to a production database as a fallback.

A container image packages an application filesystem and execution configuration. A container is a running instance, not a virtual copy of your entire cloud. Keep secrets out of images/build layers, run with appropriate limited privileges, and separate persistent data from disposable containers. A healthy API container does not prove a database backup exists.

Inside a container, `localhost` means that container's network namespace, not automatically the host or database service. Distinguish internal service addresses from the URL users access. Configure proxy trust deliberately; request scheme/IP headers are meaningful only through known proxy paths.

A release includes code, dependencies, configuration and database compatibility. Choose a supported runtime, build reproducibly, migrate intentionally, run smoke checks and keep a restoration plan. Readiness means the instance can serve relevant traffic; liveness means it should remain running. Avoid making a temporary dependency problem trigger endless destructive restarts.

Data recovery is its own deliverable. A backup claim needs a successful restore test in an isolated database and an explanation of what data could be lost between backups. Graceful shutdown stops accepting new work and allows bounded cleanup of active requests/connections.

## Worked release flow

```text
known commit + lockfile → checks → build artifact
  → configuration validation → compatible migration
  → deploy → readiness → authenticated smoke journey
  → monitor errors → record release identity
```

The order of migration and deploy depends on compatibility; do not assume every migration can run while old code serves traffic.

## Required reading

- [Node release lifecycle](https://nodejs.org/en/about/previous-releases): choose a currently supported runtime, not whichever old tutorial uses.
- [Docker build practices](https://docs.docker.com/build/building/best-practices/): small trusted base images, build cache, multi-stage builds and rebuilds.
- [Vite environment/modes](https://vite.dev/guide/env-and-mode): build-time client exposure.
- Your selected host's official environment, database networking, health-check and release documentation.

## Task

Complete the [release lab](../labs/04-release-incident.md). Create a fresh setup, validate missing config behavior, deploy with synthetic data, and test restoring a database backup away from the original data.

**Acceptance:** exact setup/build/start steps; no image/browser secrets; HTTPS verified; permissions smoke-tested; deployment identity recorded; restoration actually checked or marked unverified. No purchase is required for these lessons.

## Quiz

1. Why can `localhost` work locally but fail inside a container?
2. Why is rolling back code insufficient for every failed release?
3. How does a restore test provide stronger evidence than a scheduled backup job?

## Walkthrough: successful image, wrong running application

A container builds successfully, but the browser calls `http://localhost:3000/api`. That URL was baked into frontend assets during build. Changing the API container's runtime environment does not necessarily rewrite the already-built browser bundle. Inspect where the URL is read and whether configuration is build-time, server-startup or runtime-public configuration.

Also distinguish browser and container addresses: `db:5432` may be valid on the container network but meaningless to a user's browser. A public API URL is not a database connection string. Drawing the three callers—browser, API process and database—usually reveals the mistaken assumption.

## Techniques and patterns

- **Validate configuration at startup:** parse ports/URLs and required values; return useful non-secret diagnostics. Use synthetic examples in docs.
- **Make builds traceable:** record source revision, dependency resolution and artifact identity. “Latest” is not enough to identify what an instance runs.
- **Separate application and data lifetimes:** recreating a container should not destroy the only database copy. Backups must live under a deliberate retention/access policy.
- **Design graceful shutdown:** stop new traffic, allow bounded in-flight work, close resources and exit. The platform's termination deadline limits how long cleanup can take.
- **Distinguish health checks:** transient database loss may make the app unready without meaning its process must be restarted endlessly. Match host behavior to your application's recovery design.
- **Use staged rollout evidence:** config check, compatible schema, readiness, authenticated smoke journey, error monitoring and a defined recovery action. A public landing page loading proves little about protected API behavior.

Real use: a large fraction of first deployments fail because local assumptions—filesystem, ports, URLs, process lifetimes or secret availability—were never made explicit.

## Connections

[Browser environment exposure](../02-frontend/08-client-server-data.md) determines public values, [migration compatibility](../03-backend-data/12-migrations-transactions.md) determines release order, and [CI](20-ci-dependencies.md) identifies the artifact. Apply the [release lab](../labs/04-release-incident.md) and the Docker/Vite official readings above.

## Scenario practice — Q4–Q7

4. **Predict:** a frontend URL is substituted during build. Will changing only the server process environment alter the downloaded JavaScript? What evidence would confirm the answer for your toolchain?
5. **Debug:** a container can reach the database but the browser cannot reach the API. Draw the addresses and inspect binding, port/proxy routing, HTTPS and origin policy in order.
6. **Design:** create a compatible release/recovery plan for a nullable column addition followed later by a required constraint. Include old/new app overlap and restore limitations.
7. **Implement:** release a known artifact to a controlled environment, verify two-user permissions, then rehearse a reversible outage and recovery. Record what was actually run and any unverified hosted step.

## Interview discussion

- “What is the difference between an image, container and volume?” Follow-up: which data survives replacement?
- “What would you check immediately after deployment?” Follow-up: how would you identify the exact failing release?

Use the [scenario guide](../review/scenario-guide.md) and keep production operations outside unreviewed practice experiments.
