# Postgres through `pg` with plain SQL, no ORM

`apps/server` stores data in Postgres and talks to it through the `pg` driver with hand-written SQL; row types are declared by hand and mapped to domain types in the repositories. Schema changes are plain-SQL migrations run by `node-pg-migrate`, and an idempotent seed command loads the initial catalogue. We rejected ORMs and query builders (Prisma, Drizzle, Kysely): the server runs a handful of simple reads, and plain SQL keeps the queries visible and the stack small. Do not add an ORM to "fix" this.
