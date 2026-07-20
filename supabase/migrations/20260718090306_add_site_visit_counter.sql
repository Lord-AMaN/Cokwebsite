/*
# Site visit counter

## Purpose
Tracks total unique-ish site visits in a single-row table so the footer
can display "X visits". Uses an upsert pattern to keep it simple.

## New Table
- `site_stats` (id int PK = 1, visit_count bigint, updated_at timestamptz)
  Single-row table. RLS enabled, anon SELECT + UPDATE so the client can
  read and increment on load.
*/

CREATE TABLE IF NOT EXISTS site_stats (
  id integer PRIMARY KEY DEFAULT 1,
  visit_count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_stats" ON site_stats;
CREATE POLICY "anon_select_site_stats" ON site_stats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_site_stats" ON site_stats;
CREATE POLICY "anon_update_site_stats" ON site_stats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_site_stats" ON site_stats;
CREATE POLICY "anon_insert_site_stats" ON site_stats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed the single row
INSERT INTO site_stats (id, visit_count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Atomic increment function (callable via RPC)
CREATE OR REPLACE FUNCTION increment_visit_count()
RETURNS bigint AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE site_stats SET visit_count = visit_count + 1, updated_at = now()
    WHERE id = 1 RETURNING visit_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
