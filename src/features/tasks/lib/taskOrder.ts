import type { Task } from '@/features/tasks/model/task'

export function compareTaskOrder(a: Task, b: Task): number {
  return (
    a.position - b.position ||
    (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
  )
}

export function sortByImportance(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
}

export function applyTaskOrder(tasks: Task[], orderedIds: string[]): Task[] {
  const positionById = new Map(orderedIds.map((id, index) => [id, index]))
  return tasks
    .map((task) => {
      const position = positionById.get(task.id)
      return position === undefined ? task : { ...task, position }
    })
    .sort(compareTaskOrder)
}
