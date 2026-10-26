# StudyFlow — Учебный менеджер

Лабораторный практикум по курсу «Практический курс веб-разработки (React, TypeScript, Node и Supabase)».  
ГОУ «Приднестровский государственный университет им. Т.Г. Шевченко», Физико-технический институт, кафедра ИТ.

- **Студент:** Даниил Гандапас
- **Группа:** ФТ24ДР62ПИ1
- **Преподаватель:** ст. преподаватель Бричаг Д.В.
- **Тема проекта:** Учебный менеджер (курсы, задания и дедлайны) — Тема 8 методички (`assignments` → `tags`)

---

## 1. Описание и основной сценарий

**StudyFlow** помогает студенту отслеживать семестровые курсы, дедлайны по лабораторным работам и статус выполнения практических заданий (`Assignment`). Пользователь просматривает список дисциплин, фильтрует задания по статусу, открывает карточку конкретного задания, создает новые записи с выбором категории из облачного справочника Supabase, редактирует поля или удаляет задания с подтверждением.

---

## 2. Стек технологий

- **Фронтенд-библиотека:** React 19
- **Маршрутизация (SPA):** React Router 8+ (маршруты `/assignments`, `/assignments/new`, `/assignments/:id`, `/assignments/:id/edit`)
- **База данных и BaaS:** PostgreSQL, Supabase (библиотека `@supabase/supabase-js`)
- **Безопасность БД:** Row Level Security (RLS), гранулярные права `GRANT/REVOKE`
- **Сетевые запросы:** Supabase Data API, `AbortController`, `AbortSignal`
- **Управление состоянием:** React Hooks (`useState`, `useEffect`, кастомный хук `useTags`)
- **Язык программирования:** TypeScript 5.8+ (строгий режим `strict: true`, модель `Assignment`, runtime type guard `isTag`)
- **Инструмент сборки и dev-сервер:** Vite 6 / Vite 8
- **Среда выполнения:** Node.js `22.23.0` (зафиксирована в `.node-version`)
- **Пакетный менеджер:** npm `10.9.8`
- **Контроль версий:** Git

---

## 3. Схема базы данных в Supabase (Лабораторная работа 5)

В Supabase PostgreSQL развернута реляционная схема под тему «Учебный менеджер»:

```
┌─────────────────────────────────┐           ┌───────────────────────────────────┐
│          public.tags            │           │        public.assignments         │
├─────────────────────────────────┤           ├───────────────────────────────────┤
│ id: text (PK)                   │◄───┐      │ id: uuid (PK, gen_random_uuid)    │
│ name: text (UNIQUE, NOT NULL)   │    └──────│ tag_id: text (FK -> tags.id)      │
│                                 │           │ owner_id: uuid (FK auth.users)    │
│ CHECK(id = btrim(id) AND <> '') │           │ title: text (3..100 chars)        │
│ CHECK(name = btrim(name) <> '') │           │ description: text                 │
└─────────────────────────────────┘           │ status: text (todo/progress/done) │
         ▲                                    │ due_date: date                    │
         │ (SELECT открыт для всех)           │ priority: text (low/med/high)     │
         │                                    │ created_at: timestamptz           │
┌─────────────────────────┐                   └───────────────────────────────────┘
│ anon / authenticated    │                                     ▲
│ RLS: USING (true)       │                                     │ (ПОЛНОСТЬЮ ЗАКРЫТА
└─────────────────────────┘                                     │  ОТ КЛИЕНТОВ ДО ЛР 6)
```

1. **`public.tags` (Публичный справочник категорий учебных заданий):**
   - Назначение: категории учебных работ (`lab`: Лабораторная, `practice`: Практика, `seminar`: Семинар, `coursework`: Курсовая работа, `exam`: Экзамен).
   - Доступ: открыт на чтение (`GRANT SELECT`, политика `"tags are publicly readable"`).
   - Запись клиентам запрещена (`REVOKE ALL`).
2. **`public.assignments` (Учебные задания):**
   - Назначение: основная сущность учебных работ семестра.
   - Ограничения: `CHECK` на длину названия (3–100), допустимые статусы (`todo`, `in_progress`, `done`) и приоритеты (`low`, `medium`, `high`).
   - Доступ: RLS включен, права отозваны. До ЛР 6 (внедрения Supabase Auth) таблица закрыта для клиентов.

---

## 4. Настройка окружения и запуск

### 1. Переменные окружения
Создайте файл `frontend/.env.local` на основе образца `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env.local
```

Заполните переменные учетными данными своего проекта Supabase:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

### 2. Запуск в режиме разработки
```bash
cd frontend
npm ci
npm run dev
```

### 3. Проверка сборки и preview
```bash
cd frontend
npm run build
npm run preview
```
