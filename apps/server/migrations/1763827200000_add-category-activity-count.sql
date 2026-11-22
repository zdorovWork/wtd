-- Up Migration
ALTER TABLE categories
  ADD COLUMN activity_count integer NOT NULL DEFAULT 0
    CHECK (activity_count >= 0);

UPDATE categories
SET activity_count = (SELECT COUNT(*)::int FROM games)
WHERE slug = 'games';

UPDATE categories
SET activity_count = (SELECT COUNT(*)::int FROM movies)
WHERE slug = 'movies';

-- Down Migration
ALTER TABLE categories DROP COLUMN activity_count;
