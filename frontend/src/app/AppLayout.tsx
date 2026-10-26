import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-meta">
          <span className="course-badge">ПГУ им. Т.Г. Шевченко • ФТИ</span>
          <span className="student-badge">Даниил Гандапас (гр. ФТ24ДР62ПИ1)</span>
        </div>
        <p className="app-title">StudyFlow — Учебный менеджер</p>
        <p className="app-description">
          Управление учебными курсами, практическими заданиями и дедлайнами семестра.
        </p>
        <nav className="app-nav" aria-label="Основная навигация">
          <NavLink
            to="/assignments"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Задания
          </NavLink>
          <NavLink
            to="/assignments/new"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Создать задание
          </NavLink>
        </nav>
        <div className="session-warning" role="status">
          ℹ️ <strong>Режим сеанса (ЛР 5):</strong> Справочник тегов загружается из облачной базы <strong>Supabase (PostgreSQL)</strong>. Основные задания сохраняются в памяти приложения до ЛР 6.
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
