import type { TagsByTask } from '@/features/tasks/lib/taskTags'
import { isTaskPriority, isTaskStatus } from '@/shared/lib/enums'
import type {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/entities'

export type BacklogFilters = {
  status: TaskStatus | null
  priority: TaskPriority | null
  epicId: string | null
  tag: string | null
  assigneeId: string | null
}

// Filtros na URL do Backlog: sobrevivem a abrir um card e voltar, e a recarregar
export type BacklogUrlFilters = BacklogFilters & { projectId: string | null }

export const EMPTY_BACKLOG_FILTERS: BacklogUrlFilters = {
  projectId: null,
  status: null,
  priority: null,
  epicId: null,
  tag: null,
  assigneeId: null,
}

const BACKLOG_PARAMS = {
  projectId: 'project',
  status: 'status',
  priority: 'priority',
  epicId: 'epic',
  tag: 'tag',
  assigneeId: 'assignee',
} as const satisfies Record<keyof BacklogUrlFilters, string>

export function readBacklogFilters(params: URLSearchParams): BacklogUrlFilters {
  const status = params.get(BACKLOG_PARAMS.status)
  const priority = params.get(BACKLOG_PARAMS.priority)
  return {
    projectId: params.get(BACKLOG_PARAMS.projectId) || null,
    status: isTaskStatus(status) ? status : null,
    priority: isTaskPriority(priority) ? priority : null,
    epicId: params.get(BACKLOG_PARAMS.epicId) || null,
    tag: params.get(BACKLOG_PARAMS.tag) || null,
    assigneeId: params.get(BACKLOG_PARAMS.assigneeId) || null,
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
    if (value) {
      next.set(BACKLOG_PARAMS[key], value)
    } else {
      next.delete(BACKLOG_PARAMS[key])
    }
  }
  return next
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
      (!filters.epicId || task.epic_id === filters.epicId) &&
      (!filters.assigneeId || task.assignee_id === filters.assigneeId) &&
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
      tasks: tasks.filter((task) => task.project_id === project.id),
    }))
    .filter((group) => group.tasks.length > 0)
}
