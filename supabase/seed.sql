-- seed.sql
-- Начальные справочные данные для Лабораторной работы 5
-- Справочник тегов задач проекта StudyFlow

insert into public.tags (id, name)
values
  ('lab', 'Лабораторная'),
  ('practice', 'Практика'),
  ('seminar', 'Семинар'),
  ('coursework', 'Курсовая работа'),
  ('exam', 'Экзамен')
on conflict (id) do update
set name = excluded.name;
