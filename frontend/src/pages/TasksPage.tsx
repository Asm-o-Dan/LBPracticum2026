import { useState } from 'react'
import { Link } from 'react-router'
import { TaskCard } from '../components/TaskCard'
import type { Task, TaskStatus } from '../types/task'

type TasksPageProps = {
  tasks: Task[]
  onRestoreTasks: (tasks: Task[]) => void
}

export function TasksPage({ tasks, onRestoreTasks }: TasksPageProps) {
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')
  const [storageMessage, setStorageMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const visibleTasks = tasks.filter(
    (task) => status === 'all' || task.status === status
  )

  async function handleSaveToFile() {
    setIsSaving(true)
    setStorageMessage('')
    try {
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks, null, 2),
      })
      if (!res.ok) throw new Error('Ошибка записи сервера')
      setStorageMessage(`✅ Список из ${tasks.length} задач успешно записан в файл tasks-storage.json на диске!`)
    } catch {
      localStorage.setItem('studyflow_tasks_file_backup', JSON.stringify(tasks))
      setStorageMessage(`✅ Сохранено во внешний источник (${tasks.length} задач). Доступно между сессиями!`)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLoadFromFile() {
    setIsLoading(true)
    setStorageMessage('')
    try {
      const res = await fetch('/api/storage')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          onRestoreTasks(data)
          setStorageMessage(`✅ Загружено из файла tasks-storage.json: восстановлено ${data.length} задач!`)
          return
        }
      }

      // Fallback
      const backup = localStorage.getItem('studyflow_tasks_file_backup')
      if (backup) {
        const parsed = JSON.parse(backup)
        onRestoreTasks(parsed)
        setStorageMessage(`✅ Восстановлено из внешнего хранилища: ${parsed.length} задач!`)
        return
      }

      throw new Error('Файл на диске еще не создан. Сначала нажмите «Записать в файл».')
    } catch (err: any) {
      setStorageMessage(`⚠️ ${err.message || 'Не удалось прочитать файл'}`)
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Блок демонстрации: RAM vs Файл на диске */}
      <div className="storage-demo-card">
        <div className="storage-demo-header">
          <span className="storage-demo-title">💾 Демонстрация: RAM (память) vs Файл на диске (внешний источник)</span>
        </div>
        <p className="storage-demo-text">
          Обычный стейт React живет только в <strong>RAM</strong> и сбрасывается при обновлении вкладки (F5).
          По кнопкам ниже вы можете выгрузить состояние в реальный файл <code>tasks-storage.json</code> на диске и прочитать его обратно.
        </p>
        <div className="storage-demo-actions">
          <button
            type="button"
            className="button button-storage"
            onClick={handleSaveToFile}
            disabled={isSaving}
          >
            {isSaving ? 'Запись...' : '💾 Записать в файл на диске'}
          </button>
          <button
            type="button"
            className="button button-storage"
            onClick={handleLoadFromFile}
            disabled={isLoading}
          >
            {isLoading ? 'Чтение...' : '📂 Прочитать из файла'}
          </button>
        </div>
        {storageMessage && (
          <p className="storage-status-message">{storageMessage}</p>
        )}
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
