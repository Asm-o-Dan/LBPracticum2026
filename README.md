# StudyFlow — Учебный менеджер

Лабораторный практикум по курсу «Практический курс веб-разработки (React, TypeScript, Node и Supabase)».  
ГОУ «Приднестровский государственный университет им. Т.Г. Шевченко», Физико-технический институт, кафедра ИТ.

- **Студент:** Даниил Гандапас
- **Группа:** ФТ24ДР62ПИ1
- **Преподаватель:** ст. преподаватель Бричаг Д.В.
- **Тема проекта:** Учебный менеджер (курсы, задания и дедлайны)

---

## 1. Описание и основной сценарий

**StudyFlow** помогает студенту отслеживать семестровые курсы, дедлайны по лабораторным работам и статус выполнения практических заданий. Пользователь просматривает список дисциплин, фильтрует задачи по статусу, открывает карточку конкретного задания, создает новые записи с выбором категории из облачного справочника Supabase, редактирует поля или удаляет задачи с подтверждением.

---

## 2. Стек технологий

- **Фронтенд-библиотека:** React 19
- **Маршрутизация (SPA):** React Router 8+ (декларативный API)
- **База данных и BaaS:** PostgreSQL, Supabase (библиотека `@supabase/supabase-js`)
- **Безопасность БД:** Row Level Security (RLS), гранулярные права `GRANT/REVOKE`
- **Сетевые запросы:** Supabase Data API, `AbortController`, `AbortSignal`
- **Управление состоянием:** React Hooks (`useState`, `useEffect`, кастомный хук `useTags`)
- **Язык программирования:** TypeScript 5.8+ (строгий режим `strict: true`, runtime type guard `isTag`)
- **Инструмент сборки и dev-сервер:** Vite 6 / Vite 8
- **Среда выполнения:** Node.js `22.23.0` (зафиксирована в `.node-version`)
- **Пакетный менеджер:** npm `10.9.8`
- **Контроль версий:** Git

---

## 3. Схема базы данных в Supabase (Лабораторная работа 5)

В Supabase PostgreSQL развернуты 2 таблицы с внешними ключами и ограничениями целостности:

```
┌─────────────────────────────────┐           ┌───────────────────────────────┐
│          public.tags            │           │         public.tasks          │
├─────────────────────────────────┤           ├───────────────────────────────┤
│ id: text (PK)                   │◄───┐      │ id: uuid (PK, gen_random_uuid)│
│ name: text (UNIQUE, NOT NULL)   │    └──────│ tag_id: text (FK -> tags.id)  │
│                                 │           │ owner_id: uuid (FK auth.users)│
│ CHECK(id = btrim(id) AND <> '') │           │ title: text (3..100 chars)    │
│ CHECK(name = btrim(name) <> '') │           │ description: text             │
└─────────────────────────────────┘           │ status: text (todo/progress)  │
         ▲                                    │ due_date: date                │
         │ (SELECT открыт для всех)           │ priority: text (low/med/high) │
         │                                    │ created_at: timestamptz       │
┌─────────────────────────┐                   └───────────────────────────────┘
│ anon / authenticated    │                                  ▲
│ RLS: USING (true)       │                                  │ (ПОЛНОСТЬЮ ЗАКРЫТА
└─────────────────────────┘                                  │  ОТ КЛИЕНТОВ ДО ЛР 6)
```

1. **`public.tags` (Публичный справочник):**
   - Назначение: категории учебных работ (`lab`, `practice`, `seminar`, `coursework`, `exam`).
   - Доступ: открыт на чтение (`GRANT SELECT`, политика `"tags are publicly readable"`).
   - Запись клиентам запрещена (`REVOKE ALL`).
2. **`public.tasks` (Личные задачи):**
   - Назначение: основная сущность учебных заданий.
   - Ограничения: `CHECK` на длину названия (3–100), допустимые статусы (`todo`, `in_progress`, `done`) и приоритеты (`low`, `medium`, `high`).
   - Доступ: RLS включен, права отозваны. До ЛР 6 (внедрения Supabase Auth) таблица закрыта для клиентов.

> [!NOTE]  
> **Временное хранение основных записей:** Основной список задач в ЛР 5 по-прежнему хранится в оперативной памяти приложения (`useState` в `App.tsx`) и возвращается к демонстрационному набору при перезагрузке (F5). В БД перенесен **только справочник тегов**. В ЛР 6 появится авторизация пользователей и полноценное облачное хранение задач.

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

> [!WARNING]  
> Файл `.env.local` добавлен в `.gitignore` и никогда не фиксируется в репозитории. В публичный клиент допустим только **publishable / anon key**. Использование `service_role` и паролей базы в frontend строго запрещено.

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

---

## 5. Что сделано в Лабораторной работе 5

1. **SQL-миграция и воспроизводимый Seed:**
   - Файл миграции: [`supabase/migrations/202610260001_initial_schema.sql`](file:///c:/Users/DaniilTuT/Documents/antigravity/excited-franklin/supabase/migrations/202610260001_initial_schema.sql) — DDL таблиц, ключи, `CHECK`, `RLS`, `REVOKE/GRANT`, политики.
   - Файл начальных данных: [`supabase/seed.sql`](file:///c:/Users/DaniilTuT/Documents/antigravity/excited-franklin/supabase/seed.sql) — `UPSERT` 5 справочных записей.
2. **Подключение клиента Supabase:**
   - Установлен пакет `@supabase/supabase-js`.
   - Инициализирован синглтон клиента в [`frontend/src/lib/supabase.ts`](file:///c:/Users/DaniilTuT/Documents/antigravity/excited-franklin/frontend/src/lib/supabase.ts) с проверкой конфигурации.
3. **Обновление сервиса тегов (`src/services/tags.ts`):**
   - Учебный статический `tags.json` удален.
   - Запрос переписан на вызов `supabase.from('tags').select('id, name').order('name').abortSignal(signal)`.
   - Сохранена строгая runtime-валидация через `parseTags` и `isTag`.
4. **Интерфейс формы `TaskForm`:**
   - Сохранены все состояния: загрузка, ошибка, пустой справочник.
   - Добавлена кнопка **«🔄 Обновить справочник»** (вызывает `retry()` без отправки формы).
   - Защита сохранения (`disabled={!canSave}`) предотвращает отправку при отсутствии связи с БД.
5. **Безопасность данных:**
   - Проверен запрет клиентской записи в `tags` (ошибка доступа).
   - Проверен запрет чтения личной таблицы `tasks` (закрыта RLS).
