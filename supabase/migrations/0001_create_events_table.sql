-- Kalender-Termine
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)

-- Wiederverwendbare Funktion zum automatischen Setzen von updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  all_day boolean not null default false,
  color text not null default 'blue',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (end_time >= start_time),
  constraint events_color_check check (
    color in ('red', 'orange', 'yellow', 'green', 'mint', 'teal', 'blue', 'indigo', 'purple', 'pink')
  )
);

create index events_user_id_start_time_idx on public.events (user_id, start_time);

alter table public.events enable row level security;

create policy "Events: select own"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Events: insert own"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Events: update own"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Events: delete own"
  on public.events for delete
  using (auth.uid() = user_id);

create trigger events_set_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();
