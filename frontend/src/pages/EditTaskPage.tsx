import { Link, useNavigate, useParams } from 'react-router'
import { TaskForm } from '../components/TaskForm'
import type { Task, TaskDraft } from '../types/task'

type EditTaskPageProps = {
  tasks: Task[]
  onUpdate: (id: string, draft: TaskDraft) => void
}

export function EditTaskPage({ tasks, onUpdate }: EditTaskPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <section className="details-card not-found-card">
        <h1 className="page-title">Задача не найдена</h1>
        <p className="details-description">
          Запись с идентификатором <code>{id ?? '—'}</code> отсутствует в списке.
        </p>
        <Link to="/tasks" className="button button-outline">
          ← К списку задач
        </Link>
      </section>
    )
  }

  const initialValues: TaskDraft = {
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    priority: task.priority,
    course: task.course,
    tag: task.tag,
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Редактирование задачи</h1>
          <p className="page-subtitle">Внесите изменения в поля задачи (ID: <code>{task.id}</code>)</p>
        </div>
      </div>
      <TaskForm
        key={task.id}
        initialValues={initialValues}
        onSave={(draft) => {
          onUpdate(task.id, draft)
          navigate(`/tasks/${task.id}`)
        }}
        onCancel={() => navigate(`/tasks/${task.id}`)}
      />
    </section>
  )
}
