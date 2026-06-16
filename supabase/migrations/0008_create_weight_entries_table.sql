-- Gewichtseinträge für das Fitness-Tracking
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 2) not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint weight_entries_weight_positive check (weight_kg > 0),
  constraint weight_entries_user_date_unique unique (user_id, date)
);

create index weight_entries_user_id_date_idx on public.weight_entries (user_id, date);

alter table public.weight_entries enable row level security;

create policy "Weight entries: select own"
  on public.weight_entries for select
  using (auth.uid() = user_id);

create policy "Weight entries: insert own"
  on public.weight_entries for insert
  with check (auth.uid() = user_id);

create policy "Weight entries: update own"
  on public.weight_entries for update
  using (auth.uid() = user_id);

create policy "Weight entries: delete own"
  on public.weight_entries for delete
  using (auth.uid() = user_id);

create trigger weight_entries_set_updated_at
  before update on public.weight_entries
  for each row
  execute function public.set_updated_at();
