import type { Task } from '../types/task'

/**
 * Экспорт текущего списка задач в JSON-файл (скачивание через браузер)
 */
export function exportTasksToJson(tasks: Task[]): void {
  const dataStr = JSON.stringify(tasks, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `studyflow-tasks-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Чтение и валидация задач из загруженного пользователем JSON-файла
 */
export async function importTasksFromJson(file: File): Promise<Task[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!Array.isArray(data)) {
    throw new Error('Файл должен содержать массив задач.')
  }

  for (const item of data) {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Элемент списка имеет неверный формат.')
    }
    if (
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.status !== 'string'
    ) {
      throw new Error('Файл содержит задачи с неполными или некорректными полями.')
    }
  }

  return data as Task[]
}
