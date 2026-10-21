import {
  DEFAULT_DATE_FORMAT,
  formatDayMonth,
  toDbDate,
  type DateFormat,
} from '@/shared/lib/date'
import type { Task } from '@/features/tasks/model/task'
import type { DoneEvent } from '@/features/analytics/api/analytics'

export type BurnupPoint = {
  date: string
  label: string
  done: number | null
  ideal: number
}

export function lastDoneDateByTask(events: DoneEvent[]): Map<string, string> {
  const byTask = new Map<string, string>()
  for (const event of events) {
    const current = byTask.get(event.taskId)
    if (!current || event.doneAt > current) {
      byTask.set(event.taskId, event.doneAt)
    }
  }
  return new Map(
    [...byTask].map(([taskId, doneAt]) => [taskId, toDbDate(new Date(doneAt))]),
  )
}

type BurnupInput = {
  days: string[]
  dateFormat?: DateFormat
  tasks: Pick<Task, 'id' | 'status'>[]
  doneDateByTask: Map<string, string>
  today: string
}

export function buildBurnup({
  days,
  tasks,
  doneDateByTask,
  today,
  dateFormat = DEFAULT_DATE_FORMAT,
}: BurnupInput): BurnupPoint[] {
  if (days.length === 0) {
    return []
  }
  const firstDay = days[0]
  const doneDates = tasks
    .filter((task) => task.status === 'done')
    .map((task) => doneDateByTask.get(task.id) ?? firstDay)
  const total = tasks.length
  const lastIndex = Math.max(days.length - 1, 1)

  return days.map((date, index) => ({
    date,
    label: formatDayMonth(date, dateFormat),
    done:
      date > today
        ? null
        : doneDates.filter((doneDate) => doneDate <= date).length,
    ideal: Math.round(((total * index) / lastIndex) * 10) / 10,
  }))
}
