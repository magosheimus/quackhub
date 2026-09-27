import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export function detectRecurrencePattern(cards: Task[]): boolean {
  const months = new Set(
    cards
      .map((card) => card.created_at?.slice(0, 7))
      .filter((month): month is string => Boolean(month)),
  )
  return months.size >= 2
}
