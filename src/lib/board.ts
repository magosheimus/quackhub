import type { ProjectType } from '@/lib/project'
import type { Database } from '@/types/database.types'
import type { IconComponent } from '@/lib/icons'
import { IconArrowBigDown, IconArrowBigUp, IconChevronUp } from '@/lib/icons'

type Task = Database['public']['Tables']['tasks']['Row']

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
export const COLUMN_LABELS: Record<string, string> = {
  to_study: 'A ESTUDAR',
  todo: 'A FAZER',
  doing: 'FAZENDO',
  studying: 'ESTUDANDO',
  to_review: 'A REVISAR',
  blocked: 'IMPEDIDO',
  scheduled: 'AGENDADO',
  done: 'FINALIZADO',
}

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

export const STATUS_BADGE_CLASS: Record<string, string> = {
  to_study: 'bg-[var(--text-muted)]',
  todo: 'bg-[var(--signal-warning)]',
  scheduled: 'bg-[var(--text-muted)]',
  doing: 'bg-[var(--accent)]',
  studying: 'bg-[var(--accent)]',
  to_review: 'bg-[var(--accent)]',
  blocked: 'bg-[var(--signal-danger)]',
  done: 'bg-[var(--signal-success)]',
}

export function getColumnsForType(type: ProjectType | null): string[] {
  if (!type) return ALL_COLUMNS
  const columns: Record<ProjectType, string[]> = {
    general: COLUMNS_GENERAL,
    study: COLUMNS_STUDY,
  }
  return columns[type]
}

export type TaskStatus =
  | 'to_study'
  | 'studying'
  | 'scheduled'
  | 'to_review'
  | 'todo'
  | 'doing'
  | 'blocked'
  | 'done'

export type TaskPriority = 'alta' | 'média' | 'baixa'

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    icon: IconComponent
    ariaLabel: string
    text: string
    className: string
    colorVar: string
  }
> = {
  alta: {
    icon: IconArrowBigUp,
    ariaLabel: 'Prioridade alta',
    text: 'ALTA',
    className: 'text-[--signal-danger]',
    colorVar: '--signal-danger',
  },
  média: {
    icon: IconChevronUp,
    ariaLabel: 'Prioridade média',
    text: 'MÉDIA',
    className: 'text-[--text-muted]',
    colorVar: '--text-muted',
  },
  baixa: {
    icon: IconArrowBigDown,
    ariaLabel: 'Prioridade baixa',
    text: 'BAIXA',
    className: 'text-[--signal-success]',
    colorVar: '--signal-success',
  },
}

export function getInitialStatusForType(type: ProjectType): TaskStatus {
  return type === 'study' ? 'to_study' : 'todo'
}

export type BoardFilters = {
  flagged: boolean | null
  epicId: string | null
  priority: TaskPriority | null
  tag: string | null
  status: TaskStatus | null
  srsOverdue: boolean
  projectIds: string[]
}

export const DEFAULT_BOARD_FILTERS: BoardFilters = {
  flagged: null,
  epicId: null,
  priority: null,
  tag: null,
  status: null,
  srsOverdue: false,
  projectIds: [],
}

export function applyBoardFilters(
  tasks: Task[],
  filters: BoardFilters,
  taskTagsMap: Map<string, string[]>,
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
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.status && task.status !== filters.status) return false
    if (filters.tag) {
      const tags = taskTagsMap.get(task.id) ?? []
      if (!tags.includes(filters.tag)) return false
    }
    if (filters.srsOverdue) {
      if (!task.next_review || task.next_review > today) return false
    }
    return true
  })
}
