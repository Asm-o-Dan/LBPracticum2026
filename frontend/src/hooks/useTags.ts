import { useEffect, useState } from 'react'
import type { Tag } from '../types/tag'
import { getTags } from '../services/tags'

type TagsLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Tag[] }

export function useTags() {
  const [load, setLoad] = useState<TagsLoad>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    getTags(controller.signal)
      .then((data) => {
        if (active) setLoad({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить справочник.'
        setLoad({ status: 'error', message })
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  return { load, retry }
}
