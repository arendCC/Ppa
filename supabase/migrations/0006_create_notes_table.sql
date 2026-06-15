-- Notizen (freie Notizen, Tagesnotizen, Wochennotizen)
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null,
  title text,
  content text not null default '',
  note_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_type_check check (type in ('free', 'daily', 'weekly')),
  -- Tages- und Wochennotizen benötigen ein Datum (Tag bzw. Wochenstart), freie Notizen nicht.
  constraint notes_note_date_required check (type = 'free' or note_date is not null)
);

-- Höchstens eine Tages- bzw. Wochennotiz pro Nutzer und Datum.
create unique index notes_daily_unique_idx on public.notes (user_id, note_date) where type = 'daily';
create unique index notes_weekly_unique_idx on public.notes (user_id, note_date) where type = 'weekly';

create index notes_user_id_type_idx on public.notes (user_id, type, note_date desc);

alter table public.notes enable row level security;

create policy "Notes: select own"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Notes: insert own"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Notes: update own"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Notes: delete own"
  on public.notes for delete
  using (auth.uid() = user_id);

create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();
