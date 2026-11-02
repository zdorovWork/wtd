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
- Close the GitHub issue once its commit reaches `main` (see `docs/agents/issue-tracker.md`). Until then it stays open with a comment pointing at the PR.

## CI

`.github/workflows/ci.yml` runs on every pull request and every push to `develop` and `main`: `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build`. The single job is named `verify` and is the required status check. Run the same four commands locally before opening a PR.

## Vercel

- Project `wtd` (team `wtd11`), Root Directory `apps/client`, Production Branch `main`.
- Preview deployments are protected by Vercel Authentication, so only team members see them.
- No environment variables yet; when they appear, scope them per environment (Preview vs Production).
