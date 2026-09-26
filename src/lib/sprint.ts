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
        // RN-SP03 — to_review sempre volta ao Backlog, nunca carrega
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
  project: { id: string; name: string },
): SprintMetrics {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'done').length
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100) / 100

  return {
    total_tasks: total,
    completed_tasks: completed,
    completion_rate: rate,
    completion_by_project: [
      {
        project_id: project.id,
        project_name: project.name,
        total,
        completed,
        rate,
      },
    ],
  }
}
