import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib/utils'
import type {
  HeatCell,
  HeatDay,
  HeatRow,
} from '@/features/dailyTracker/hooks/useDailyTrackerPage'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { IconCheck } from '@/shared/lib/icons'

type HabitHeatmapProps = {
  days: HeatDay[]
  rows: HeatRow[]
}

const CELL = 'flex size-7 items-center justify-center rounded-sm text-xs'

function heatStyle(cell: HeatCell): CSSProperties | undefined {
  if (cell.intensity === 0 || cell.isMet) {
    return undefined
  }
  const strength = Math.round(25 + cell.intensity * 55)
  return {
    backgroundColor: `color-mix(in oklch, var(--habit) ${strength}%, transparent)`,
  }
}

function habitRowStyle(color: string): CSSProperties {
  return { '--habit': color } as CSSProperties
}

function Cell({ cell }: { cell: HeatCell }) {
  if (!cell.isScheduled) {
    return (
      <span
        role="img"
        aria-label={cell.label}
        className={cn(CELL, 'text-fg-muted')}
      >
        ·
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label={cell.label}
      title={cell.label}
      style={heatStyle(cell)}
      className={cn(
        CELL,
        'border',
        cell.isFuture
          ? 'border-dashed border-(--border-card-empty)'
          : cell.isMet
            ? 'border-(--habit) bg-(--habit) text-on-accent'
            : cell.intensity > 0
              ? 'border-(--habit) text-fg'
              : 'border-(--border-card-empty) bg-card-empty',
      )}
    >
      {cell.isMet && <IconCheck size={12} aria-hidden="true" />}
    </span>
  )
}

function Legend() {
  const items = [
    {
      label: DAILY_TRACKER_TEXTS.legendEmpty,
      className: 'border-(--border-card-empty) bg-card-empty',
    },
    {
      label: DAILY_TRACKER_TEXTS.legendPartial,
      className: 'border-fg-muted bg-fg-muted/40',
    },
    {
      label: DAILY_TRACKER_TEXTS.legendDone,
      className: 'border-fg-muted bg-fg-muted',
    },
  ]
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-fg-muted">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={cn('size-3 rounded-sm border', item.className)} />
          {item.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="w-3 text-center">·</span>
        {DAILY_TRACKER_TEXTS.legendOff}
      </span>
    </div>
  )
}

export function HabitHeatmap({ days, rows }: HabitHeatmapProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th />
              {days.map((day) => (
                <th
                  key={day.date}
                  scope="col"
                  className={cn(
                    'min-w-7 text-xs font-normal',
                    day.isToday ? 'text-accent' : 'text-fg-muted',
                  )}
                >
                  <div>{day.weekday}</div>
                  <div>{day.dayNumber}</div>
                </th>
              ))}
              <th
                scope="col"
                className="pl-3 text-left text-xs font-normal text-fg-muted"
              >
                {DAILY_TRACKER_TEXTS.doneColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ habit, color, cells, daysCompleted, totalDays }) => (
              <tr key={habit.id} style={habitRowStyle(color)}>
                <th
                  scope="row"
                  className="pr-3 text-left text-sm font-normal whitespace-nowrap text-fg"
                >
                  <span className="flex max-w-44 items-center gap-2">
                    <HabitIcon habit={habit} />
                    <span className="truncate">{habit.name}</span>
                  </span>
                </th>
                {cells.map((cell) => (
                  <td key={cell.date} className="text-center">
                    <Cell cell={cell} />
                  </td>
                ))}
                <td className="pl-3 text-xs whitespace-nowrap text-fg-muted">
                  {DAILY_TRACKER_TEXTS.habitStats(daysCompleted, totalDays)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Legend />
    </div>
  )
}
