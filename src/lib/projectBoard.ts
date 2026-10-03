import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export type ProjectBucket = 'sprint' | 'done' | 'backlog'

export function getProjectBucket(
  task: Task,
  activeSprintId: string | null,
): ProjectBucket {
  if (activeSprintId !== null && task.sprint_id === activeSprintId) {
    return 'sprint'
  }
  if (task.status === 'done') {
    return 'done'
  }
  return 'backlog'
}

export function sortByStatusOrder(
  tasks: Task[],
  statusOrder: string[],
): Task[] {
  const rank = (status: string) => {
    const index = statusOrder.indexOf(status)
    return index === -1 ? statusOrder.length : index
  }
  return [...tasks].sort((a, b) => rank(a.status) - rank(b.status))
}
