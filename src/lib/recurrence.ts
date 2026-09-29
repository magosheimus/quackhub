import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type NewTask = Database['public']['Tables']['tasks']['Insert']

function parseDate(dateStr: string): {
  year: number
  month: number
  day: number
} {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month: month - 1, day }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function todayLocal(): string {
  return formatDate(new Date())
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function calculateNextDueDate(task: Task): Date | null {
  if (!task.recurrence_type) return null

  const base = parseDate(task.due_date ?? todayLocal())
  const interval = task.recurrence_interval ?? 1

  let next: Date
  switch (task.recurrence_type) {
    case 'daily':
      next = new Date(base.year, base.month, base.day + interval)
      break
    case 'weekly':
      next = new Date(base.year, base.month, base.day + interval * 7)
      break
    case 'monthly': {
      const targetMonth = base.month + interval
      const day = task.recurrence_day_of_month ?? base.day
      const daysInTarget = lastDayOfMonth(base.year, targetMonth)
      next = new Date(base.year, targetMonth, Math.min(day, daysInTarget))
      break
    }
    case 'yearly': {
      const targetYear = base.year + interval
      const daysInTarget = lastDayOfMonth(targetYear, base.month)
      next = new Date(targetYear, base.month, Math.min(base.day, daysInTarget))
      break
    }
    default:
      return null
  }

  if (task.recurrence_end_date) {
    const end = parseDate(task.recurrence_end_date)
    const endDate = new Date(end.year, end.month, end.day)
    if (next > endDate) return null
  }

  return next
}

export function buildRecurrentCard(original: Task, nextDue: Date): NewTask {
  return {
    project_id: original.project_id,
    epic_id: original.epic_id,
    title: original.title,
    description: original.description,
    priority: original.priority,
    status: 'todo',
    due_date: formatDate(nextDue),
    recurrence_type: original.recurrence_type,
    recurrence_interval: original.recurrence_interval,
    recurrence_day_of_month: original.recurrence_day_of_month,
    recurrence_end_date: original.recurrence_end_date,
    recurrence_parent_id: original.id,
    origem: 'recurrence',
    sprint_id: null,
    flagged: false,
  }
}
