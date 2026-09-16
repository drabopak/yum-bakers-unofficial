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

alter table public.orders enable row level security;

drop policy if exists "Allow public read access" on public.orders;
create policy "Allow public read access"
  on public.orders for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert access" on public.orders;
create policy "Allow public insert access"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public update access" on public.orders;
create policy "Allow public update access"
  on public.orders for update
  to anon, authenticated
  using (true);

alter publication supabase_realtime add table public.orders;
