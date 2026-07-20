/*
# Make resource prices dynamic

## Purpose
Move hardcoded resource prices, descriptions, and images into the database
so they can be managed via the Bolt Table Editor like skins.

## Modified Tables
1. `resources` — adds columns:
   - price (numeric NOT NULL DEFAULT 0) — price per million
   - description (text, nullable)
   - image_url (text, nullable)
   - sort_order (integer NOT NULL DEFAULT 0)
*/

ALTER TABLE resources ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Seed prices/descriptions/images matching current static values
UPDATE resources SET price = 0.05, description = 'Essential for building and upgrading your castle', image_url = '/wood.png', sort_order = 1 WHERE name = 'Wood';
UPDATE resources SET price = 0.05, description = 'Required for troop training for bigger castles and prestige science', image_url = '/wheat.png', sort_order = 2 WHERE name = 'Wheat';
UPDATE resources SET price = 0.15, description = 'Required for troop training for bigger castles and prestige science', image_url = '/iron.png', sort_order = 3 WHERE name = 'Iron';
UPDATE resources SET price = 0.5, description = 'Mainly needed for science and research', image_url = '/silver.png', sort_order = 4 WHERE name = 'Mithril';
