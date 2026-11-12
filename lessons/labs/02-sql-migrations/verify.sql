BEGIN;
DO $$
DECLARE
  matched integer;
BEGIN
  IF (SELECT count(*) FROM junior_practice.users) <> 2 OR
     (SELECT count(*) FROM junior_practice.requests) <> 3 OR
     (SELECT count(*) FROM junior_practice.comments) <> 2 THEN
    RAISE EXCEPTION 'Unexpected fixture counts';
  END IF;

  IF EXISTS (SELECT 1 FROM junior_practice.requests WHERE version <> 1 OR due_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Upgrade did not preserve expected defaults';
  END IF;

  BEGIN
    INSERT INTO junior_practice.requests (id, owner_id, title)
    VALUES ('invalid-owner', 'missing-user', 'Should fail');
    RAISE EXCEPTION 'Foreign key was not enforced';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;

  BEGIN
    INSERT INTO junior_practice.requests (id, owner_id, title, status)
    VALUES ('invalid-status', 'a', 'Should fail', 'unknown');
    RAISE EXCEPTION 'Status constraint was not enforced';
  EXCEPTION WHEN check_violation THEN NULL;
  END;

  UPDATE junior_practice.requests SET status = 'in_progress', version = version + 1
    WHERE id = 'r1' AND version = 1;
  GET DIAGNOSTICS matched = ROW_COUNT;
  IF matched <> 1 THEN RAISE EXCEPTION 'First versioned update should succeed'; END IF;

  UPDATE junior_practice.requests SET status = 'resolved', version = version + 1
    WHERE id = 'r1' AND version = 1;
  GET DIAGNOSTICS matched = ROW_COUNT;
  IF matched <> 0 THEN RAISE EXCEPTION 'Stale update should not succeed'; END IF;
END $$;
ROLLBACK;
