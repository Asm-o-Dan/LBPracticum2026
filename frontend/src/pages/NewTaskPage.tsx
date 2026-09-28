import { useNavigate } from 'react-router'
import { TaskForm } from '../components/TaskForm'
import type { TaskDraft } from '../types/task'

type NewTaskPageProps = {
  onCreate: (draft: TaskDraft) => string
}

const emptyTask: TaskDraft = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
  priority: 'medium',
  course: '',
  tag: '',
}

export function NewTaskPage({ onCreate }: NewTaskPageProps) {
  const navigate = useNavigate()

  function handleSave(draft: TaskDraft) {
    const id = onCreate(draft)
    navigate(`/tasks/${id}`)
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Создание задачи</h1>
          <p className="page-subtitle">Добавьте новую учебную работу в список семестра</p>
        </div>
      </div>
      <TaskForm
        initialValues={emptyTask}
        onSave={handleSave}
        onCancel={() => navigate('/tasks')}
      />
    </section>
  )
}
