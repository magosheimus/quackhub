import { SegmentedProgress } from '@/components/brand/segmented-progress'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import type { HabitHighlights } from '@/features/dailyTracker/lib/dailyTracker'
import type { Habit } from '@/shared/types/entities'

type WeeklyStatsProps = {
  overallRate: number
  isSprint: boolean
  todayCount: string
  highlights: HabitHighlights
}

function HabitName({ habit }: { habit: Habit | null }) {
  if (!habit) {
    return (
      <span className="text-fg-muted">{DAILY_TRACKER_TEXTS.noHighlight}</span>
    )
  }
  return (
    <span className="flex min-w-0 items-center gap-2">
      <HabitIcon habit={habit} />
      <span className="truncate">{habit.name}</span>
    </span>
  )
}

export function WeeklyStats({
  overallRate,
  isSprint,
  todayCount,
  highlights,
}: WeeklyStatsProps) {
  const rows = [
    { label: DAILY_TRACKER_TEXTS.todayLabel, value: <span>{todayCount}</span> },
    {
      label: DAILY_TRACKER_TEXTS.mostConsistent,
      value: <HabitName habit={highlights.mostConsistent} />,
    },
    {
      label: DAILY_TRACKER_TEXTS.needsAttention,
      value: <HabitName habit={highlights.needsAttention} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-heading text-display text-fg">
            {overallRate}%
          </span>
          <span className="text-subtle">
            {DAILY_TRACKER_TEXTS.overallRate(isSprint)}
          </span>
        </div>
        <SegmentedProgress
          value={overallRate}
          segments={20}
          label={DAILY_TRACKER_TEXTS.overallProgress}
        />
      </div>

      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-t border-border py-2 text-sm"
          >
            <dt className="shrink-0 text-fg-muted">{row.label}</dt>
            <dd className="flex min-w-0 justify-end text-fg">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
