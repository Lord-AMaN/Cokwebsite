/*
# Payment system: stock, receipts, payment methods, order status flow

## Purpose
Adds a manual payment flow where users select a payment method, upload a
receipt screenshot, and receive an order number. The admin (via Bolt's
Table Editor) can then change the order status. Also adds stock tracking
for skins.

## New Tables
1. `payment_methods`
   - id (uuid PK)
   - name (text NOT NULL) — display name e.g. "Bank Transfer"
   - instructions (text NOT NULL) — payment details/instructions shown to user
   - sort_order (int DEFAULT 0)
   - is_active (bool DEFAULT true)
   - created_at (timestamptz DEFAULT now())

## Modified Tables
1. `skins`
   - ADD `stock_quantity` (integer NOT NULL DEFAULT 0)
     — available quantity; decremented when an order containing this skin is created.

2. `orders`
   - ADD `receipt_url` (text, nullable) — public URL of uploaded receipt image
   - ADD `payment_method` (text, nullable) — name of selected payment method
   - Status values now: 'pending' (order created, awaiting verification),
     'processing' (admin verifying payment), 'completed' (verified),
     'cancelled' (admin cancelled)

## New Storage Bucket
- `receipts` — public bucket for payment receipt screenshots

## Security Changes (RLS)
- `payment_methods`: RLS enabled, anon+authenticated SELECT (public info),
  authenticated INSERT/UPDATE/DELETE (admin manages via Table Editor).
- `skins`: existing SELECT stays anon; add anon UPDATE so the client can
  decrement stock on order (or we do it via the order insert flow).
  Actually, stock decrement happens server-side via a trigger to avoid
  race conditions — see below.

## Stock Decrement Trigger
- A trigger `decrement_stock_on_order` fires AFTER INSERT on `order_items`.
  If the item_type is 'skin', it decrements `skins.stock_quantity` by the
  ordered quantity. This runs with SECURITY DEFINER so it bypasses RLS.

## Important Notes
1. Three dummy payment methods are seeded.
2. The trigger handles stock decrement atomically at the DB level.
3. Order status is managed by the admin via Bolt's Table Editor.
*/

-- ============================================================
-- 1. Add stock_quantity to skins
-- ============================================================
ALTER TABLE skins ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0;

-- ============================================================
-- 2. Add receipt_url and payment_method to orders
-- ============================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;

-- ============================================================
-- 3. Create payment_methods table
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  instructions text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_payment_methods" ON payment_methods;
CREATE POLICY "anon_select_payment_methods" ON payment_methods FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_payment_methods" ON payment_methods;
CREATE POLICY "auth_insert_payment_methods" ON payment_methods FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_payment_methods" ON payment_methods;
CREATE POLICY "auth_update_payment_methods" ON payment_methods FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_payment_methods" ON payment_methods;
CREATE POLICY "auth_delete_payment_methods" ON payment_methods FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. Seed dummy payment methods
-- ============================================================
INSERT INTO payment_methods (name, instructions, sort_order) VALUES
  ('Bank Transfer', 'Transfer the total amount to the following bank account:\n\nBank: Example Bank\nAccount Name: Your Store Name\nAccount Number: 0000-0000-0000\nIFSC: EXMP0000000\n\nInclude your order number in the transfer notes.', 1),
  ('UPI Payment', 'Pay via UPI to the following ID:\n\nUPI ID: yourstore@upi\n\nAfter payment, take a screenshot of the confirmation and upload it.', 2),
  ('PayPal', 'Send the total amount via PayPal to:\n\nEmail: payments@yourstore.com\n\nSelect "Friends & Family" to avoid fees. Add a note with your order details.', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. Storage bucket for receipts (public read, anon upload)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow anyone to upload, public read
DROP POLICY IF EXISTS "anon_upload_receipts" ON storage.objects;
CREATE POLICY "anon_upload_receipts" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "public_read_receipts" ON storage.objects;
CREATE POLICY "public_read_receipts" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'receipts');

-- ============================================================
-- 6. Stock decrement trigger on order_items insert
-- ============================================================
CREATE OR REPLACE FUNCTION decrement_stock()
RETURNS trigger AS $$
BEGIN
  IF NEW.item_type = 'skin' AND NEW.item_id IS NOT NULL THEN
    UPDATE skins
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_decrement_stock ON order_items;
CREATE TRIGGER trigger_decrement_stock
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION decrement_stock();
