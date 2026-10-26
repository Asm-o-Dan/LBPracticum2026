import { Link } from 'react-router'
import type { Assignment } from '../types/assignment'

type AssignmentCardProps = {
  assignment: Assignment
}

const statusLabels: Record<Assignment['status'], string> = {
  todo: 'К выполнению',
  in_progress: 'В процессе',
  done: 'Сдано',
}

const priorityLabels: Record<Assignment['priority'], string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <span className={`status-tag status-${assignment.status}`}>
          {statusLabels[assignment.status]}
        </span>
        <span className={`priority-tag priority-${assignment.priority}`}>
          {priorityLabels[assignment.priority]}
        </span>
      </div>
      <h2 className="task-card-title">
        <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link>
      </h2>
      <p className="task-card-course">{assignment.course}</p>
      <p className="task-card-desc">{assignment.description}</p>
      <div className="task-card-footer">
        <span className="task-due-date">Срок: {assignment.dueDate}</span>
        <span className="task-tag">Тег: {assignment.tag}</span>
      </div>
    </article>
  )
}
