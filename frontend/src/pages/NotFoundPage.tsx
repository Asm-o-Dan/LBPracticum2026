import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="page-section not-found-page">
      <h1 className="page-title">Страница не найдена (404)</h1>
      <p className="page-description">
        Запрашиваемый адрес не существует или был перемещен.
      </p>
      <div className="section-actions">
        <Link to="/tasks" className="button button-primary">
          ← Вернуться к списку задач
        </Link>
      </div>
    </section>
  )
}
