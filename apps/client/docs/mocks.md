# Mock registry

Every mock in `src/mocks/` that the server will eventually replace. Work down this list when building `apps/server`.

| Mock file                      | Stands in for                                                | Future endpoint / contract                                                                               |
| ------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `src/mocks/categories.ts`      | The list of categories (games, movies)                       | `GET /categories` → `Category[]` (`src/data/types.ts`)                                                   |
| `src/mocks/game-questions.ts`  | The questions asked in a games session, one per games tag    | `GET /games/session` → `SessionData` with tags, questions, and all games, or 404 (`src/data/types.ts`)   |
| `src/mocks/game-tags.ts`       | The tags of the games category                               | `GET /games/tags` → `Tag[]` (`src/data/types.ts`)                                                        |
| `src/mocks/games.ts`           | The games catalogue with details and the tags of each game   | `GET /games/slugs` → `string[]`; `GET /games/:slug` → `Game` or 404 (`src/data/types.ts`)                |
| `src/mocks/movie-questions.ts` | The questions asked in a movies session, one per movies tag  | `GET /movies/session` → `SessionData` with tags, questions, and all movies, or 404 (`src/data/types.ts`) |
| `src/mocks/movie-tags.ts`      | The tags of the movies category                              | `GET /movies/tags` → `Tag[]` (`src/data/types.ts`)                                                       |
| `src/mocks/movies.ts`          | The movies catalogue with details and the tags of each movie | `GET /movies/slugs` → `string[]`; `GET /movies/:slug` → `Movie` or 404 (`src/data/types.ts`)             |
