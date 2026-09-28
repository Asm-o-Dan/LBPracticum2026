import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router'
import { TaskCard } from '../components/TaskCard'
import type { Task, TaskStatus } from '../types/task'
import { exportTasksToJson, importTasksFromJson } from '../utils/fileStorage'

type TasksPageProps = {
  tasks: Task[]
  onImportTasks: (imported: Task[]) => void
}

export function TasksPage({ tasks, onImportTasks }: TasksPageProps) {
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')
  const [fileMessage, setFileMessage] = useState<{ text: string; isError?: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const visibleTasks = tasks.filter(
    (task) => status === 'all' || task.status === status
  )

  function handleExport() {
    exportTasksToJson(tasks)
    setFileMessage({ text: `Экспортировано ${tasks.length} задач в файл.` })
    setTimeout(() => setFileMessage(null), 4000)
  }

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imported = await importTasksFromJson(file)
      onImportTasks(imported)
      setFileMessage({ text: `Успешно загружено ${imported.length} задач из файла!` })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при чтении файла'
      setFileMessage({ text: msg, isError: true })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setTimeout(() => setFileMessage(null), 5000)
    }
  }

  return (
    <section className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Мои учебные задачи</h1>
          <p className="page-subtitle">Актуальные лабораторные работы и дедлайны семестра</p>
        </div>
        <div className="page-header-actions">
          <Link to="/tasks/new" className="button button-primary">
            + Добавить задачу
          </Link>
        </div>
      </div>

      <div className="controls-row">
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

        <div className="file-actions-bar">
          <button
            type="button"
            className="button button-outline button-small"
            title="Скачать текущий список задач в JSON-файл"
            onClick={handleExport}
          >
            💾 Экспорт в файл
          </button>
          <button
            type="button"
            className="button button-outline button-small"
            title="Загрузить ранее сохраненный список задач из JSON-файла"
            onClick={() => fileInputRef.current?.click()}
          >
            📂 Загрузить из файла
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {fileMessage && (
        <div
          className={`file-alert ${fileMessage.isError ? 'file-alert-error' : 'file-alert-success'}`}
          role="status"
        >
          {fileMessage.text}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Задач пока нет.</p>
          <p className="empty-state-text">
            Список задач пуст. Вы можете создать новую задачу или загрузить существующий список из сохраненного файла.
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
