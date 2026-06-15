-- Aufgaben (To-Dos)
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium',
  category text,
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_priority_check check (priority in ('low', 'medium', 'high'))
);

create index tasks_user_id_due_date_idx on public.tasks (user_id, due_date);

alter table public.tasks enable row level security;

create policy "Tasks: select own"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Tasks: insert own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Tasks: update own"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Tasks: delete own"
  on public.tasks for delete
  using (auth.uid() = user_id);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row
  execute function public.set_updated_at();
