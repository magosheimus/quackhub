import { IconCalendar } from '@/shared/lib/icons'
import { todayLocal } from '@/shared/lib/date'
import { formatDue, type DueTone } from '@/features/tasks/lib/due'
import { DUE_LABELS, TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { cn } from '@/shared/lib/utils'

const TONE_CLASS: Record<DueTone, string> = {
  overdue: 'text-danger',
  today: 'text-accent',
  upcoming: 'text-fg',
}

type DueBadgeProps = {
  dueDate: string | null
  dueTime: string | null
}

export function DueBadge({ dueDate, dueTime }: DueBadgeProps) {
  if (!dueDate) {
    return null
  }
  const due = formatDue(dueDate, dueTime, todayLocal(), DUE_LABELS)

  return (
    <span
      title={TASKS_TEXTS.dueLabel(due.text)}
      className={cn(
        'flex w-fit items-center gap-1 text-xs',
        TONE_CLASS[due.tone],
      )}
    >
      <IconCalendar size={12} aria-hidden="true" />
      {due.text}
    </span>
  )
}
