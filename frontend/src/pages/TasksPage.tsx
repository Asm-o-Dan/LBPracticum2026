import { Link } from 'react-router'
import { TaskCard } from '../components/TaskCard'
import { tasks } from '../data/tasks'

export function TasksPage() {
  return (
    <section className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Мои учебные задачи</h1>
          <p className="page-subtitle">Актуальные лабораторные работы и дедлайны семестра</p>
        </div>
        <Link to="/tasks/new" className="button button-primary">
          + Добавить задачу
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Задач пока нет.</p>
          <p className="empty-state-text">Все учебные задания сданы или список еще не сформирован.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  )
}
