-- Up Migration
ALTER TABLE games_tags RENAME TO games_tag_links;
ALTER TABLE movies_tags RENAME TO movies_tag_links;

CREATE TABLE games_tags (
  id text PRIMARY KEY,
  label text NOT NULL
);

CREATE TABLE movies_tags (
  id text PRIMARY KEY,
  label text NOT NULL
);

INSERT INTO games_tags (id, label)
SELECT id, label FROM tags WHERE category = 'games';

INSERT INTO movies_tags (id, label)
SELECT id, label FROM tags WHERE category = 'movies';

CREATE TABLE games_questions (
  id text PRIMARY KEY,
  tag_id text NOT NULL REFERENCES games_tags (id),
  text text NOT NULL,
  position integer NOT NULL UNIQUE
);

CREATE TABLE movies_questions (
  id text PRIMARY KEY,
  tag_id text NOT NULL REFERENCES movies_tags (id),
  text text NOT NULL,
  position integer NOT NULL UNIQUE
);

INSERT INTO games_questions (id, tag_id, text, position)
SELECT regexp_replace(id, '^games-', ''), tag, text, position
FROM questions
WHERE category = 'games';

INSERT INTO movies_questions (id, tag_id, text, position)
SELECT regexp_replace(id, '^movies-', ''), tag, text, position
FROM questions
WHERE category = 'movies';

ALTER TABLE games_tag_links
  DROP CONSTRAINT games_tags_tag_category_tag_id_fkey,
  DROP CONSTRAINT games_tags_tag_category_check,
  DROP COLUMN tag_category,
  ADD CONSTRAINT games_tag_links_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES games_tags (id);

ALTER TABLE movies_tag_links
  DROP CONSTRAINT movies_tags_tag_category_tag_id_fkey,
  DROP CONSTRAINT movies_tags_tag_category_check,
  DROP COLUMN tag_category,
  ADD CONSTRAINT movies_tag_links_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES movies_tags (id);

DROP TABLE questions;
DROP TABLE tags;

-- Down Migration
CREATE TABLE tags (
  category text NOT NULL REFERENCES categories (slug),
  id text NOT NULL,
  label text NOT NULL,
  PRIMARY KEY (category, id)
);

CREATE TABLE questions (
  id text PRIMARY KEY,
  category text NOT NULL REFERENCES categories (slug),
  tag text NOT NULL,
  text text NOT NULL,
  position integer NOT NULL,
  FOREIGN KEY (category, tag) REFERENCES tags (category, id),
  UNIQUE (category, position)
);

INSERT INTO tags (category, id, label)
SELECT 'games', id, label FROM games_tags;

INSERT INTO tags (category, id, label)
SELECT 'movies', id, label FROM movies_tags;

INSERT INTO questions (id, category, tag, text, position)
SELECT 'games-' || id, 'games', tag_id, text, position
FROM games_questions;

INSERT INTO questions (id, category, tag, text, position)
SELECT 'movies-' || id, 'movies', tag_id, text, position
FROM movies_questions;

ALTER TABLE games_tag_links
  DROP CONSTRAINT games_tag_links_tag_id_fkey,
  ADD COLUMN tag_category text,
  ADD CONSTRAINT games_tags_tag_category_check CHECK (tag_category = 'games');

UPDATE games_tag_links SET tag_category = 'games';

ALTER TABLE games_tag_links
  ALTER COLUMN tag_category SET NOT NULL,
  ADD CONSTRAINT games_tags_tag_category_tag_id_fkey
    FOREIGN KEY (tag_category, tag_id) REFERENCES tags (category, id);

ALTER TABLE movies_tag_links
  DROP CONSTRAINT movies_tag_links_tag_id_fkey,
  ADD COLUMN tag_category text,
  ADD CONSTRAINT movies_tags_tag_category_check CHECK (tag_category = 'movies');

UPDATE movies_tag_links SET tag_category = 'movies';

ALTER TABLE movies_tag_links
  ALTER COLUMN tag_category SET NOT NULL,
  ADD CONSTRAINT movies_tags_tag_category_tag_id_fkey
    FOREIGN KEY (tag_category, tag_id) REFERENCES tags (category, id);

DROP TABLE games_questions;
DROP TABLE movies_questions;
DROP TABLE games_tags;
DROP TABLE movies_tags;

ALTER TABLE games_tag_links RENAME TO games_tags;
ALTER TABLE movies_tag_links RENAME TO movies_tags;
