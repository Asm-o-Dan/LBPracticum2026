export type AssignmentStatus = 'todo' | 'in_progress' | 'done'

export type AssignmentPriority = 'low' | 'medium' | 'high'

export type Assignment = {
  id: string
  title: string
  description: string
  status: AssignmentStatus
  dueDate: string
  priority: AssignmentPriority
  course: string
  tag: string
}

export type AssignmentDraft = Omit<Assignment, 'id'>
