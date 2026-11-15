-- Up Migration
CREATE TABLE questions (
  id text PRIMARY KEY,
  category text NOT NULL REFERENCES categories (slug),
  tag text NOT NULL,
  text text NOT NULL,
  position integer NOT NULL,
  FOREIGN KEY (category, tag) REFERENCES tags (category, id),
  UNIQUE (category, position)
);

-- Down Migration
DROP TABLE questions;
