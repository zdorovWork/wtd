# One table per category for activities, tags, and questions

Activities are stored in one table per category (`games`, `movies`), each with its category-specific fields as typed columns. Tags and questions follow the same rule: each category has its own tags table (`games_tags`, `movies_tags`) and questions table (`games_questions`, `movies_questions`), and activities link to their category's tags through a join table (`games_tag_links`, `movies_tag_links`) with foreign keys. We chose this over a single `activities` table with a `jsonb` details column, or a shared table with per-category detail tables, so every field stays a typed, constrained column and each category reads as its own set of tables. Tags and questions were first shared across categories because their shape was the same; we split them because each category may grow its own tag and question fields, and because picking the best question for one category should never scan another category's questions.

## Consequences

Adding a category means a new activity table, tags table, join table, and questions table, plus a new repository and a new controller on the server, not just a row in `categories`; that controller updates the category's activity count. Queries that span categories need a `UNION`; none exist today.
