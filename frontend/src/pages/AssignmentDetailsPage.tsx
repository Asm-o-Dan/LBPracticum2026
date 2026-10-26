import { Link, useNavigate, useParams } from 'react-router'
import type { Assignment } from '../types/assignment'

type AssignmentDetailsPageProps = {
  assignments: Assignment[]
  onDelete: (id: string) => void
}

const statusLabels: Record<Assignment['status'], string> = {
  todo: 'К выполнению',
  in_progress: 'В процессе выполнения',
  done: 'Сдано / Зачтено',
}

const priorityLabels: Record<Assignment['priority'], string> = {
  low: 'Низкий приоритет',
  medium: 'Средний приоритет',
  high: 'Высокий приоритет',
}

export function AssignmentDetailsPage({ assignments, onDelete }: AssignmentDetailsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  if (!assignment) {
    return (
      <section className="details-card not-found-card">
        <h1 className="page-title">Задание не найдено</h1>
        <p className="details-description">
          Запись с идентификатором <code>{id ?? '—'}</code> отсутствует в базе данных StudyFlow.
        </p>
        <Link to="/assignments" className="button button-outline">
          ← К списку заданий
        </Link>
      </section>
    )
  }

  function handleDelete() {
    if (window.confirm(`Удалить задание «${assignment!.title}»?`)) {
      onDelete(assignment!.id)
      navigate('/assignments', { replace: true })
    }
  }

  return (
    <section className="details-card">
      <div className="details-header">
        <div className="details-meta-tags">
          <span className={`status-tag status-${assignment.status}`}>
            {statusLabels[assignment.status]}
          </span>
          <span className={`priority-tag priority-${assignment.priority}`}>
            {priorityLabels[assignment.priority]}
          </span>
          <span className="task-tag">Тег: {assignment.tag}</span>
        </div>
        <h1 className="details-title">{assignment.title}</h1>
        <p className="details-course">Дисциплина: <strong>{assignment.course}</strong></p>
      </div>

      <div className="details-body">
        <h2 className="details-section-title">Описание задания</h2>
        <p className="details-description">{assignment.description}</p>

        <div className="details-info-grid">
          <div className="info-item">
            <span className="info-label">Крайний срок (дедлайн):</span>
            <span className="info-value">{assignment.dueDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Идентификатор записи (ID):</span>
            <span className="info-value"><code>{assignment.id}</code></span>
          </div>
          <div className="info-item">
            <span className="info-label">Тег (код справочника):</span>
            <span className="info-value"><code>{assignment.tag}</code></span>
          </div>
        </div>
      </div>

      <div className="details-actions">
        <Link to={`/assignments/${assignment.id}/edit`} className="button button-primary">
          ✏️ Редактировать
        </Link>
        <button type="button" className="button button-danger" onClick={handleDelete}>
          🗑️ Удалить
        </button>
        <Link to="/assignments" className="button button-outline">
          ← К списку заданий
        </Link>
      </div>
    </section>
  )
}
