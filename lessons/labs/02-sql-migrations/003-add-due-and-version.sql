BEGIN;
ALTER TABLE junior_practice.requests
  ADD COLUMN due_at timestamptz,
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);
COMMIT;
