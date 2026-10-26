import { useNavigate } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { AssignmentDraft } from '../types/assignment'

type NewAssignmentPageProps = {
  onCreate: (draft: AssignmentDraft) => string
}

const emptyAssignment: AssignmentDraft = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
  priority: 'medium',
  course: '',
  tag: '',
}

export function NewAssignmentPage({ onCreate }: NewAssignmentPageProps) {
  const navigate = useNavigate()

  function handleSave(draft: AssignmentDraft) {
    const id = onCreate(draft)
    navigate(`/assignments/${id}`)
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Новое учебное задание</h1>
          <p className="page-subtitle">Добавьте новую лабораторную, практику или проект в список семестра</p>
        </div>
      </div>
      <AssignmentForm
        initialValues={emptyAssignment}
        onSave={handleSave}
        onCancel={() => navigate('/assignments')}
      />
    </section>
  )
}
