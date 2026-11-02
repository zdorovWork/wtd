# Delivery flow

See `docs/adr/0004-develop-main-delivery-flow.md` for the decision.

```
feature/WTD-<n>-<slug> --PR--> develop --PR--> main
                                  |              |
                        Vercel preview       Vercel production
                        (staging)
```

## Branches

- `develop`: default branch. Changes that are merged but still being tested. Every push updates the staging preview at `wtd-git-develop-wtd11.vercel.app`.
- `main`: production. Every push updates production. Only `develop` is merged into it (hotfixes: `hotfix/WTD-<n>-<slug>` into `main`, then merge `main` back into `develop`).
- `feature/WTD-<n>-<slug>`: one per issue, created from `develop`. Every push gets its own Vercel preview URL.

## Rules

- Never push directly to `develop` or `main`; both are protected and require a pull request with a passing `verify` check.
- Feature PR: base `develop`, title `WTD-<n> <type> (client): <summary>`, body links the issue.
- Release PR: base `main`, head `develop`, title `Release: <summary>`. Merge with a merge commit (not squash), so `develop` history stays intact.
- Merge feature PRs into `develop` with squash or merge commit, delete the branch after merging.
- The user merges feature PRs and closes the GitHub issue (see `docs/agents/issue-tracker.md`); the agent never merges.

## Per-task flow

1. The user asks for a task; the agent implements it on a `feature/WTD-<n>-<slug>` branch (created from `develop`) and runs `pnpm check`, `pnpm test`, `pnpm build`. No commit yet.
2. The user tests the task manually, locally, and approves or requests changes.
3. After the user's approval the agent commits, pushes, and opens a PR into `develop`.
4. If the task has a GitHub issue, the agent adds a short comment on it: what was built and the PR link.
5. The user merges the PR into `develop` and closes the issue.
6. Releases to `main` are a separate step, done only when the user asks.

## CI

`.github/workflows/ci.yml` runs on every pull request and every push to `develop` and `main`: `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build`. The single job is named `verify` and is the required status check. Run the same four commands locally before opening a PR.

## Vercel

- Project `wtd` (team `wtd11`), Root Directory `apps/client`, Production Branch `main`.
- Preview deployments are protected by Vercel Authentication, so only team members see them.
- No environment variables yet; when they appear, scope them per environment (Preview vs Production).
