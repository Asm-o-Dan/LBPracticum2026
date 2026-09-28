import { useState } from 'react'
import type { FormEvent } from 'react'
import type { TaskDraft, TaskPriority, TaskStatus } from '../types/task'

type TaskFormProps = {
  initialValues: TaskDraft
  onSave: (draft: TaskDraft) => void
  onCancel: () => void
}

export function TaskForm(props: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => ({ ...props.initialValues }))
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.title.trim()

    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }

    if (!draft.dueDate) {
      setError('Укажите срок сдачи задачи.')
      return
    }

    // Предметное правило (Шаг 6 методички):
    // Завершённая задача должна иметь непустое описание результата сдачи
    if (draft.status === 'done' && !draft.description.trim()) {
      setError('Завершённая задача должна иметь непустое описание результата.')
      return
    }

    setError('')
    props.onSave({ ...draft, title })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-banner" role="alert">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Название задачи <span className="required-star">*</span>
        </label>
        <input
          id="task-title"
          className="form-input"
          value={draft.title}
          required
          placeholder="Например: Лабораторная работа 3"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-course" className="form-label">
            Учебная дисциплина
          </label>
          <input
            id="task-course"
            className="form-input"
            value={draft.course}
            placeholder="Например: Веб-разработка"
            onChange={(e) => setDraft({ ...draft, course: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-date" className="form-label">
            Крайний срок (дедлайн) <span className="required-star">*</span>
          </label>
          <input
            id="task-date"
            type="date"
            className="form-input"
            value={draft.dueDate}
            required
            onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">
            Статус выполнения
          </label>
          <select
            id="task-status"
            className="form-select"
            value={draft.status}
            onChange={(e) => {
              const status = e.target.value as TaskStatus
              if (status === 'todo' || status === 'in_progress' || status === 'done') {
                setDraft({ ...draft, status })
              }
            }}
          >
            <option value="todo">Запланировано</option>
            <option value="in_progress">В работе</option>
            <option value="done">Готово</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">
            Приоритет задачи
          </label>
          <select
            id="task-priority"
            className="form-select"
            value={draft.priority}
            onChange={(e) => {
              const priority = e.target.value as TaskPriority
              if (priority === 'low' || priority === 'medium' || priority === 'high') {
                setDraft({ ...draft, priority })
              }
            }}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-tag" className="form-label">
            Категория / Тег
          </label>
          <input
            id="task-tag"
            className="form-input"
            value={draft.tag}
            placeholder="Лабораторная, Практика..."
            onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Описание задания {draft.status === 'done' && <span className="required-star">* (для готовой задачи)</span>}
        </label>
        <textarea
          id="task-description"
          className="form-textarea"
          rows={4}
          value={draft.description}
          placeholder="Опишите требования или результаты выполнения задачи..."
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary">
          Сохранить
        </button>
        <button type="button" onClick={props.onCancel} className="button button-outline">
          Отмена
        </button>
      </div>
    </form>
  )
}
