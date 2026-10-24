import type { TagsByTask } from '@/features/tasks/lib/taskTags'
import {
  createEnumGuard,
  isTaskPriority,
  isTaskStatus,
} from '@/shared/lib/enums'
import type { Project, TaskPriority, TaskStatus } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { toImportance, type Importance } from '@/features/tasks/lib/importance'

export type BacklogFilters = {
  status: TaskStatus | null
  priority: TaskPriority | null
  epicId: string | null
  tag: string | null
  assigneeId: string | null
  minImportance: Importance | null
}

// Filtros na URL do Backlog: sobrevivem a abrir um card e voltar, e a recarregar
export const BACKLOG_SORTS = ['manual', 'importance'] as const

export type BacklogSort = (typeof BACKLOG_SORTS)[number]

export const isBacklogSort = createEnumGuard(BACKLOG_SORTS)

export type BacklogUrlFilters = BacklogFilters & {
  projectId: string | null
  sort: BacklogSort
}

export const EMPTY_BACKLOG_FILTERS: BacklogUrlFilters = {
  projectId: null,
  status: null,
  priority: null,
  epicId: null,
  tag: null,
  assigneeId: null,
  minImportance: null,
  sort: 'manual',
}

const BACKLOG_PARAMS = {
  projectId: 'project',
  status: 'status',
  priority: 'priority',
  epicId: 'epic',
  tag: 'tag',
  assigneeId: 'assignee',
  minImportance: 'importance',
  sort: 'sort',
} as const satisfies Record<keyof BacklogUrlFilters, string>

export function readBacklogFilters(params: URLSearchParams): BacklogUrlFilters {
  const status = params.get(BACKLOG_PARAMS.status)
  const priority = params.get(BACKLOG_PARAMS.priority)
  const sort = params.get(BACKLOG_PARAMS.sort)
  return {
    projectId: params.get(BACKLOG_PARAMS.projectId) || null,
    status: isTaskStatus(status) ? status : null,
    priority: isTaskPriority(priority) ? priority : null,
    epicId: params.get(BACKLOG_PARAMS.epicId) || null,
    tag: params.get(BACKLOG_PARAMS.tag) || null,
    assigneeId: params.get(BACKLOG_PARAMS.assigneeId) || null,
    minImportance: toImportance(
      Number(params.get(BACKLOG_PARAMS.minImportance)),
    ),
    sort: isBacklogSort(sort) ? sort : EMPTY_BACKLOG_FILTERS.sort,
  }
}

export function writeBacklogFilters(
  params: URLSearchParams,
  filters: BacklogUrlFilters,
): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const key of Object.keys(
    BACKLOG_PARAMS,
  ) as (keyof BacklogUrlFilters)[]) {
    const value = filters[key]
    if (value && value !== EMPTY_BACKLOG_FILTERS[key]) {
      next.set(BACKLOG_PARAMS[key], String(value))
    } else {
      next.delete(BACKLOG_PARAMS[key])
    }
  }
  return next
}

export function hasActiveFilters(filters: BacklogFilters): boolean {
  return Boolean(
    filters.status ||
    filters.priority ||
    filters.epicId ||
    filters.tag ||
    filters.assigneeId ||
    filters.minImportance,
  )
}

export type ProjectTaskGroup = {
  project: Project
  tasks: Task[]
}

export function filterBacklogTasks(
  tasks: Task[],
  filters: BacklogFilters,
  tagsByTask: TagsByTask,
): Task[] {
  return tasks.filter(
    (task) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.epicId || task.epicId === filters.epicId) &&
      (!filters.assigneeId || task.assigneeId === filters.assigneeId) &&
      (!filters.minImportance ||
        (task.importance ?? 0) >= filters.minImportance) &&
      (!filters.tag || (tagsByTask[task.id] ?? []).includes(filters.tag)),
  )
}

// Mantém a ordem dos projetos e omite os que não têm tarefas
export function groupTasksByProject(
  projects: Project[],
  tasks: Task[],
): ProjectTaskGroup[] {
  return projects
    .map((project) => ({
      project,
      tasks: tasks.filter((task) => task.projectId === project.id),
    }))
    .filter((group) => group.tasks.length > 0)
}
