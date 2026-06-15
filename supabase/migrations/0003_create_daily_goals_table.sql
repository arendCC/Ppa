-- Tagesziele
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.daily_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index daily_goals_user_id_date_idx on public.daily_goals (user_id, date);

alter table public.daily_goals enable row level security;

create policy "Daily goals: select own"
  on public.daily_goals for select
  using (auth.uid() = user_id);

create policy "Daily goals: insert own"
  on public.daily_goals for insert
  with check (auth.uid() = user_id);

create policy "Daily goals: update own"
  on public.daily_goals for update
  using (auth.uid() = user_id);

create policy "Daily goals: delete own"
  on public.daily_goals for delete
  using (auth.uid() = user_id);

create trigger daily_goals_set_updated_at
  before update on public.daily_goals
  for each row
  execute function public.set_updated_at();

-- Maximal 5 Tagesziele pro Nutzer und Tag (Anforderung "Bis zu 5 Tagesziele").
create or replace function public.enforce_daily_goal_limit()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*) from public.daily_goals
    where user_id = new.user_id and date = new.date
  ) >= 5 then
    raise exception 'Maximal 5 Tagesziele pro Tag erlaubt.';
  end if;
  return new;
end;
$$;

create trigger daily_goals_limit_check
  before insert on public.daily_goals
  for each row
  execute function public.enforce_daily_goal_limit();
