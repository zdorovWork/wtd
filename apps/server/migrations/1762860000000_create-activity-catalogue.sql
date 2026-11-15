-- Up Migration
CREATE TABLE tags (
  category text NOT NULL REFERENCES categories (slug),
  id text NOT NULL,
  label text NOT NULL,
  PRIMARY KEY (category, id)
);

CREATE TABLE games (
  slug text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  year integer NOT NULL,
  genres text[] NOT NULL,
  platforms text[] NOT NULL,
  play_modes text[] NOT NULL
);

CREATE TABLE movies (
  slug text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  year integer NOT NULL,
  genres text[] NOT NULL,
  runtime_minutes integer NOT NULL,
  director text NOT NULL
);

CREATE TABLE games_tags (
  game_slug text NOT NULL REFERENCES games (slug) ON DELETE CASCADE,
  tag_category text NOT NULL,
  tag_id text NOT NULL,
  PRIMARY KEY (game_slug, tag_id),
  FOREIGN KEY (tag_category, tag_id) REFERENCES tags (category, id),
  CHECK (tag_category = 'games')
);

CREATE TABLE movies_tags (
  movie_slug text NOT NULL REFERENCES movies (slug) ON DELETE CASCADE,
  tag_category text NOT NULL,
  tag_id text NOT NULL,
  PRIMARY KEY (movie_slug, tag_id),
  FOREIGN KEY (tag_category, tag_id) REFERENCES tags (category, id),
  CHECK (tag_category = 'movies')
);

-- Down Migration
DROP TABLE movies_tags;
DROP TABLE games_tags;
DROP TABLE movies;
DROP TABLE games;
DROP TABLE tags;
