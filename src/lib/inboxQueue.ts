import type { Database } from '@/types/database.types'

type InboxItem = Database['public']['Tables']['inbox_items']['Row']

const QUEUE_KEY = 'quackhub-inbox-queue'

export function enqueue(item: InboxItem): void {
  const queue = getQueue()
  queue.push(item)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getQueue(): InboxItem[] {
  const raw = localStorage.getItem(QUEUE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
