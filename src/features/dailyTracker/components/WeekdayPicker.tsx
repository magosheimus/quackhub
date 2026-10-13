import { cn } from '@/shared/lib/utils'
import {
  WEEKDAY_INITIALS,
  WEEKDAY_NAMES,
} from '@/features/dailyTracker/constants/texts'

type WeekdayPickerProps = {
  order: number[]
  selected: number[]
  onToggle?: (weekday: number) => void
  label: string
}

export function WeekdayPicker({
  order,
  selected,
  onToggle,
  label,
}: WeekdayPickerProps) {
  return (
    <div className="flex gap-1" role="group" aria-label={label}>
      {order.map((weekday) => {
        const isSelected = selected.includes(weekday)
        const className = cn(
          'flex items-center justify-center rounded-sm border text-xs',
          isSelected
            ? 'border-accent bg-accent text-on-accent'
            : 'border-(--border-card-empty) bg-card-empty text-fg-muted',
        )
        if (!onToggle) {
          return (
            <span
              key={weekday}
              title={WEEKDAY_NAMES[weekday]}
              className={cn(className, 'size-6')}
            >
              {WEEKDAY_INITIALS[weekday]}
            </span>
          )
        }
        return (
          <button
            key={weekday}
            type="button"
            aria-pressed={isSelected}
            aria-label={WEEKDAY_NAMES[weekday]}
            title={WEEKDAY_NAMES[weekday]}
            onClick={() => onToggle(weekday)}
            className={cn(className, 'h-8 min-w-6 flex-1 hover:border-accent')}
          >
            {WEEKDAY_INITIALS[weekday]}
          </button>
        )
      })}
    </div>
  )
}
