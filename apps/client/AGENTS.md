# wtd client

Next.js (App Router), TypeScript strict, Tailwind CSS. Design is not ready yet: build functionality with minimal, structural styling.

## Structure

- `src/app/`: routes. `/` picks a category, `/quiz/[category]` runs a session and shows the recommendation, `/games/[slug]` and `/movies/[slug]` are activity pages, statically generated.
- `src/engine/`: the recommendation engine. Plain TypeScript, importing nothing from React or Next.js, so it can move to `apps/server` unchanged (`docs/adr/0002-trait-scoring-recommendation-engine.md` at the repo root).
- `src/data/`: async data-access functions shaped like the future server API. Components and routes get activities, questions, and traits only through this layer.
- `src/mocks/`: mock data, imported only by `src/data/`.
- `src/components/`: React components shared between routes, such as the activity page layout.

## Mocks

Every mock is a future server migration item. When you add or change a mock, update its row in `docs/mocks.md` in the same change: mock file, what it stands in for, and the endpoint or contract it will become.

## Tests

`node:test`, run directly on `.ts` files by Node. Cover `src/engine/` and `src/data/`. Test suites shared between test files live in `*.testing.ts`, which the `*.test.ts` glob does not run on their own.

Because Node runs these files without a bundler, code in `src/engine/`, `src/data/`, and `src/mocks/` uses relative imports with the `.ts` extension (no `@/` alias) and only erasable TypeScript syntax (`erasableSyntaxOnly` in `tsconfig.json`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
