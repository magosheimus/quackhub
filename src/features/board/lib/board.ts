import type { TagsByTask } from '@/features/tasks/lib/taskTags'
import { createEnumGuard } from '@/shared/lib/enums'
import type {
  Epic,
  Project,
  ProjectType,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/entities'

export const COLUMNS_GENERAL = ['todo', 'blocked', 'doing', 'done']
export const COLUMNS_STUDY = [
  'to_study',
  'blocked',
  'studying',
  'to_review',
  'done',
]
export const ALL_COLUMNS = [
  'to_study',
  'todo',
  'studying',
  'doing',
  'to_review',
  'blocked',
  'done',
]
export type BoardColumnKey = 'todo' | 'doing' | 'to_review' | 'blocked' | 'done'

export const BOARD_COLUMNS: BoardColumnKey[] = [
  'todo',
  'doing',
  'to_review',
  'blocked',
  'done',
]

const COLUMN_BY_STATUS: Record<string, BoardColumnKey> = {
  to_study: 'todo',
  todo: 'todo',
  studying: 'doing',
  doing: 'doing',
  to_review: 'to_review',
  blocked: 'blocked',
  done: 'done',
}

const STATUS_BY_COLUMN: Record<
  BoardColumnKey,
  Record<ProjectType, TaskStatus | null>
> = {
  todo: { study: 'to_study', general: 'todo' },
  doing: { study: 'studying', general: 'doing' },
  to_review: { study: 'to_review', general: null },
  blocked: { study: 'blocked', general: 'blocked' },
  done: { study: 'done', general: 'done' },
}

const BOARD_COLUMN_LABELS: Record<
  BoardColumnKey,
  { study: string; general: string }
> = {
  todo: { study: 'A ESTUDAR', general: 'A FAZER' },
  doing: { study: 'ESTUDANDO', general: 'FAZENDO' },
  to_review: { study: 'A REVISAR', general: 'A REVISAR' },
  blocked: { study: 'IMPEDIDO', general: 'IMPEDIDO' },
  done: { study: 'FINALIZADO', general: 'FINALIZADO' },
}

export function getBoardColumnKey(status: string): BoardColumnKey | undefined {
  return COLUMN_BY_STATUS[status]
}

export function getBoardColumnLabel(
  column: BoardColumnKey,
  scopeType: ProjectType | null,
): string {
  return BOARD_COLUMN_LABELS[column][
    scopeType === 'study' ? 'study' : 'general'
  ]
}

export function getStatusForColumn(
  column: BoardColumnKey,
  taskType: ProjectType,
): TaskStatus | null {
  return STATUS_BY_COLUMN[column][taskType]
}

export function getColumnsForType(type: ProjectType | null): string[] {
  if (!type) return ALL_COLUMNS
  const columns: Record<ProjectType, string[]> = {
    general: COLUMNS_GENERAL,
    study: COLUMNS_STUDY,
  }
  return columns[type]
}

export type BoardFilters = {
  flagged: boolean | null
  epicId: string | null
  priority: TaskPriority | null
  tag: string | null
  status: TaskStatus | null
  srsOverdue: boolean
  projectIds: string[]
  assigneeIds: string[]
}

export const DEFAULT_BOARD_FILTERS: BoardFilters = {
  flagged: null,
  epicId: null,
  priority: null,
  tag: null,
  status: null,
  srsOverdue: false,
  projectIds: [],
  assigneeIds: [],
}

export function applyBoardFilters(
  tasks: Task[],
  filters: BoardFilters,
  tagsByTask: TagsByTask,
  today: string,
): Task[] {
  return tasks.filter((task) => {
    if (filters.flagged !== null && task.flagged !== filters.flagged)
      return false
    if (filters.epicId && task.epic_id !== filters.epicId) return false
    if (
      filters.projectIds.length > 0 &&
      !filters.projectIds.includes(task.project_id)
    )
      return false
    if (
      filters.assigneeIds.length > 0 &&
      !(task.assignee_id && filters.assigneeIds.includes(task.assignee_id))
    )
      return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.status && task.status !== filters.status) return false
    if (filters.tag) {
      const tags = tagsByTask[task.id] ?? []
      if (!tags.includes(filters.tag)) return false
    }
    if (filters.srsOverdue) {
      if (!task.next_review || task.next_review > today) return false
    }
    return true
  })
}

export const isBoardColumnKey = createEnumGuard(BOARD_COLUMNS)

// Rótulos de estudo só quando todos os projetos filtrados são de estudo
export function getLabelScope(
  filteredProjectIds: string[],
  projectTypeById: Map<string, ProjectType>,
): ProjectType | null {
  const types = filteredProjectIds.map((id) => projectTypeById.get(id))
  return types.length > 0 && types.every((type) => type === 'study')
    ? 'study'
    : null
}

export function getProjectsInTasks(
  projects: Project[],
  tasks: Task[],
): Project[] {
  const projectIds = new Set(tasks.map((task) => task.project_id))
  return projects.filter((project) => projectIds.has(project.id))
}

export function getEpicsInTasks(epics: Epic[], tasks: Task[]): Epic[] {
  const epicIds = new Set(tasks.map((task) => task.epic_id))
  return epics.filter((epic) => epicIds.has(epic.id))
}

export function groupTasksByColumn(
  tasks: Task[],
): Record<BoardColumnKey, Task[]> {
  const groups: Record<BoardColumnKey, Task[]> = {
    todo: [],
    doing: [],
    to_review: [],
    blocked: [],
    done: [],
  }
  for (const task of tasks) {
    const column = getBoardColumnKey(task.status)
    if (column) {
      groups[column].push(task)
    }
  }
  for (const column of BOARD_COLUMNS) {
    groups[column] = flaggedFirst(groups[column])
  }
  return groups
}

// Urgentes no topo da coluna, mantendo a ordem original dentro de cada grupo
function flaggedFirst(tasks: Task[]): Task[] {
  return [
    ...tasks.filter((task) => task.flagged),
    ...tasks.filter((task) => !task.flagged),
  ]
}

// Soltar um card na primeira posição de uma coluna marca como urgente.
// Em Finalizado não: card concluído não precisa de atenção
export function shouldFlagOnDrop(
  task: Pick<Task, 'flagged'>,
  column: BoardColumnKey,
  index: number,
): boolean {
  return index === 0 && column !== 'done' && !task.flagged
}

export type MoveOption<T extends string = BoardColumnKey> = {
  column: T
  label: string
}

export function getMoveOptions(
  status: TaskStatus,
  taskType: ProjectType,
): MoveOption[] {
  const currentColumn = getBoardColumnKey(status)
  return BOARD_COLUMNS.filter(
    (column) =>
      column !== currentColumn && getStatusForColumn(column, taskType) !== null,
  ).map((column) => ({
    column,
    label: getBoardColumnLabel(column, taskType),
  }))
}
