import { MOOD_ICONS } from '@/features/dailyTracker/components/moodIcons'
import type { MoodDay } from '@/features/dailyTracker/hooks/useDailyTrackerPage'

type MoodHistoryProps = {
  label: string
  days: MoodDay[]
}

export function MoodHistory({ label, days }: MoodHistoryProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-sm text-fg">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => {
          const Icon = day.level ? MOOD_ICONS[day.level] : null
          return (
            <span
              key={day.date}
              title={day.label}
              aria-label={day.label}
              role="img"
              className="flex size-6 items-center justify-center text-accent"
            >
              {Icon ? (
                <Icon size={20} aria-hidden="true" />
              ) : (
                <span className="text-fg-muted">·</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
