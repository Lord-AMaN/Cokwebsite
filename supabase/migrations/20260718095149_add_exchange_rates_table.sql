/*
# Exchange rates for multi-currency display

## Purpose
Store exchange rates so the checkout can display the cart total in
USD (base), EUR, and INR. Editable via the Bolt Table Editor.

## New Table
- `exchange_rates` (id int PK, currency_code text, rate_per_usd numeric,
  symbol text, updated_at timestamptz)
  Single-row-per-currency table. RLS enabled, anon SELECT so the client
  can read the rates; updates restricted to service role (admin).
*/

CREATE TABLE IF NOT EXISTS exchange_rates (
  id integer PRIMARY KEY,
  currency_code text NOT NULL,
  rate_per_usd numeric NOT NULL,
  symbol text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_exchange_rates" ON exchange_rates;
CREATE POLICY "anon_select_exchange_rates" ON exchange_rates FOR SELECT
  TO anon, authenticated USING (true);

-- Seed with the requested rates
INSERT INTO exchange_rates (id, currency_code, rate_per_usd, symbol) VALUES
  (1, 'USD', 1.00, '$'),
  (2, 'EUR', 0.88, '€'),
  (3, 'INR', 96.65, '₹')
ON CONFLICT (id) DO NOTHING;
