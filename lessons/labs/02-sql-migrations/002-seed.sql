BEGIN;
INSERT INTO junior_practice.users (id, email, role) VALUES
  ('a', 'a@example.test', 'client'),
  ('b', 'b@example.test', 'client');

INSERT INTO junior_practice.requests (id, owner_id, title, status, created_at) VALUES
  ('r1', 'a', 'Contact form fails', 'new', '2026-11-01T10:00:00Z'),
  ('r2', 'a', 'Update footer', 'resolved', '2026-11-01T10:00:00Z'),
  ('r3', 'b', 'Improve mobile layout', 'in_progress', '2026-11-02T10:00:00Z');

INSERT INTO junior_practice.comments (id, request_id, author_id, body) VALUES
  ('c1', 'r1', 'a', 'The submit button shows an error.'),
  ('c2', 'r1', 'a', 'It also happens in another browser.');
COMMIT;
