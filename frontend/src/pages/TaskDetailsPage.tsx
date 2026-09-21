import { Link, useParams } from 'react-router'
import { tasks } from '../data/tasks'
import type { Task } from '../types/task'

const statusLabels: Record<Task['status'], string> = {
  todo: 'К выполнению',
  in_progress: 'В процессе выполнения',
  done: 'Сдано / Зачтено',
}

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Низкий приоритет',
  medium: 'Средний приоритет',
  high: 'Высокий приоритет',
}

export function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <section className="details-card not-found-card">
        <h1 className="page-title">Задача не найдена</h1>
        <p className="details-description">
          Запись с идентификатором <code>{id ?? '—'}</code> отсутствует в базе данных StudyFlow.
        </p>
        <Link to="/tasks" className="button button-outline">
          ← К списку задач
        </Link>
      </section>
    )
  }

  return (
    <section className="details-card">
      <div className="details-header">
        <div className="details-meta-tags">
          <span className={`status-tag status-${task.status}`}>
            {statusLabels[task.status]}
          </span>
          <span className={`priority-tag priority-${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>
          <span className="task-tag">{task.tag}</span>
        </div>
        <h1 className="details-title">{task.title}</h1>
        <p className="details-course">Дисциплина: <strong>{task.course}</strong></p>
      </div>

      <div className="details-body">
        <h2 className="details-section-title">Описание задания</h2>
        <p className="details-description">{task.description}</p>

        <div className="details-info-grid">
          <div className="info-item">
            <span className="info-label">Крайний срок (дедлайн):</span>
            <span className="info-value">{task.dueDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Идентификатор записи (ID):</span>
            <span className="info-value"><code>{task.id}</code></span>
          </div>
          <div className="info-item">
            <span className="info-label">Категория:</span>
            <span className="info-value">{task.tag}</span>
          </div>
        </div>
      </div>

      <div className="details-actions">
        <Link to="/tasks" className="button button-outline">
          ← К списку задач
        </Link>
      </div>
    </section>
  )
}
