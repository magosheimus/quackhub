import { daysBetween } from '@/shared/lib/date'
import { sortByPriorityThenDate } from '@/features/tasks/lib/taskPriority'
import type { Task } from '@/shared/types/entities'

export function countOverdue(
  tasks: Pick<Task, 'due_date'>[],
  today: string,
): number {
  return tasks.filter(
    (task) => task.due_date !== null && daysBetween(task.due_date, today) > 0,
  ).length
}

// Prazo mais antigo primeiro; no mesmo dia, pelo horário (sem horário por
// último) e depois pela prioridade
export function sortByDueThenPriority(tasks: Task[]): Task[] {
  return sortByPriorityThenDate(tasks).sort(
    (a, b) =>
      (a.due_date ?? '').localeCompare(b.due_date ?? '') ||
      (a.due_time ?? '99').localeCompare(b.due_time ?? '99'),
  )
}
