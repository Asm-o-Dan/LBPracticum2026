import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTags } from '../hooks/useTags'
import type { AssignmentDraft, AssignmentPriority, AssignmentStatus } from '../types/assignment'

type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

export function AssignmentForm(props: AssignmentFormProps) {
  const [draft, setDraft] = useState<AssignmentDraft>(() => ({ ...props.initialValues }))
  const [error, setError] = useState('')

  const { load, retry } = useTags()
  const tags = load.status === 'success' ? load.data : []
  const selectedTagExists = tags.some((tag) => tag.id === draft.tag)
  const canSave = load.status === 'success' && selectedTagExists

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSave) {
      setError('Дождитесь справочника и выберите доступный тег.')
      return
    }

    const title = draft.title.trim()
    if (title.length < 3 || title.length > 100) {
      setError('Название задания должно содержать от 3 до 100 символов.')
      return
    }

    if (!draft.dueDate) {
      setError('Укажите срок сдачи задания.')
      return
    }

    if (draft.status === 'done' && !draft.description.trim()) {
      setError('Завершённое задание должно иметь непустое описание результата.')
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
        <label htmlFor="assignment-title" className="form-label">
          Название задания <span className="required-star">*</span>
        </label>
        <input
          id="assignment-title"
          className="form-input"
          value={draft.title}
          required
          placeholder="Например: Лабораторная работа 5"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignment-course" className="form-label">
            Учебная дисциплина
          </label>
          <input
            id="assignment-course"
            className="form-input"
            value={draft.course}
            placeholder="Например: Веб-разработка"
            onChange={(e) => setDraft({ ...draft, course: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignment-date" className="form-label">
            Крайний срок (дедлайн) <span className="required-star">*</span>
          </label>
          <input
            id="assignment-date"
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
          <label htmlFor="assignment-status" className="form-label">
            Статус выполнения
          </label>
          <select
            id="assignment-status"
            className="form-select"
            value={draft.status}
            onChange={(e) => {
              const status = e.target.value as AssignmentStatus
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
          <label htmlFor="assignment-priority" className="form-label">
            Приоритет
          </label>
          <select
            id="assignment-priority"
            className="form-select"
            value={draft.priority}
            onChange={(e) => {
              const priority = e.target.value as AssignmentPriority
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
          <label htmlFor="assignment-tag" className="form-label">
            Категория / Тег <span className="required-star">*</span>
          </label>
          <select
            id="assignment-tag"
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

          {/* Кнопка обновления справочника из Supabase после успеха */}
          {load.status === 'success' && tags.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="button button-small button-outline"
                onClick={retry}
              >
                🔄 Обновить справочник
              </button>
            </div>
          )}

          {/* Состояния загрузки, ошибки и пустого справочника */}
          {load.status === 'loading' && (
            <p className="tag-status-text" role="status">
              ⏳ Загружаем теги из базы данных…
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
        <label htmlFor="assignment-description" className="form-label">
          Описание задания{' '}
          {draft.status === 'done' && (
            <span className="required-star">* (для готовой работы)</span>
          )}
        </label>
        <textarea
          id="assignment-description"
          className="form-textarea"
          rows={4}
          value={draft.description}
          placeholder="Опишите требования или результаты выполнения задания..."
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={!canSave}
        >
          Сохранить задание
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
