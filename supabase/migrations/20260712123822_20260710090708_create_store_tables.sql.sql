-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  contents text[] DEFAULT '{}',
  badge text,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
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

-- Skins table
CREATE TABLE IF NOT EXISTS skins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  rarity text NOT NULL DEFAULT 'Common',
  hero_name text,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
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

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  duration_minutes int NOT NULL DEFAULT 60,
  category text NOT NULL DEFAULT 'Strategy',
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
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

-- Indexes for featured lookups
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages (is_featured);
CREATE INDEX IF NOT EXISTS idx_skins_featured ON skins (is_featured);
CREATE INDEX IF NOT EXISTS idx_consultations_featured ON consultations (is_featured);