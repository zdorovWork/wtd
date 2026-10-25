# wtd (what to do)

wtd helps people pick something to do: they choose a category (games or movies), answer Akinator-style questions, and get a ranked recommendation of activities, each with its own page. Use the domain terms from `GLOSSARY.md` in code, docs, and issues.

## Repo layout

pnpm-workspaces monorepo (see `docs/adr/0001-client-first-monorepo-with-mocks.md`):

- `apps/client`: Next.js app, the only app today. Before working in it, read `apps/client/AGENTS.md`.
- `apps/server`: planned Node.js server, built once the client is ready. Until then, data is mocked in the client.
- `packages/`: created only when code is genuinely shared between apps.

## Conventions

- pnpm is the only package manager; Node version comes from `.nvmrc`.
- English everywhere: code, UI copy, docs, issues.
- Biome is the single linter and formatter for the whole repo (`docs/adr/0003-biome-instead-of-eslint.md`).
- **Commits**: commit or push only after the user approves. Prefix the message with the GitHub issue number as `WTD-<n>`: `WTD-2 feat (client): add category picker`.
- **Dependencies**: add a library only after the user approves it. Propose it with what it is for and why the platform, Node.js, or Next.js built-ins fall short.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical roles map 1:1: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
