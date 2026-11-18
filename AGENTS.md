# wtd (what to do)

wtd helps people pick something to do: they choose a category (games or movies), answer Akinator-style questions, and get a ranked recommendation of activities, each with its own page. Use the domain terms from `GLOSSARY.md` in code, docs, and issues.

## Repo layout

pnpm-workspaces monorepo (see `docs/adr/0001-client-first-monorepo-with-mocks.md`):

- `apps/client`: Next.js app. Before working in it, read `apps/client/AGENTS.md`.
- `apps/server`: NestJS API (Express adapter) with Postgres. Before working in it, read `apps/server/AGENTS.md`. Locally Postgres runs through Docker Compose at the repo root; `pnpm dev` starts client and server together.
- `packages/`: created only when code is genuinely shared between apps.

## Conventions

- pnpm is the only package manager; Node version comes from `.nvmrc`.
- English everywhere: code, UI copy, docs, issues.
- Biome is the single linter and formatter for the whole repo (`docs/adr/0003-biome-instead-of-eslint.md`).
- **Branches**: `develop` is the default branch, `main` is production. Work on `feature/WTD-<n>-<slug>` created from `develop` and open a PR into `develop`; never push to `develop` or `main` directly. See `docs/agents/delivery-flow.md`.
- **Delivery**: after implementing a task, wait for the user to test it locally; commit, push, and open a PR only after approval. Commit message, PR body (`Closes #<n>`), pre-PR checks, and the issue comment: `docs/agents/delivery-flow.md`.
- **Dependencies**: add a library only after the user approves it. Propose it with what it is for and why the platform, Node.js, or Next.js built-ins fall short.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical roles map 1:1: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
