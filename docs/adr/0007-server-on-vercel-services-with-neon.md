# Server deployed with the client as Vercel Services, Postgres on Neon

`apps/server` (NestJS, default Express adapter) deploys in the same Vercel project as `apps/client`, as a second service: `/api/*` routes to the server, everything else to the client, so both share one domain and need no CORS. Server code in the client reaches the server through a service binding rather than the public URL, so protected preview deployments do not block it. Postgres is Neon from the Vercel Marketplace, connected through its pooled connection string. We chose this over a long-running server on Railway, Render, or Fly because it keeps the `develop`/`main` preview flow (`0004-develop-main-delivery-flow.md`) with no second platform; the server code is plain NestJS, so moving to a long-running host later changes deployment, not code.

## Consequences

The server runs as Vercel Functions: no WebSockets or background jobs, and the first request after idle pays a cold start. Locally, Postgres runs in Docker Compose.
