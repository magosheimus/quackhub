import { daysBetween } from '@/shared/lib/date'
import { sortByPriorityThenDate } from '@/features/tasks/lib/taskPriority'
import type { Task } from '@/features/tasks/model/task'

export function countOverdue(
  tasks: Pick<Task, 'due'>[],
  today: string,
): number {
  return tasks.filter(
    (task) => task.due !== null && daysBetween(task.due.date, today) > 0,
  ).length
}

// Prazo mais antigo primeiro; no mesmo dia, pelo horário (sem horário por
// último) e depois pela prioridade
export function sortByDueThenPriority(tasks: Task[]): Task[] {
  return sortByPriorityThenDate(tasks).sort(
    (a, b) =>
      (a.due?.date ?? '').localeCompare(b.due?.date ?? '') ||
      (a.due?.time ?? '99').localeCompare(b.due?.time ?? '99'),
  )
}
