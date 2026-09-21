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
            to="/tasks"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Задачи
          </NavLink>
          <NavLink
            to="/tasks/new"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Создать задачу
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
