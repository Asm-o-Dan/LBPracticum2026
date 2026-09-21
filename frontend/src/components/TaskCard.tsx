import { Link } from 'react-router'
import type { Task } from '../types/task'

type TaskCardProps = {
  task: Task
}

const statusLabels: Record<Task['status'], string> = {
  todo: 'К выполнению',
  in_progress: 'В процессе',
  done: 'Сдано',
}

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <span className={`status-tag status-${task.status}`}>
          {statusLabels[task.status]}
        </span>
        <span className={`priority-tag priority-${task.priority}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>
      <h2 className="task-card-title">
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h2>
      <p className="task-card-course">{task.course}</p>
      <p className="task-card-desc">{task.description}</p>
      <div className="task-card-footer">
        <span className="task-due-date">Срок: {task.dueDate}</span>
        <span className="task-tag">{task.tag}</span>
      </div>
    </article>
  )
}
