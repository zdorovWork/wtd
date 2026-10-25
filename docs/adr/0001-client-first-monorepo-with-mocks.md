# Client-first pnpm monorepo with mocked data

wtd is a pnpm-workspaces monorepo: `apps/client` (Next.js) now, `apps/server` (Node.js) later, `packages/` created only once code is genuinely shared. The client is built first against mock data so the product can be shaped before any backend exists. To keep the later move cheap, components never import mocks directly: they call async data-access functions shaped like the future API, and every mock is listed in `apps/client/docs/mocks.md` with the endpoint or contract it will become.

## Consequences

Moving to the server means reimplementing the data-access layer and working down the mock registry; components do not change. A mock missing from the registry is a migration bug.
