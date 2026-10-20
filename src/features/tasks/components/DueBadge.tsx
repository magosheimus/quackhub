import { IconCalendar } from '@/shared/lib/icons'
import { todayLocal } from '@/shared/lib/date'
import { formatDue, type DueTone } from '@/features/tasks/lib/due'
import { DUE_LABELS, TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { cn } from '@/shared/lib/utils'
import type { TaskDue } from '@/features/tasks/model/task'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

const TONE_CLASS: Record<DueTone, string> = {
  overdue: 'text-danger',
  today: 'text-accent',
  upcoming: 'text-fg',
}

type DueBadgeProps = {
  due: TaskDue | null
}

export function DueBadge({ due: taskDue }: DueBadgeProps) {
  const { dateFormat } = useDatePreferences()
  if (!taskDue) {
    return null
  }
  const due = formatDue(
    taskDue.date,
    taskDue.time,
    todayLocal(),
    DUE_LABELS,
    dateFormat,
  )

  return (
    <span
      title={TASKS_TEXTS.dueLabel(due.text)}
      className={cn('flex w-fit items-center gap-1', TONE_CLASS[due.tone])}
    >
      <IconCalendar size={14} aria-hidden="true" />
      {due.text}
    </span>
  )
}
