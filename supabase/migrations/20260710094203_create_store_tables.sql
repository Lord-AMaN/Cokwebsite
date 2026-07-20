/*
# Create store tables for Gament — Clash of Kings: The West Store

1. New Tables
- `packages` — Resource bundles for purchase (gold, food, wood, etc.)
  - id, title, description, price, original_price, items (jsonb), featured, sort_order, image_url, created_at
- `skins` — Hero/character skins for purchase
  - id, title, hero_name, description, price, rarity, image_url, featured, sort_order, created_at
- `consultations` — Pro gaming consultation services
  - id, title, description, price, duration, category, featured, sort_order, created_at

2. Security
- RLS enabled on all tables.
- Single-tenant (no auth) — all policies use `TO anon, authenticated` with `USING (true)` since data is intentionally public.
*/

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  items jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_packages" ON packages;
CREATE POLICY "anon_select_packages" ON packages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_packages" ON packages;
CREATE POLICY "anon_insert_packages" ON packages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_packages" ON packages;
CREATE POLICY "anon_update_packages" ON packages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_packages" ON packages;
CREATE POLICY "anon_delete_packages" ON packages FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS skins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  hero_name text,
  description text,
  price numeric(10,2) NOT NULL,
  rarity text DEFAULT 'Common',
  image_url text,
  featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_skins" ON skins;
CREATE POLICY "anon_select_skins" ON skins FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_skins" ON skins;
CREATE POLICY "anon_insert_skins" ON skins FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_skins" ON skins;
CREATE POLICY "anon_update_skins" ON skins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_skins" ON skins;
CREATE POLICY "anon_delete_skins" ON skins FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  duration text,
  category text,
  featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_consultations" ON consultations;
CREATE POLICY "anon_select_consultations" ON consultations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_consultations" ON consultations;
CREATE POLICY "anon_insert_consultations" ON consultations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_consultations" ON consultations;
CREATE POLICY "anon_update_consultations" ON consultations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_consultations" ON consultations;
CREATE POLICY "anon_delete_consultations" ON consultations FOR DELETE
  TO anon, authenticated USING (true);
