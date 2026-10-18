import type { Task } from '@/features/tasks/model/task'

export function detectRecurrencePattern(cards: Task[]): boolean {
  const months = new Set(
    cards
      .map((card) => card.createdAt?.slice(0, 7))
      .filter((month): month is string => Boolean(month)),
  )
  return months.size >= 2
}
