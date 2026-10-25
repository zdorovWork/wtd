# wtd client

Next.js (App Router), TypeScript strict, Tailwind CSS. Design is not ready yet: build functionality with minimal, structural styling.

## Structure

- `src/app/`: routes. `/` picks a category, `/quiz/[category]` runs a session and shows the recommendation, `/games/[slug]` and `/movies/[slug]` are activity pages, statically generated.
- `src/engine/`: the recommendation engine. Plain TypeScript, importing nothing from React or Next.js, so it can move to `apps/server` unchanged (`docs/adr/0002-trait-scoring-recommendation-engine.md` at the repo root).
- `src/data/`: async data-access functions shaped like the future server API. Components and routes get activities, questions, and traits only through this layer.
- `src/mocks/`: mock data, imported only by `src/data/`.

## Mocks

Every mock is a future server migration item. When you add or change a mock, update its row in `docs/mocks.md` in the same change: mock file, what it stands in for, and the endpoint or contract it will become.

## Tests

`node:test`, run directly on `.ts` files by Node. Cover `src/engine/` and `src/data/`.
