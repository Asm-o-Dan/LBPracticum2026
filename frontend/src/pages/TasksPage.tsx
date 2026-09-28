import { useState } from 'react'
import { Link } from 'react-router'
import { TaskCard } from '../components/TaskCard'
import type { Task, TaskStatus } from '../types/task'

type TasksPageProps = {
  tasks: Task[]
}

export function TasksPage({ tasks }: TasksPageProps) {
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')

  const visibleTasks = tasks.filter(
    (task) => status === 'all' || task.status === status
  )

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

      <div className="filter-bar">
        <label htmlFor="status-filter" className="filter-label">
          Фильтр по статусу:
        </label>
        <select
          id="status-filter"
          className="form-select filter-select"
          value={status}
          onChange={(e) => {
            const val = e.target.value
            if (val === 'all' || val === 'todo' || val === 'in_progress' || val === 'done') {
              setStatus(val)
            }
          }}
        >
          <option value="all">Все задачи ({tasks.length})</option>
          <option value="todo">Запланировано</option>
          <option value="in_progress">В работе</option>
          <option value="done">Готово</option>
        </select>

        {status !== 'all' && (
          <button
            type="button"
            className="button button-outline button-small"
            onClick={() => setStatus('all')}
          >
            Сбросить фильтр
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Задач пока нет.</p>
          <p className="empty-state-text">
            Список задач пуст. Вы можете создать новую задачу с помощью кнопки выше.
          </p>
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Нет задач с выбранным статусом.</p>
          <p className="empty-state-text">
            Среди {tasks.length} имеющихся записей нет ни одной с текущим фильтром.
          </p>
          <button
            type="button"
            className="button button-outline"
            style={{ marginTop: '12px' }}
            onClick={() => setStatus('all')}
          >
            Показать все задачи
          </button>
        </div>
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  )
}
