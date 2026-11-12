BEGIN;
CREATE SCHEMA junior_practice;

CREATE TABLE junior_practice.users (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('client', 'staff'))
);

CREATE TABLE junior_practice.requests (
  id text PRIMARY KEY,
  owner_id text NOT NULL REFERENCES junior_practice.users(id),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE junior_practice.comments (
  id text PRIMARY KEY,
  request_id text NOT NULL REFERENCES junior_practice.requests(id),
  author_id text NOT NULL REFERENCES junior_practice.users(id),
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
