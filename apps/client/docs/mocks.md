# Mock registry

Every mock in `src/mocks/` that the server will eventually replace. Work down this list when building `apps/server`.

| Mock file                   | Stands in for                                               | Future endpoint / contract                                                                   |
| --------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/mocks/categories.ts`   | The list of categories (games, movies)                      | `GET /categories` → `Category[]` (`src/data/types.ts`)                                       |
| `src/mocks/game-traits.ts`  | The traits of the games category                            | `GET /games/traits` → `Trait[]` (`src/data/types.ts`)                                        |
| `src/mocks/games.ts`        | The games catalogue with details and trait marks per game   | `GET /games/slugs` → `string[]`; `GET /games/:slug` → `Game` or 404 (`src/data/types.ts`)    |
| `src/mocks/movie-traits.ts` | The traits of the movies category                           | `GET /movies/traits` → `Trait[]` (`src/data/types.ts`)                                       |
| `src/mocks/movies.ts`       | The movies catalogue with details and trait marks per movie | `GET /movies/slugs` → `string[]`; `GET /movies/:slug` → `Movie` or 404 (`src/data/types.ts`) |
