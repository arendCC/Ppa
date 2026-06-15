-- Ergänzt tasks um completed_at, damit Statistiken (erledigte Aufgaben
-- pro Woche/Monat, Produktivitätstrends) ausgewertet werden können.
--
-- Ausführen: Supabase Dashboard -> SQL Editor -> New query -> Inhalt einfügen -> Run
-- (oder via Supabase CLI: supabase db push)

alter table public.tasks
  add column completed_at timestamptz;

-- Bereits erledigte Aufgaben erhalten updated_at als Näherungswert für completed_at.
update public.tasks set completed_at = updated_at where completed = true and completed_at is null;
