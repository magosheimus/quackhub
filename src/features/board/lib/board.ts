import type { TagsByTask } from '@/features/tasks/lib/taskTags'
import { compareTaskOrder } from '@/features/tasks/lib/taskOrder'
import {
  createEnumGuard,
  isTaskPriority,
  isTaskStatus,
} from '@/shared/lib/enums'
import type {
  Epic,
  Project,
  ProjectType,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'

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
  if (!type) {
    return ALL_COLUMNS
  }
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

export function hasActiveBoardFilters(filters: BoardFilters): boolean {
  return Boolean(
    filters.flagged !== null ||
    filters.epicId ||
    filters.priority ||
    filters.tag ||
    filters.status ||
    filters.srsOverdue ||
    filters.projectIds.length > 0 ||
    filters.assigneeIds.length > 0,
  )
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

// Itens dos filtros rápidos que o usuário escondeu (preferência da conta)
export type QuickFilterKind = 'epic' | 'project' | 'persona'

export type QuickFilterMenuGroup = {
  kind: QuickFilterKind
  label: string
  items: { id: string; name: string; isVisible: boolean }[]
}

export function quickFilterKey(kind: QuickFilterKind, id: string): string {
  return `${kind}:${id}`
}

export function withoutHidden<T extends { id: string }>(
  items: T[],
  kind: QuickFilterKind,
  hidden: readonly string[],
): T[] {
  return items.filter((item) => !hidden.includes(quickFilterKey(kind, item.id)))
}

// Esconder um item que está ativo também tira ele do filtro
export function clearHiddenFilter(
  filters: BoardFilters,
  kind: QuickFilterKind,
  id: string,
): BoardFilters {
  if (kind === 'epic') {
    return filters.epicId === id ? { ...filters, epicId: null } : filters
  }
  const key = kind === 'project' ? 'projectIds' : 'assigneeIds'
  return { ...filters, [key]: filters[key].filter((item) => item !== id) }
}

// Filtros na URL do Board: sobrevivem a abrir um card e voltar, e a recarregar
const FILTER_PARAMS = {
  epicId: 'epic',
  projectIds: 'projects',
  assigneeIds: 'assignees',
  priority: 'priority',
  status: 'status',
  tag: 'tag',
  flagged: 'flagged',
  srsOverdue: 'srs',
} as const satisfies Record<keyof BoardFilters, string>

function readList(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : []
}

export function readBoardFilters(params: URLSearchParams): BoardFilters {
  const priority = params.get(FILTER_PARAMS.priority)
  const status = params.get(FILTER_PARAMS.status)
  const flagged = params.get(FILTER_PARAMS.flagged)
  return {
    epicId: params.get(FILTER_PARAMS.epicId),
    projectIds: readList(params.get(FILTER_PARAMS.projectIds)),
    assigneeIds: readList(params.get(FILTER_PARAMS.assigneeIds)),
    priority: isTaskPriority(priority) ? priority : null,
    status: isTaskStatus(status) ? status : null,
    tag: params.get(FILTER_PARAMS.tag),
    flagged: flagged === 'true' ? true : flagged === 'false' ? false : null,
    srsOverdue: params.get(FILTER_PARAMS.srsOverdue) === 'true',
  }
}

// Mantém os outros parâmetros (ex.: ?project=) e omite filtros vazios
export function writeBoardFilters(
  params: URLSearchParams,
  filters: BoardFilters,
): URLSearchParams {
  const next = new URLSearchParams(params)
  const values: Record<keyof BoardFilters, string | null> = {
    epicId: filters.epicId,
    projectIds: filters.projectIds.join(',') || null,
    assigneeIds: filters.assigneeIds.join(',') || null,
    priority: filters.priority,
    status: filters.status,
    tag: filters.tag,
    flagged: filters.flagged === null ? null : String(filters.flagged),
    srsOverdue: filters.srsOverdue ? 'true' : null,
  }
  for (const key of Object.keys(FILTER_PARAMS) as (keyof BoardFilters)[]) {
    const value = values[key]
    if (value) {
      next.set(FILTER_PARAMS[key], value)
    } else {
      next.delete(FILTER_PARAMS[key])
    }
  }
  return next
}

export function applyBoardFilters(
  tasks: Task[],
  filters: BoardFilters,
  tagsByTask: TagsByTask,
  today: string,
): Task[] {
  return tasks.filter((task) => {
    if (filters.flagged !== null && (task.flag !== null) !== filters.flagged) {
      return false
    }
    if (filters.epicId && task.epicId !== filters.epicId) {
      return false
    }
    if (
      filters.projectIds.length > 0 &&
      !filters.projectIds.includes(task.projectId)
    ) {
      return false
    }
    if (
      filters.assigneeIds.length > 0 &&
      !(task.assigneeId && filters.assigneeIds.includes(task.assigneeId))
    ) {
      return false
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false
    }
    if (filters.status && task.status !== filters.status) {
      return false
    }
    if (filters.tag) {
      const tags = tagsByTask[task.id] ?? []
      if (!tags.includes(filters.tag)) {
        return false
      }
    }
    if (filters.srsOverdue) {
      const nextReview = task.srs?.nextReview
      if (!nextReview || nextReview > today) {
        return false
      }
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
  const projectIds = new Set(tasks.map((task) => task.projectId))
  return projects.filter((project) => projectIds.has(project.id))
}

export function getEpicsInTasks(epics: Epic[], tasks: Task[]): Epic[] {
  const epicIds = new Set(tasks.map((task) => task.epicId))
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
    groups[column] = flaggedFirst(groups[column].sort(compareTaskOrder))
  }
  return groups
}

export function getVisibleBoardColumns(
  tasks: Task[],
  projectTypeById: Map<string, ProjectType>,
): BoardColumnKey[] {
  const hasStudyTask = tasks.some(
    (task) => projectTypeById.get(task.projectId) === 'study',
  )
  const hasReviewTask = tasks.some(
    (task) => getBoardColumnKey(task.status) === 'to_review',
  )
  return hasStudyTask || hasReviewTask
    ? BOARD_COLUMNS
    : BOARD_COLUMNS.filter((column) => column !== 'to_review')
}

// Urgentes no topo da coluna, mantendo a ordem original dentro de cada grupo
function flaggedFirst(tasks: Task[]): Task[] {
  return [
    ...tasks.filter((task) => task.flag !== null),
    ...tasks.filter((task) => task.flag === null),
  ]
}

const URGENT_ZONE_PREFIX = 'urgent:'

export function toUrgentZoneId(column: BoardColumnKey): string {
  return `${URGENT_ZONE_PREFIX}${column}`
}

export type DropTarget = {
  column: BoardColumnKey
  isUrgentZone: boolean
}

export function parseDropTarget(droppableId: string): DropTarget | null {
  const isUrgentZone = droppableId.startsWith(URGENT_ZONE_PREFIX)
  const column = isUrgentZone
    ? droppableId.slice(URGENT_ZONE_PREFIX.length)
    : droppableId
  return isBoardColumnKey(column) ? { column, isUrgentZone } : null
}

export function canFlagInColumn(
  task: Pick<Task, 'flag'>,
  column: BoardColumnKey,
): boolean {
  return column !== 'done' && task.flag === null
}

export function getColumnOrderAfterDrop(
  columnTasks: Task[],
  movedTaskId: string,
  index: number,
): string[] {
  const ids = columnTasks
    .map((task) => task.id)
    .filter((id) => id !== movedTaskId)
  ids.splice(index, 0, movedTaskId)
  return ids
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
