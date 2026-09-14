import './App.css'

const appTitle: string = 'StudyFlow — Учебный менеджер'

export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <div className="header-meta">
          <span className="course-badge">ПГУ им. Т.Г. Шевченко • ФТИ</span>
          <span className="student-badge">Даниил Гандапас (гр. ФТ24ДР62ПИ1)</span>
        </div>
        <h1 className="app-title">{appTitle}</h1>
        <p className="app-description">
          Управление учебными курсами, практическими заданиями и дедлайнами семестра.
        </p>
      </header>

      <section className="app-section" aria-labelledby="items-title">
        <div className="section-header">
          <h2 id="items-title" className="section-title">Ближайшие дедлайны и задания</h2>
          <span className="status-badge">Лабораторная работа 1</span>
        </div>

        <div className="empty-state">
          <p className="empty-state-title">Здесь появится список учебных задач и дедлайнов.</p>
          <p className="empty-state-text">
            В следующих лабораторных работах будут подключены динамические компоненты, фильтрация по курсам (МЗЯП, ОС, Веб-разработка), формы добавления задач и синхронизация с базой данных Supabase.
          </p>
        </div>
      </section>
    </main>
  )
}
