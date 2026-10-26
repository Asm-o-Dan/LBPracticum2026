import { Link, useNavigate, useParams } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { Assignment, AssignmentDraft } from '../types/assignment'

type EditAssignmentPageProps = {
  assignments: Assignment[]
  onUpdate: (id: string, draft: AssignmentDraft) => void
}

export function EditAssignmentPage({ assignments, onUpdate }: EditAssignmentPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  if (!assignment) {
    return (
      <section className="details-card not-found-card">
        <h1 className="page-title">Задание не найдено</h1>
        <p className="details-description">
          Запись с идентификатором <code>{id ?? '—'}</code> отсутствует в списке.
        </p>
        <Link to="/assignments" className="button button-outline">
          ← К списку заданий
        </Link>
      </section>
    )
  }

  const initialValues: AssignmentDraft = {
    title: assignment.title,
    description: assignment.description,
    status: assignment.status,
    dueDate: assignment.dueDate,
    priority: assignment.priority,
    course: assignment.course,
    tag: assignment.tag,
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Редактирование задания</h1>
          <p className="page-subtitle">Внесите изменения в поля работы (ID: <code>{assignment.id}</code>)</p>
        </div>
      </div>
      <AssignmentForm
        key={assignment.id}
        initialValues={initialValues}
        onSave={(draft) => {
          onUpdate(assignment.id, draft)
          navigate(`/assignments/${assignment.id}`)
        }}
        onCancel={() => navigate(`/assignments/${assignment.id}`)}
      />
    </section>
  )
}
