import { Link } from 'react-router'

export function NewTaskPage() {
  return (
    <section className="page-section">
      <h1 className="page-title">Создание задачи</h1>
      <div className="info-placeholder">
        <p className="placeholder-primary">
          Интерактивная форма добавления и валидации учебных задач будет разработана в рамках <strong>Лабораторной работы №3</strong>.
        </p>
        <p className="placeholder-secondary">
          На текущем этапе (ЛР 2) данные задач берутся из предварительно типизированного массива, поэтому кнопка сохранения пока не добавляется во избежание имитации неработающего функционала.
        </p>
      </div>
      <div className="section-actions">
        <Link to="/tasks" className="button button-outline">
          ← Вернуться к списку задач
        </Link>
      </div>
    </section>
  )
}
