# `develop` and `main` delivery flow with Vercel

Work is delivered through two long-lived branches: `develop` (default branch, changes under test, staging preview) and `main` (production). Every change goes through a `feature/*` branch and a pull request, and CI must pass before merging. Vercel deploys `main` to production and every other branch as a preview, so `develop` gets a stable staging URL without extra configuration. We chose this over trunk-based deployment because changes need a testing stage before they reach production; do not push directly to `develop` or `main`.
