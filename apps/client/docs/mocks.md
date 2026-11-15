# Mock registry

Every mock in `src/mocks/` that the server will eventually replace. Work down this list when building `apps/server`.

| Mock file                      | Stands in for                                               | Future endpoint / contract                                                                               |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/mocks/game-questions.ts`  | The questions asked in a games session, one per games tag   | `GET /games/session` → `SessionData` with tags, questions, and all games, or 404 (`src/data/types.ts`)   |
| `src/mocks/movie-questions.ts` | The questions asked in a movies session, one per movies tag | `GET /movies/session` → `SessionData` with tags, questions, and all movies, or 404 (`src/data/types.ts`) |
|                                |
