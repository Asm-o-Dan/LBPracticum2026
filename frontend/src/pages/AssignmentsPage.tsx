import { useState } from 'react'
import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import type { Assignment, AssignmentStatus } from '../types/assignment'

type AssignmentsPageProps = {
  assignments: Assignment[]
}

export function AssignmentsPage({ assignments }: AssignmentsPageProps) {
  const [status, setStatus] = useState<AssignmentStatus | 'all'>('all')

  const visibleAssignments = assignments.filter(
    (assignment) => status === 'all' || assignment.status === status
  )

  return (
    <section className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Учебные задания семестра</h1>
          <p className="page-subtitle">Актуальные лабораторные работы, практикумы и дедлайны</p>
        </div>
        <Link to="/assignments/new" className="button button-primary">
          + Добавить задание
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
          <option value="all">Все задания ({assignments.length})</option>
          <option value="todo">Запланировано</option>
          <option value="in_progress">В работе</option>
          <option value="done">Готово / Сдано</option>
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

      {assignments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Заданий пока нет.</p>
          <p className="empty-state-text">
            Список учебных работ пуст. Вы можете создать новое задание с помощью кнопки выше.
          </p>
        </div>
      ) : visibleAssignments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Нет заданий с выбранным статусом.</p>
          <p className="empty-state-text">
            Среди {assignments.length} имеющихся записей нет ни одной с текущим фильтром.
          </p>
          <button
            type="button"
            className="button button-outline"
            style={{ marginTop: '12px' }}
            onClick={() => setStatus('all')}
          >
            Показать все задания
          </button>
        </div>
      ) : (
        <div className="task-list">
          {visibleAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </section>
  )
}
