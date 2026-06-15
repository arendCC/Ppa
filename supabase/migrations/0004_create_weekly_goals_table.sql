-- Wochenziele
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  week_start date not null,
  title text not null,
  completed boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index weekly_goals_user_id_week_start_idx on public.weekly_goals (user_id, week_start);

alter table public.weekly_goals enable row level security;

create policy "Weekly goals: select own"
  on public.weekly_goals for select
  using (auth.uid() = user_id);

create policy "Weekly goals: insert own"
  on public.weekly_goals for insert
  with check (auth.uid() = user_id);

create policy "Weekly goals: update own"
  on public.weekly_goals for update
  using (auth.uid() = user_id);

create policy "Weekly goals: delete own"
  on public.weekly_goals for delete
  using (auth.uid() = user_id);

create trigger weekly_goals_set_updated_at
  before update on public.weekly_goals
  for each row
  execute function public.set_updated_at();
