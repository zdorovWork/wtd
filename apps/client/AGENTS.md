# wtd client

Next.js (App Router), TypeScript strict, Tailwind CSS. The app is a mobile-only column (`max-w-[430px]`, centered, sand outside) set up in `src/app/layout.tsx`; there is no desktop layout.

## Design

- Tokens live in `src/shared/styles/globals.css` (`@theme`): colors (`cream`, `sand`, `ink`, `duck`, `beak`, ...), `shadow-sticker`, `shadow-sticker-sm`, `animate-bob` (use only with `motion-safe:`), and fonts `font-heading` (Fredoka) and `font-body` (Nunito). Use the utilities; never hard-code palette hex values in components.
- Visual language: 2px `ink` borders, `rounded-2xl`/`rounded-3xl`, sticker shadows, pressed state shifts into the shadow, `beak` focus outline.
- Shared UI is in `src/shared/components/`: `Button`, `IconButton`, `Typography` (all text: `as`, `size`, `weight`, `font`, `color`, `align` props; no raw text tags or native buttons in widgets and features), `SpeechBubble`, `GenreChips`, `Cover`, `icons/`, and the duck poses `IdleDuck`, `ThinkingDuck`, `HappyDuck` (`detective-duck/`). Reuse them before writing new ones.

## Component rules

- One component per file. A component that needs several files gets its own folder with an `index.ts` that exports its public API.
- Shared components are dumb: props in, markup out, no project logic or domain types. Large components are decomposed into smaller ones.
- Logic is added in `src/features/`, which composes shared UI into project elements (`ActivityCover` picks a cover gradient and emoji for an activity). Domain-specific constants such as category emojis live there too. A wrapper without logic is not a feature: import the needed shared component directly (e.g. `HappyDuck`, so only the used pose lands in the bundle).

## Structure

- `src/app/`: routes. A route folder holds only `page.tsx` (and `layout.tsx` when needed); everything else goes to `src/widgets/` or `src/features/`; widgets are composed of features. `/` picks a category (categories come from `GET /api/categories` on the server; the page renders on request). `/quiz/[category]` runs a session and shows the recommendation, `/games/[slug]` and `/movies/[slug]` are activity pages, statically generated.
- `src/engine/`: the recommendation engine. Plain TypeScript, importing nothing from React or Next.js, so it can move to `apps/server` unchanged (`docs/adr/0002-tag-scoring-recommendation-engine.md` at the repo root).
- `src/data/`: async data-access functions. `getCategories` calls the Nest server (`SERVER_URL` + `/api/categories`). Remaining catalogue reads still go through mocks until later tickets.
- `src/mocks/`: mock data, imported only by `src/data/`.
- `src/shared/`: code shared across the app, one folder per kind: `components/`, `hooks/`, `styles/`.
- `src/features/`: project elements with logic, built from shared UI.
- `src/widgets/`: self-contained UI blocks composed for routes, built from features, such as `activity-details.tsx`. A widget never imports another widget.
- `src/modules/`: state shared between pages, widgets, and features (e.g. `quiz-session`: provider, `useQuizSession`, `QuizStep`). Features never import each other; they interact only through a module or through props from the widget that composes them.
- Page-level tags (`main`, `header`, `footer`) live only in `page.tsx`; the rest of the markup is split into widgets and features.

## Mocks

Every mock is a future server migration item. When you add or change a mock, update its row in `docs/mocks.md` in the same change: mock file, what it stands in for, and the endpoint or contract it will become.

## Tests

`node:test`, run directly on `.ts` files by Node. Cover `src/engine/` and mock-backed `src/data/` functions. `getCategories` calls the Nest server and is not run by `node:test`. Test suites shared between test files live in `*.testing.ts`, which the `*.test.ts` glob does not run on their own.

Because Node runs these files without a bundler, code in `src/engine/`, `src/data/`, and `src/mocks/` uses relative imports with the `.ts` extension (no `@/` alias) and only erasable TypeScript syntax (`erasableSyntaxOnly` in `tsconfig.json`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
