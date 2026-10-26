import { supabase } from '../lib/supabase'
import type { Tag } from '../types/tag'

function isTag(value: unknown): value is Tag {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    value.id === value.id.trim() &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  )
}

export function parseTags(value: unknown): Tag[] {
  if (!Array.isArray(value) || !value.every(isTag)) {
    throw new Error('Неверная структура справочника тегов.')
  }
  const tags: Tag[] = value
  const ids = new Set(tags.map((tag) => tag.id))
  if (ids.size !== tags.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }
  return tags
}

export async function getTags(signal: AbortSignal): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .order('name')
    .abortSignal(signal)

  if (signal.aborted) {
    throw new DOMException('Запрос отменён', 'AbortError')
  }

  if (error) {
    throw new Error(`Не удалось загрузить теги: ${error.message}`)
  }

  return parseTags(data)
}
