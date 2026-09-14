# Фундамент React 19, TypeScript и сборщика Vite

Закреплена архитектурная цепочка входа в React-приложение (`index.html` → `main.tsx` → `App.tsx`) и роль TypeScript как инструмента статического анализа на этапе сборки.

## Evidence
- Успешно смоделирована и зафиксирована ошибка `TS2322: Type 'number' is not assignable to type 'string'` при сборке, подтверждающая работу цепочки `"build": "tsc -b && vite build"`.
- Проверена чистая установка через `npm ci` и воспроизводимость без ручных правок.

## Implications
- Следующая лабораторная работа (ЛР 2) строится на расширении `App.tsx`: декомпозиция на дочерние компоненты (`CourseCard`, `DeadlineItem`), типизация пропсов (`interface CourseProps`) и внедрение состояния (`useState`).
