/*
# Remove auth requirement — allow anon orders

## Purpose
The app no longer has a user/login system. Carts are stored in localStorage
on the client. Orders still persist to Supabase but are now created by
anonymous visitors. This migration:

1. Makes `orders.user_id` nullable (was NOT NULL DEFAULT auth.uid()).
2. Replaces all owner-scoped RLS policies on `orders` and `order_items`
   with anon+authenticated policies so the anon-key client can insert
   orders and order items without a session.
3. Drops the `carts` and `cart_items` tables (cart is now client-side in
   localStorage — these tables are no longer used).

## Modified Tables
- `orders` — `user_id` column altered to nullable.
- `order_items` — no schema change; policies replaced.

## Dropped Tables
- `carts` — no longer used (cart is client-side localStorage).
- `cart_items` — no longer used.

## Security Changes (RLS)
- `orders`: SELECT/INSERT/UPDATE/DELETE opened to `anon, authenticated`
  (single-tenant, no sign-in — orders are intentionally public).
- `order_items`: same anon+authenticated CRUD policies.

## Important Notes
1. No data is lost for `orders`/`order_items` — only the unused cart
   tables are dropped.
2. Store tables (packages, skins, consultations) keep their existing
   SELECT-open-to-anon + write-authenticated policies. Since there is
   no admin panel in the app anymore, store data is managed via the
   Bolt dashboard Table Editor (database icon in the Bolt UI).
*/

-- 1. Make orders.user_id nullable
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN user_id DROP DEFAULT;

-- 2. Replace orders RLS policies with anon+authenticated
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- 3. Replace order_items RLS policies with anon+authenticated
DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- 4. Drop unused cart tables (cart is now client-side localStorage)
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
