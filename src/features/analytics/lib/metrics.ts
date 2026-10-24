import type { Task } from '@/features/tasks/model/task'
import type { ProjectType } from '@/shared/types/entities'
import { ALL_COLUMNS, getColumnsForType } from '@/features/board/lib/board'

export function startOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  date.setDate(date.getDate() - dayOfWeek)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type QualityLog = {
  session_date: string
  quality: number | null
}

export type AccuracyOverTimeItem = {
  week: string
  averageQuality: number
}

export function groupQualityByWeek(rows: QualityLog[]): AccuracyOverTimeItem[] {
  const buckets = new Map<string, { sum: number; count: number }>()

  for (const row of rows) {
    if (row.quality === null) {
      continue
    }
    const week = startOfWeek(row.session_date)
    const bucket = buckets.get(week) ?? { sum: 0, count: 0 }
    bucket.sum += row.quality
    bucket.count += 1
    buckets.set(week, bucket)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, { sum, count }]) => ({
      week,
      averageQuality: sum / count,
    }))
}

// Escopo da tela de Analytics: sprint atual, uma sprint encerrada (id) ou tudo
export const CURRENT_SCOPE = 'current'
export const ALL_SCOPE = 'all'

const MAX_QUALITY = 5

export function resolveLiveSprintId(
  scope: string,
  activeSprintId: string | null,
): string | null {
  if (scope === CURRENT_SCOPE) {
    return activeSprintId
  }
  if (scope === ALL_SCOPE) {
    return null
  }
  return scope
}

export function getAccuracyPercent(weeks: AccuracyOverTimeItem[]): number {
  if (weeks.length === 0) {
    return 0
  }
  const total = weeks.reduce((sum, week) => sum + week.averageQuality, 0)
  return Math.round((total / weeks.length / MAX_QUALITY) * 100)
}

export function toAccuracyChartData(weeks: AccuracyOverTimeItem[]) {
  return weeks.map((week) => ({
    week: week.week,
    quality: Number(week.averageQuality.toFixed(2)),
  }))
}

export function sumCounts(items: { count: number }[]): number {
  return items.reduce((sum, item) => sum + item.count, 0)
}

export function countTasksByStatus(
  tasks: Task[],
  statuses: string[],
): { status: string; count: number }[] {
  return statuses.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }))
}

export function getRelevantStatuses(
  tasks: Pick<Task, 'projectId' | 'status'>[],
  projectTypeById: Map<string, ProjectType>,
): string[] {
  const relevant = new Set<string>()
  for (const task of tasks) {
    const type = projectTypeById.get(task.projectId)
    if (type) {
      getColumnsForType(type).forEach((status) => relevant.add(status))
    }
    relevant.add(task.status)
  }
  return ALL_COLUMNS.filter((status) => relevant.has(status))
}

export function hasStudyContent(
  tasks: Pick<Task, 'projectId'>[],
  projectTypeById: Map<string, ProjectType>,
  totalReviews: number,
  isAllScope: boolean,
): boolean {
  if (totalReviews > 0) {
    return true
  }
  if (isAllScope) {
    return [...projectTypeById.values()].includes('study')
  }
  return tasks.some((task) => projectTypeById.get(task.projectId) === 'study')
}

export type StatusShare = { status: string; count: number; percent: number }

export function toStatusShares(
  counts: { status: string; count: number }[],
): StatusShare[] {
  const total = counts.reduce((sum, item) => sum + item.count, 0)
  return counts.map((item) => ({
    ...item,
    percent: total > 0 ? (item.count / total) * 100 : 0,
  }))
}

export type AssigneeCompletion = {
  assigneeId: string | null
  completed: number
  total: number
}

export function completionByAssignee(
  tasks: Pick<Task, 'assigneeId' | 'status'>[],
): AssigneeCompletion[] {
  const byAssignee = new Map<string | null, AssigneeCompletion>()
  for (const task of tasks) {
    const item = byAssignee.get(task.assigneeId) ?? {
      assigneeId: task.assigneeId,
      completed: 0,
      total: 0,
    }
    item.total += 1
    if (task.status === 'done') {
      item.completed += 1
    }
    byAssignee.set(task.assigneeId, item)
  }
  return [...byAssignee.values()].sort((a, b) => {
    if (a.assigneeId === null) {
      return 1
    }
    if (b.assigneeId === null) {
      return -1
    }
    return b.total - a.total
  })
}
