/*
# Menu Management, Multi-Passkey Roles, and Audit Tracking

## Overview
This migration adds three new capabilities to the Yum Bakers system:
1. A `menu_items` table for dynamic menu management (CRUD by the owner)
2. A `staff_passkeys` table for multi-passkey role management
3. Audit attribution columns on the `orders` table to track which passkey prepared and delivered each order

## New Tables

### menu_items
- `id` (text, primary key) — slug-style identifier (e.g. "celebration-cake")
- `name` (text, not null) — display name
- `description` (text, not null) — item description
- `price` (numeric, not null) — price in PKR
- `category` (text, not null) — category id (cakes, mithai, chicken, dairy)
- `image` (text, not null) — image URL (external link or local path)
- `is_available` (boolean, default true) — when false, hidden from customer menu but not deleted
- `created_at` (timestamptz, default now())

### staff_passkeys
- `id` (uuid, primary key) — auto-generated
- `role` (text, not null) — one of 'chef', 'delivery', 'owner'
- `passkey` (text, not null, unique) — the passkey string (e.g. "CHEF-1234")
- `label` (text, not null) — human-readable label (e.g. "Chef - Morning Shift")
- `is_active` (boolean, default true) — can be deactivated without deleting
- `created_at` (timestamptz, default now())

## Modified Tables

### orders (new columns)
- `prepared_by` (text, nullable) — label of the passkey that moved the order to Preparing
- `prepared_at` (timestamptz, nullable) — timestamp when the order was marked Preparing
- `delivered_by` (text, nullable) — label of the passkey that marked the order Delivered
- `delivered_at` (timestamptz, nullable) — timestamp when the order was marked Delivered

## Security
- RLS enabled on both new tables with anon+authenticated full access (single-tenant, no Supabase Auth)
- Orders table policies updated to include the new columns (no policy change needed — existing USING (true) covers all columns)

## Seed Data
- Seeds all 21 existing menu items from yum-data.ts into menu_items
- Seeds 3 default passkeys (CHEF-1234, DEL-1234, OWNER-1234)
*/

-- ===== MENU ITEMS TABLE =====
CREATE TABLE IF NOT EXISTS public.menu_items (
  id text primary key,
  name text not null,
  description text not null,
  price numeric not null,
  category text not null,
  image text not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_menu_items" ON public.menu_items;
CREATE POLICY "anon_select_menu_items" ON public.menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_menu_items" ON public.menu_items;
CREATE POLICY "anon_insert_menu_items" ON public.menu_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_items" ON public.menu_items;
CREATE POLICY "anon_update_menu_items" ON public.menu_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_items" ON public.menu_items;
CREATE POLICY "anon_delete_menu_items" ON public.menu_items FOR DELETE
  TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

-- ===== STAFF PASSKEYS TABLE =====
CREATE TABLE IF NOT EXISTS public.staff_passkeys (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('chef', 'delivery', 'owner')),
  passkey text not null unique,
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.staff_passkeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_staff_passkeys" ON public.staff_passkeys;
CREATE POLICY "anon_select_staff_passkeys" ON public.staff_passkeys FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_staff_passkeys" ON public.staff_passkeys;
CREATE POLICY "anon_insert_staff_passkeys" ON public.staff_passkeys FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_staff_passkeys" ON public.staff_passkeys;
CREATE POLICY "anon_update_staff_passkeys" ON public.staff_passkeys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_staff_passkeys" ON public.staff_passkeys;
CREATE POLICY "anon_delete_staff_passkeys" ON public.staff_passkeys FOR DELETE
  TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_passkeys;

-- ===== ORDERS AUDIT COLUMNS =====
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'prepared_by') THEN
    ALTER TABLE public.orders ADD COLUMN prepared_by text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'prepared_at') THEN
    ALTER TABLE public.orders ADD COLUMN prepared_at timestamptz;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_by') THEN
    ALTER TABLE public.orders ADD COLUMN delivered_by text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
    ALTER TABLE public.orders ADD COLUMN delivered_at timestamptz;
  END IF;
END $$;

-- ===== SEED MENU ITEMS =====
INSERT INTO public.menu_items (id, name, description, price, category, image) VALUES
  ('celebration-cake', 'Celebration Cake', 'Custom-designed layered cake with fresh cream and seasonal toppings.', 3200, 'cakes', '/images/celebration-cake.png'),
  ('chocolate-fudge', 'Chocolate Fudge Cake', 'Rich Belgian chocolate sponge layered with silky fudge ganache.', 2400, 'cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'),
  ('black-forest', 'Black Forest Cake', 'Classic cocoa sponge, whipped cream, cherries and chocolate shavings.', 2200, 'cakes', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80'),
  ('red-velvet', 'Red Velvet Cake', 'Velvety crimson layers with tangy cream cheese frosting.', 2600, 'cakes', 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80'),
  ('fresh-pastries', 'Fresh Pastries', 'Assorted daily pastries — creamy, fruity and freshly glazed.', 180, 'cakes', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80'),
  ('croissants', 'Croissants & Bakery', 'Buttery, flaky croissants and oven-fresh artisan bakery.', 220, 'cakes', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'),
  ('gulab-jamun', 'Gulab Jamun', 'Soft khoya dumplings soaked in warm cardamom-rose syrup.', 900, 'mithai', '/images/gulab-jamun.png'),
  ('mixed-barfi', 'Mixed Barfi / Mithai', 'A festive assortment of milk barfi, pista and kaju delights.', 1400, 'mithai', '/images/mixed-barfi.png'),
  ('rasgulla', 'Rasgulla & Cham Cham', 'Spongy chenna sweets in light sugar syrup, Bengali style.', 1000, 'mithai', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'),
  ('desi-ghee-laddu', 'Desi Ghee Laddu', 'Golden besan laddu roasted in pure desi ghee.', 1200, 'mithai', '/images/desi-ghee-laddu.png'),
  ('rasmalai', 'Fresh Rasmalai', 'Delicate chenna patties in saffron-infused thickened milk.', 1100, 'mithai', '/images/rasmalai.png'),
  ('combo-2pc', '2-Piece Signature Combo', 'Two crispy fried pieces with fries and a dip.', 650, 'chicken', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80'),
  ('meal-4pc', '4-Piece Value Meal', 'Four juicy pieces with fries, coleslaw and drink.', 1150, 'chicken', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80'),
  ('bucket-8pc', '8-Piece Family Bucket', 'A full bucket of signature fried chicken for the family.', 2100, 'chicken', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'),
  ('zinger-burger', 'Crunchy Zinger Burger', 'Crispy fillet, fresh lettuce and creamy sauce in a soft bun.', 480, 'chicken', 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=600&q=80'),
  ('spicy-wings', 'Spicy Wings', 'Fiery glazed wings tossed in our house hot sauce.', 560, 'chicken', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80'),
  ('organic-honey', 'Pure Organic Honey', 'Raw, unfiltered honey harvested from natural apiaries.', 850, 'dairy', '/images/organic-honey.png'),
  ('fresh-milk', 'Fresh Dairy Milk', 'Farm-fresh full cream milk, delivered daily.', 220, 'dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'),
  ('fresh-juices', 'Fresh Juices', 'Seasonal fruit juices pressed fresh to order.', 320, 'dairy', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80'),
  ('milkshakes', 'Milkshakes & Iced Coffee', 'Thick creamy shakes and chilled iced coffee blends.', 420, 'dairy', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'),
  ('pizza-showcase', 'Wood-Fired Pizza', 'Hand-stretched dough, rich sauce and bubbling cheese.', 990, 'dairy', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- ===== SEED DEFAULT PASSKEYS =====
INSERT INTO public.staff_passkeys (role, passkey, label) VALUES
  ('chef', 'CHEF-1234', 'Chef - Default'),
  ('delivery', 'DEL-1234', 'Delivery - Default'),
  ('owner', 'OWNER-1234', 'Owner - Default')
ON CONFLICT (passkey) DO NOTHING;
