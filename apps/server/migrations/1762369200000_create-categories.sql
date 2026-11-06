-- Up Migration
CREATE TABLE categories (
  slug text PRIMARY KEY,
  name text NOT NULL
);

-- Down Migration
DROP TABLE categories;
