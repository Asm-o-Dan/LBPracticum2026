import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTags } from '../hooks/useTags'
import type { TaskDraft, TaskPriority, TaskStatus } from '../types/task'

type TaskFormProps = {
  initialValues: TaskDraft
  onSave: (draft: TaskDraft) => void
  onCancel: () => void
}

export function TaskForm(props: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => ({ ...props.initialValues }))
  const [error, setError] = useState('')

  const { load, retry } = useTags()
  const tags = load.status === 'success' ? load.data : []
  const selectedTagExists = tags.some((tag) => tag.id === draft.tag)
  const canSave = load.status === 'success' && selectedTagExists

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Шаг 9: Защита сохранения
    if (!canSave) {
      setError('Дождитесь справочника и выберите доступный тег.')
      return
    }

    const title = draft.title.trim()
    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }

    if (!draft.dueDate) {
      setError('Укажите срок сдачи задачи.')
      return
    }

    // Предметное правило (Шаг 6 ЛР 3):
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
          placeholder="Например: Лабораторная работа 4"
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
            Категория / Тег <span className="required-star">*</span>
          </label>
          <select
            id="task-tag"
            className="form-select"
            value={draft.tag}
            required
            disabled={load.status !== 'success' || tags.length === 0}
            onChange={(event) =>
              setDraft({
                ...draft,
                tag: event.target.value,
              })
            }
          >
            <option value="">Выберите тег</option>
            {draft.tag !== '' && !selectedTagExists && (
              <option value={draft.tag} disabled>
                Текущий код: {draft.tag} — выберите доступный тег
              </option>
            )}
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          {/* Шаг 8: Состояния загрузки, ошибки и пустого справочника */}
          {load.status === 'loading' && (
            <p className="tag-status-text" role="status">
              ⏳ Загружаем теги…
            </p>
          )}

          {load.status === 'error' && (
            <div className="tag-status-error">
              <p role="alert">⚠️ {load.message}</p>
              <button
                type="button"
                className="button button-small button-outline"
                onClick={retry}
              >
                🔄 Повторить
              </button>
            </div>
          )}

          {load.status === 'success' && tags.length === 0 && (
            <div className="tag-status-empty">
              <p role="status">Тегов пока нет. Сохранение недоступно.</p>
              <button
                type="button"
                className="button button-small button-outline"
                onClick={retry}
              >
                🔄 Повторить
              </button>
            </div>
          )}

          {load.status === 'success' &&
            tags.length > 0 &&
            draft.tag !== '' &&
            !selectedTagExists && (
              <p className="tag-status-warn" role="alert">
                Текущий тег «{draft.tag}» отсутствует в справочнике. Пожалуйста, выберите доступный вариант.
              </p>
            )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Описание задания{' '}
          {draft.status === 'done' && (
            <span className="required-star">* (для готовой задачи)</span>
          )}
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
        <button
          type="submit"
          className="button button-primary"
          disabled={!canSave}
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={props.onCancel}
          className="button button-outline"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
