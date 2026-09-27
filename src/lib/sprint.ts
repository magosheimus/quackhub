import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export type CarryoverDecision = 'next_sprint' | 'backlog'

export type CarryoverResult = {
  taskId: string
  sprintId: string | null
}

export function applyCarryover(
  tasks: Task[],
  decisions: Record<string, CarryoverDecision>,
  nextSprintId: string | null,
): CarryoverResult[] {
  return tasks
    .filter((task) => task.status !== 'done')
    .map((task) => {
      if (task.status === 'to_review') {
        return { taskId: task.id, sprintId: null }
      }
      const decision = decisions[task.id]
      return {
        taskId: task.id,
        sprintId: decision === 'next_sprint' ? nextSprintId : null,
      }
    })
}

export type ProjectCompletion = {
  project_id: string
  project_name: string
  total: number
  completed: number
  rate: number
}

export type SprintMetrics = {
  total_tasks: number
  completed_tasks: number
  completion_rate: number
  completion_by_project: ProjectCompletion[]
}

export function computeSprintMetrics(
  tasks: Task[],
  projectNameById: Map<string, string>,
): SprintMetrics {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'done').length
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100) / 100

  const byProject = new Map<string, { total: number; completed: number }>()
  for (const task of tasks) {
    const entry = byProject.get(task.project_id) ?? { total: 0, completed: 0 }
    entry.total += 1
    if (task.status === 'done') entry.completed += 1
    byProject.set(task.project_id, entry)
  }

  const completion_by_project: ProjectCompletion[] = Array.from(
    byProject.entries(),
  ).map(([project_id, stats]) => ({
    project_id,
    project_name: projectNameById.get(project_id) ?? '?',
    total: stats.total,
    completed: stats.completed,
    rate:
      stats.total === 0
        ? 0
        : Math.round((stats.completed / stats.total) * 100) / 100,
  }))

  return {
    total_tasks: total,
    completed_tasks: completed,
    completion_rate: rate,
    completion_by_project,
  }
}
