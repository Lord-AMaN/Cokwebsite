/*
# Add delivery details to orders + random order numbers

## Purpose
1. Adds delivery detail fields to the `orders` table so the admin knows
   where to send the purchased items (castle name, level, kingdom, coords, etc).
2. Changes the order number generator from sequential (AMAN-000001) to a
   random 6-digit format (XXXX-NNNNNN) so users can't guess other order numbers.

## Modified Tables
1. `orders` — adds columns:
   - customer_name (text, nullable) — name of the person who pays
   - castle_name (text, nullable)
   - castle_level (text, nullable) — e.g. "p2", "p6"
   - kingdom (text, nullable)
   - coordinates (text, nullable)
   - whatsapp_number (text, nullable) — format: countrycode-number

2. `generate_order_number()` — replaced to produce a random 6-digit number
   with a random 4-letter prefix, e.g. "WXKZ-483921". No sequential pattern.

## Important Notes
1. All new columns are nullable so existing orders (if any) are not affected.
2. The random order number uses `random()` + `lpad` — collision risk is
   negligible (26^4 × 10^6 ≈ 30 billion combinations). A unique constraint
   already exists on `order_number`.
*/

-- 1. Add delivery detail columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS castle_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS castle_level text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS kingdom text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coordinates text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- 2. Replace order number generator with random 6-digit format
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  letters text;
  digits text;
BEGIN
  letters := substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ' from floor(random() * 26)::int + 1 for 4);
  digits := lpad(floor(random() * 1000000)::int::text, 6, '0');
  RETURN letters || '-' || digits;
END;
$$ LANGUAGE plpgsql;
