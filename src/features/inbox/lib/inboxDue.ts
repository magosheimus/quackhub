import { daysBetween } from '@/shared/lib/date'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { sortByPriorityThenDate } from '@/features/tasks/lib/taskPriority'
import type { Task } from '@/shared/types/entities'

export type DueLabel = {
  text: string
  isOverdue: boolean
}

export function describeDue(
  dueDate: string | null,
  today: string,
): DueLabel | null {
  if (!dueDate) {
    return null
  }
  const daysLate = daysBetween(dueDate, today)
  if (daysLate <= 0) {
    return { text: INBOX_TEXTS.dueToday, isOverdue: false }
  }
  return {
    text: INBOX_TEXTS.dueOverdue(COMMON_TEXTS.dayCount(daysLate)),
    isOverdue: true,
  }
}

export function countOverdue(
  tasks: Pick<Task, 'due_date'>[],
  today: string,
): number {
  return tasks.filter((task) => describeDue(task.due_date, today)?.isOverdue)
    .length
}

// Prazo mais antigo primeiro; no mesmo dia, pela prioridade
export function sortByDueThenPriority(tasks: Task[]): Task[] {
  return sortByPriorityThenDate(tasks).sort((a, b) =>
    (a.due_date ?? '').localeCompare(b.due_date ?? ''),
  )
}
