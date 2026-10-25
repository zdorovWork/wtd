# Biome instead of ESLint and Prettier

The repo uses a single root `biome.json` for linting and formatting across all workspaces, instead of the ESLint setup `create-next-app` generates plus Prettier. One fast tool and one config for the whole monorepo outweighs losing Next.js-specific ESLint rules; do not reintroduce ESLint or Prettier alongside Biome.
