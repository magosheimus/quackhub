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
}

export type ProjectTaskGroup = {
  project: Project
  tasks: Task[]
}

export function filterBacklogTasks(
  tasks: Task[],
  filters: BacklogFilters,
): Task[] {
  return tasks.filter(
    (task) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.epicId || task.epic_id === filters.epicId),
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
