-- 202610260001_initial_schema.sql
-- Лабораторная работа 5: Схема данных и справочник в Supabase
-- Проект: StudyFlow (Учебный менеджер)
-- Студент: Даниил Гандапас (гр. ФТ24ДР62ПИ1)

-- 1. Таблица-справочник категорий (тегов) учебных задач
create table if not exists public.tags (
  id text primary key,
  name text not null unique,
  constraint tags_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint tags_name_not_blank
    check (name = btrim(name) and name <> '')
);

-- 2. Основная таблица учебных задач (создается для схемы и FK; личные данные появятся в ЛР 6)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  tag_id text not null references public.tags(id)
    on update cascade on delete restrict,
  title text not null,
  description text not null default '',
  status text not null,
  due_date date not null,
  priority text not null,
  created_at timestamptz not null default now(),
  constraint tasks_title_length
    check (char_length(btrim(title)) between 3 and 100),
  constraint tasks_status_allowed
    check (status in ('todo', 'in_progress', 'done')),
  constraint tasks_priority_allowed
    check (priority in ('low', 'medium', 'high'))
);

-- 3. Настройка Row Level Security (RLS)
alter table public.tags enable row level security;
alter table public.tasks enable row level security;

-- 4. Отзыв всех клиентских прав по умолчанию
revoke all on table public.tags from anon, authenticated;
revoke all on table public.tasks from anon, authenticated;

-- 5. Выдача минимальных прав: чтение справочника для анонимных и авторизованных пользователей
grant select on table public.tags to anon, authenticated;

-- 6. Публичная политика чтения справочника tags
create policy "tags are publicly readable"
on public.tags
for select
to anon, authenticated
using (true);

-- Примечание: Таблица tasks остается полностью закрытой от клиентов в ЛР 5 (нет политик и GRANT).
