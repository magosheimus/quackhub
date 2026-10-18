import { todayLocal, toDbDate } from '@/shared/lib/date'
import type { NewTask, Task, TaskRecurrence } from '@/features/tasks/model/task'
import type { RecurrenceType } from '@/shared/types/entities'

// Estado do formulário de recorrência: campos soltos, editáveis um a um
export type RecurrenceValue = {
  type: RecurrenceType | null
  interval: number | null
  dayOfMonth: number | null
  endDate: string | null
}

export const EMPTY_RECURRENCE_VALUE: RecurrenceValue = {
  type: null,
  interval: null,
  dayOfMonth: null,
  endDate: null,
}

export function toRecurrenceValue(
  recurrence: TaskRecurrence | null,
): RecurrenceValue {
  if (!recurrence) {
    return EMPTY_RECURRENCE_VALUE
  }
  return {
    type: recurrence.type,
    interval: recurrence.interval,
    dayOfMonth: recurrence.type === 'monthly' ? recurrence.dayOfMonth : null,
    endDate: recurrence.endDate,
  }
}

export function fromRecurrenceValue(
  value: RecurrenceValue,
): TaskRecurrence | null {
  if (!value.type) {
    return null
  }
  const interval = value.interval ?? 1
  if (value.type === 'monthly') {
    return {
      type: 'monthly',
      interval,
      dayOfMonth: value.dayOfMonth,
      endDate: value.endDate,
    }
  }
  return { type: value.type, interval, endDate: value.endDate }
}

function parseDate(dateStr: string): {
  year: number
  month: number
  day: number
} {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month: month - 1, day }
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function calculateNextDueDate(task: Task): Date | null {
  const { recurrence } = task
  if (!recurrence) return null

  const base = parseDate(task.due?.date ?? todayLocal())
  const { interval } = recurrence

  let next: Date
  switch (recurrence.type) {
    case 'daily':
      next = new Date(base.year, base.month, base.day + interval)
      break
    case 'weekly':
      next = new Date(base.year, base.month, base.day + interval * 7)
      break
    case 'monthly': {
      const targetMonth = base.month + interval
      const day = recurrence.dayOfMonth ?? base.day
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

  if (recurrence.endDate) {
    const end = parseDate(recurrence.endDate)
    const endDate = new Date(end.year, end.month, end.day)
    if (next > endDate) return null
  }

  return next
}

export function buildRecurrentCard(original: Task, nextDue: Date): NewTask {
  return {
    projectId: original.projectId,
    epicId: original.epicId,
    title: original.title,
    description: original.description,
    priority: original.priority,
    status: 'todo',
    due: { date: toDbDate(nextDue), time: original.due?.time ?? null },
    assigneeId: original.assigneeId,
    recurrence: original.recurrence,
    recurrenceParentId: original.id,
    origin: 'recurrence',
    sprintId: null,
    flag: null,
  }
}
