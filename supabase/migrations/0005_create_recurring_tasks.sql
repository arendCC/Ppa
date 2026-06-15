-- Wiederkehrende Aufgaben
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)
--
-- Hinweis: public.set_updated_at() wurde bereits in 0001_create_events_table.sql angelegt.

create table public.recurring_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium',
  category text,
  recurrence_type text not null,
  recurrence_interval integer not null default 1,
  next_due_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recurring_tasks_priority_check check (priority in ('low', 'medium', 'high')),
  constraint recurring_tasks_recurrence_type_check check (recurrence_type in ('daily', 'weekly', 'monthly', 'custom')),
  constraint recurring_tasks_interval_check check (recurrence_interval >= 1)
);

create index recurring_tasks_user_id_next_due_date_idx on public.recurring_tasks (user_id, next_due_date);

alter table public.recurring_tasks enable row level security;

create policy "Recurring tasks: select own"
  on public.recurring_tasks for select
  using (auth.uid() = user_id);

create policy "Recurring tasks: insert own"
  on public.recurring_tasks for insert
  with check (auth.uid() = user_id);

create policy "Recurring tasks: update own"
  on public.recurring_tasks for update
  using (auth.uid() = user_id);

create policy "Recurring tasks: delete own"
  on public.recurring_tasks for delete
  using (auth.uid() = user_id);

create trigger recurring_tasks_set_updated_at
  before update on public.recurring_tasks
  for each row
  execute function public.set_updated_at();

-- Verknüpfung: aus welcher Vorlage wurde eine Aufgabe erzeugt?
alter table public.tasks
  add column recurring_task_id uuid references public.recurring_tasks (id) on delete set null;

create index tasks_recurring_task_id_idx on public.tasks (recurring_task_id);

-- Erzeugt fällige Aufgaben aus aktiven wiederkehrenden Vorlagen des angemeldeten Nutzers
-- und rückt next_due_date entsprechend dem Intervall vor. Holt dabei auch mehrere
-- verpasste Termine nach, falls die App länger nicht geöffnet war.
create or replace function public.generate_due_recurring_tasks()
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  r record;
  next_date date;
begin
  for r in
    select * from public.recurring_tasks
    where active and user_id = auth.uid() and next_due_date <= current_date
  loop
    next_date := r.next_due_date;

    while next_date <= current_date loop
      insert into public.tasks (user_id, title, description, priority, category, due_date, recurring_task_id)
      values (r.user_id, r.title, r.description, r.priority, r.category, next_date, r.id);

      next_date := case r.recurrence_type
        when 'daily' then next_date + 1
        when 'weekly' then next_date + 7
        when 'monthly' then (next_date + interval '1 month')::date
        else next_date + r.recurrence_interval
      end;
    end loop;

    update public.recurring_tasks set next_due_date = next_date where id = r.id;
  end loop;
end;
$$;

grant execute on function public.generate_due_recurring_tasks() to authenticated;
