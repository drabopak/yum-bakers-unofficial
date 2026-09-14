-- Yum Bakers & Sweets — orders table + Realtime setup.
-- Run this once in your Supabase project's SQL editor (or via the CLI:
-- `supabase db push` if you keep this file under supabase/migrations).

create table if not exists public.orders (
  id text primary key,
  customer_phone text not null,
  address text not null,
  items jsonb not null,
  total_amount numeric not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered')),
  created_at timestamptz not null default now()
);

-- Row Level Security is on, but this app has no Supabase Auth session (it
-- uses its own lightweight customer/staff auth — see context/auth-context.tsx
-- and lib/session.ts), so every request hits Postgres as the anonymous role.
-- These policies keep the anon key able to read/write orders. Tighten these
-- (e.g. restrict updates to a service role called from a server action) if
-- you move staff actions behind a real backend later.
alter table public.orders enable row level security;

drop policy if exists "Allow public read access" on public.orders;
create policy "Allow public read access"
  on public.orders for select
  using (true);

drop policy if exists "Allow public insert access" on public.orders;
create policy "Allow public insert access"
  on public.orders for insert
  with check (true);

drop policy if exists "Allow public update access" on public.orders;
create policy "Allow public update access"
  on public.orders for update
  using (true);

-- Required for postgres_changes realtime events (INSERT/UPDATE) to broadcast.
alter publication supabase_realtime add table public.orders;
