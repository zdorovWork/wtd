# Vercel and Neon dashboard checklist

These steps are done in the Vercel and Neon dashboards. They are not applied by deploying the branch.

## Vercel project

1. Open project `wtd` (team `wtd11`).
2. Set **Root Directory** to the repository root (clear `apps/client`). The root `vercel.json` now defines two services.
3. Confirm **Production Branch** stays `main`.
4. Keep **Deployment Protection** on previews so only team members can open them.

## Neon from the Marketplace

1. Install **Neon** from the Vercel Marketplace onto project `wtd`.
2. Connect the resource to **Production**, **Preview**, and **Development**.
3. Use the **pooled** connection string as `DATABASE_URL` (the Neon host that includes `-pooler`).
4. Enable a **database branch per Preview deployment**.
5. Give `develop` its own Neon branch (Preview for `develop`, not Production).
6. Confirm `DATABASE_URL` is available to the **server** service at build time (migrations and seed run in that service's build command) and at runtime.

## After the first preview of this branch

1. Open `/api/categories` on the preview URL and confirm it returns games and movies from Neon.
2. Open `/` and confirm the home page shows those categories.
3. In Neon, confirm the preview deployment used its own database branch.
