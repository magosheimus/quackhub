import type { DraftsItem } from '@/shared/types/entities'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

const QUEUE_KEY = STORAGE_KEYS.draftsQueue

export function enqueue(item: DraftsItem): void {
  const queue = getQueue()
  queue.push(item)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getQueue(): DraftsItem[] {
  const raw = localStorage.getItem(QUEUE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
