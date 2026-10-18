import type { Task } from '@/features/tasks/model/task'

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
    if (row.quality === null) continue
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
