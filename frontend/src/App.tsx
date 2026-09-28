import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { tasks as initialTasks } from './data/tasks'
import { EditTaskPage } from './pages/EditTaskPage'
import { NewTaskPage } from './pages/NewTaskPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TaskDetailsPage } from './pages/TaskDetailsPage'
import { TasksPage } from './pages/TasksPage'
import type { Task, TaskDraft } from './types/task'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    initialTasks.map((task) => ({ ...task }))
  )

  function createTask(draft: TaskDraft): string {
    const id = crypto.randomUUID()
    setTasks((current) => [...current, { ...draft, id }])
    return id
  }

  function updateTask(id: string, draft: TaskDraft): void {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...draft, id: task.id } : task
      )
    )
  }

  function deleteTask(id: string): void {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TasksPage tasks={tasks} />} />
        <Route
          path="tasks/new"
          element={<NewTaskPage onCreate={createTask} />}
        />
        <Route
          path="tasks/:id"
          element={<TaskDetailsPage tasks={tasks} onDelete={deleteTask} />}
        />
        <Route
          path="tasks/:id/edit"
          element={<EditTaskPage tasks={tasks} onUpdate={updateTask} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
