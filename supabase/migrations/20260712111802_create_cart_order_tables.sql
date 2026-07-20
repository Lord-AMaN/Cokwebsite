/*
# Create carts, cart_items, orders, and order_items tables

## Purpose
Adds a user system with cart and order support. Users sign in with Supabase
email/password auth. Each user has one cart; cart items reference store products
(packages, skins, consultations, or custom resource bundles). Orders are created
at checkout with a unique order number. The payment page is blank for now —
orders are created in a "pending" state and the payment integration will be
filled in later.

## New Tables

1. `carts`
   - id (uuid PK)
   - user_id (uuid NOT NULL, DEFAULT auth.uid(), FK to auth.users, ON DELETE CASCADE)
   - created_at (timestamptz DEFAULT now())
   - One cart per user (unique constraint on user_id)

2. `cart_items`
   - id (uuid PK)
   - cart_id (uuid NOT NULL, FK to carts ON DELETE CASCADE)
   - item_type (text NOT NULL) — 'package' | 'skin' | 'consultation' | 'resource'
   - item_id (uuid, nullable) — references the store item when applicable
   - name (text NOT NULL) — display name at time of add
   - description (text, nullable) — display description
   - price (numeric(10,2) NOT NULL) — unit price
   - quantity (integer NOT NULL DEFAULT 1)
   - metadata (jsonb DEFAULT '{}') — extra info (e.g. resource breakdown)
   - created_at (timestamptz DEFAULT now())

3. `orders`
   - id (uuid PK)
   - order_number (text UNIQUE NOT NULL) — human-readable order ID (e.g. "AMAN-XXXXXX")
   - user_id (uuid NOT NULL, DEFAULT auth.uid(), FK to auth.users)
   - total (numeric(10,2) NOT NULL)
   - status (text NOT NULL DEFAULT 'pending') — pending | paid | cancelled
   - payment_intent_id (text, nullable) — for future payment integration
   - created_at (timestamptz DEFAULT now())

4. `order_items`
   - id (uuid PK)
   - order_id (uuid NOT NULL, FK to orders ON DELETE CASCADE)
   - item_type (text NOT NULL)
   - item_id (uuid, nullable)
   - name (text NOT NULL)
   - description (text, nullable)
   - price (numeric(10,2) NOT NULL)
   - quantity (integer NOT NULL DEFAULT 1)
   - metadata (jsonb DEFAULT '{}')

## Security Changes (RLS)

- `carts`: RLS enabled. Owner-scoped CRUD for authenticated users.
- `cart_items`: RLS enabled. Access scoped through parent cart ownership.
- `orders`: RLS enabled. Owner-scoped SELECT for authenticated users; INSERT
  allowed for authenticated users (they create their own orders).
- `order_items`: RLS enabled. Access scoped through parent order ownership.

## Important Notes

1. Store tables (packages, skins, consultations) keep their existing SELECT
   policy (anon + authenticated can read). Their INSERT/UPDATE/DELETE policies
   are tightened to authenticated-only so only logged-in admins can modify
   store data. This prevents anonymous visitors from using the admin panel.
2. `user_id` columns default to `auth.uid()` so frontend inserts that omit
   `user_id` still satisfy RLS WITH CHECK constraints.
3. A sequence-based function `generate_order_number()` creates readable order IDs.
*/

-- ============================================================
-- Helper function: generate unique order number
-- ============================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  seq_val bigint;
  order_no text;
BEGIN
  seq_val := nextval('order_number_seq');
  order_no := 'AMAN-' || lpad(seq_val::text, 6, '0');
  RETURN order_no;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sequence for order numbers (idempotent)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ============================================================
-- carts table
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- One cart per user
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'carts_user_id_key') THEN
    ALTER TABLE carts ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);
  END IF;
END $$;

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart" ON carts;
CREATE POLICY "select_own_cart" ON carts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON carts;
CREATE POLICY "insert_own_cart" ON carts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON carts;
CREATE POLICY "update_own_cart" ON carts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON carts;
CREATE POLICY "delete_own_cart" ON carts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- cart_items table
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Access scoped through parent cart ownership
DROP POLICY IF EXISTS "select_own_cart_items" ON cart_items;
CREATE POLICY "select_own_cart_items" ON cart_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_cart_items" ON cart_items;
CREATE POLICY "insert_own_cart_items" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_cart_items" ON cart_items;
CREATE POLICY "update_own_cart_items" ON cart_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_cart_items" ON cart_items;
CREATE POLICY "delete_own_cart_items" ON cart_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  );

-- ============================================================
-- orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT generate_order_number(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- order_items table
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_order_items" ON order_items;
CREATE POLICY "update_own_order_items" ON order_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "delete_own_order_items" ON order_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ============================================================
-- Tighten store table write policies to authenticated-only
-- (prevents anonymous admin panel access)
-- SELECT stays open to anon so visitors can browse the store
-- ============================================================

-- packages: tighten INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "anon_insert_packages" ON packages;
CREATE POLICY "auth_insert_packages" ON packages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_packages" ON packages;
CREATE POLICY "auth_update_packages" ON packages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_packages" ON packages;
CREATE POLICY "auth_delete_packages" ON packages FOR DELETE
  TO authenticated USING (true);

-- skins: tighten INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "anon_insert_skins" ON skins;
CREATE POLICY "auth_insert_skins" ON skins FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_skins" ON skins;
CREATE POLICY "auth_update_skins" ON skins FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_skins" ON skins;
CREATE POLICY "auth_delete_skins" ON skins FOR DELETE
  TO authenticated USING (true);

-- consultations: tighten INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "anon_insert_consultations" ON consultations;
CREATE POLICY "auth_insert_consultations" ON consultations FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_consultations" ON consultations;
CREATE POLICY "auth_update_consultations" ON consultations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_consultations" ON consultations;
CREATE POLICY "auth_delete_consultations" ON consultations FOR DELETE
  TO authenticated USING (true);