# wtd

Pick something to do: choose a category, answer a few questions, get a recommendation.

## Local development

1. Copy `apps/server/.env.example` to `apps/server/.env` and `apps/client/.env.example` to `apps/client/.env`.
2. Start Postgres: `docker compose up`.
3. From the repo root: `pnpm install`, then `pnpm --filter @wtd/server migrate` and `pnpm --filter @wtd/server seed`.
4. `pnpm dev` — client at http://localhost:3000, server at http://localhost:3001. The home page loads categories from the server.

Vercel and Neon dashboard steps: `docs/agents/vercel-neon-setup.md`.
