import type { Epic, Task } from '@/shared/types/entities'
import { createEnumGuard } from '@/shared/lib/enums'

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

export const PROJECT_VIEWS = ['progress', 'epics'] as const
export type ProjectView = (typeof PROJECT_VIEWS)[number]
export const isProjectView = createEnumGuard(PROJECT_VIEWS)

export const NO_EPIC_COLUMN = 'no-epic'

export type EpicColumn = {
  id: string
  epic: Epic | null
  tasks: Task[]
  doneCount: number
  totalCount: number
}

export function groupOpenTasksByEpic(
  tasks: Task[],
  epics: Epic[],
  activeSprintId: string | null,
): EpicColumn[] {
  const epicIds = new Set(epics.map((epic) => epic.id))
  const columnIdOf = (task: Task) =>
    task.epic_id && epicIds.has(task.epic_id) ? task.epic_id : NO_EPIC_COLUMN
  const isInSprint = (task: Task) =>
    getProjectBucket(task, activeSprintId) === 'sprint'

  const columns = [
    ...epics.map((epic) => ({ id: epic.id, epic })),
    { id: NO_EPIC_COLUMN, epic: null },
  ]
  return columns
    .map(({ id, epic }) => {
      const columnTasks = tasks.filter((task) => columnIdOf(task) === id)
      const open = columnTasks.filter((task) => task.status !== 'done')
      return {
        id,
        epic,
        tasks: [
          ...open.filter(isInSprint),
          ...open.filter((task) => !isInSprint(task)),
        ],
        doneCount: columnTasks.length - open.length,
        totalCount: columnTasks.length,
      }
    })
    .filter((column) => column.epic !== null || column.tasks.length > 0)
}

export function getEpicIdForColumn(columnId: string): string | null {
  return columnId === NO_EPIC_COLUMN ? null : columnId
}
