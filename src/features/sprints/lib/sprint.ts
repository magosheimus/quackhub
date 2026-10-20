import {
  DEFAULT_DATE_FORMAT,
  formatDayMonth,
  type DateFormat,
} from '@/shared/lib/date'
import type { Sprint } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'

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
    const entry = byProject.get(task.projectId) ?? { total: 0, completed: 0 }
    entry.total += 1
    if (task.status === 'done') entry.completed += 1
    byProject.set(task.projectId, entry)
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

export function getClosedSprintsByRecency(sprints: Sprint[]): Sprint[] {
  return sprints
    .filter((sprint) => sprint.status === 'closed')
    .sort((a, b) => (b.end_date ?? '').localeCompare(a.end_date ?? ''))
}

export function getCompletionPercent(sprint: Sprint): number {
  return Math.round((sprint.completion_rate ?? 0) * 100)
}

// "Sprint 8 — meta (05/10 - 11/10)"
export function formatSprintBanner(
  sprint: Sprint,
  format: DateFormat = DEFAULT_DATE_FORMAT,
): string {
  const goal = sprint.goal ? ` — ${sprint.goal}` : ''
  const period = `${formatDayMonth(sprint.start_date, format)} - ${formatDayMonth(sprint.end_date, format)}`
  return `${sprint.name}${goal} (${period})`
}

export type DueCandidates = {
  inPeriod: Task[]
  overdue: Task[]
}

function byDue(a: Task, b: Task): number {
  return (
    (a.due?.date ?? '').localeCompare(b.due?.date ?? '') ||
    (a.due?.time ?? '99').localeCompare(b.due?.time ?? '99')
  )
}

// Cards do Backlog (sem sprint, não finalizados) com prazo no período da sprint
// nova; os já vencidos antes do início vêm à parte
export function findDueCandidates(
  tasks: Task[],
  startDate: string,
  endDate: string,
): DueCandidates {
  const open = tasks.filter(
    (task) => task.sprintId === null && task.status !== 'done' && task.due,
  )
  return {
    inPeriod: open
      .filter((task) => {
        const due = task.due?.date ?? ''
        return due >= startDate && due <= endDate
      })
      .sort(byDue),
    overdue: open
      .filter((task) => (task.due?.date ?? '') < startDate)
      .sort(byDue),
  }
}

export function isDueWithinSprint(
  dueDate: string | null,
  sprint: Pick<Sprint, 'start_date' | 'end_date'>,
): boolean {
  if (!dueDate || !sprint.start_date || !sprint.end_date) {
    return false
  }
  return dueDate >= sprint.start_date && dueDate <= sprint.end_date
}
