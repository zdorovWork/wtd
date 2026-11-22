# One table per category for activities

Activities are stored in one table per category (`games`, `movies`), each with its category-specific fields as typed columns, and each linked to tags through its own join table (`games_tags`, `movies_tags`) with foreign keys. Tags and questions share one table each, keyed by category, because their shape is the same in every category. We chose this over a single `activities` table with a `jsonb` details column, or a shared table with per-category detail tables, so every field stays a typed, constrained column and each category reads as its own table.

## Consequences

Adding a category means a new activity table, a new join table, a new repository, and a new controller on the server, not just a row in `categories`; that controller updates the category's activity count. Queries that span categories need a `UNION`; none exist today.
