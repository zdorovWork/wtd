# wtd server

NestJS (default Express adapter), TypeScript, Jest. Postgres through `pg` with hand-written SQL. No ORM.

## Run

1. Start Postgres: `docker compose up` from the repo root.
2. Copy `.env.example` to `.env` (`DATABASE_URL`, `PORT=3001`).
3. Apply schema and catalogue: `pnpm migrate` then `pnpm seed` (from `apps/server`, or `pnpm --filter @wtd/server migrate` from the root).
4. `pnpm dev` from the repo root starts the client and this server together. The client reads `SERVER_URL` and rewrites `/api/*` to this process.

`pnpm dev` loads `.env` with Node `--env-file`. Migrate, seed, and tests use `--env-file-if-exists` so CI can pass `DATABASE_URL` without a file. The process throws at startup when `DATABASE_URL` is missing.

## Migrate

Plain-SQL files in `migrations/`, run by `node-pg-migrate` via `src/migrate.ts`.

```
pnpm migrate
```

## Seed

Idempotent. Safe to run more than once; it upserts the current categories.

```
pnpm seed
```

On Vercel the server service build command runs migrate then seed against that deployment's Neon branch.

## Test

Jest. Unit specs live next to the code (`*.spec.ts`). e2e specs in `test/` hit `GET /api/categories` against a real Postgres.

`DATABASE_URL` must point at a running Postgres (Docker Compose locally; the service container in CI). e2e applies migrations and the seed before asserting.

```
pnpm test
```
