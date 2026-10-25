# Mock registry

Every mock in `src/mocks/` that the server will eventually replace. Work down this list when building `apps/server`.

| Mock file                 | Stands in for                          | Future endpoint / contract                             |
| ------------------------- | -------------------------------------- | ------------------------------------------------------ |
| `src/mocks/categories.ts` | The list of categories (games, movies) | `GET /categories` → `Category[]` (`src/data/types.ts`) |
