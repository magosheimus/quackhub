import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib/utils'
import type {
  DayWindowNav,
  HeatCell,
  HeatDay,
  HeatRow,
} from '@/features/dailyTracker/hooks/useDailyTrackerPage'
import type { HeatTone } from '@/features/dailyTracker/lib/dailyTracker'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { Button } from '@/components/ui/button'
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from '@/shared/lib/icons'

type HabitHeatmapProps = {
  days: HeatDay[]
  rows: HeatRow[]
  dayWindow: DayWindowNav
}

const CELL = 'flex size-7 items-center justify-center rounded-sm text-xs'

const TONE_CLASS: Record<HeatTone, string> = {
  empty: 'border-(--border-card-empty) bg-card-empty',
  'partial-1': 'border-accent dither-25',
  'partial-2': 'border-accent dither-50',
  'partial-3': 'border-accent dither-75',
  'done-1':
    'hue-jitter border-(--jitter-accent)/50 bg-(--jitter-accent)/30 text-fg',
  'done-2':
    'hue-jitter border-(--jitter-accent)/70 bg-(--jitter-accent)/50 text-fg',
  'done-3':
    'hue-jitter border-(--jitter-accent) bg-(--jitter-accent)/75 text-on-accent',
  'done-4':
    'hue-jitter border-(--jitter-accent) bg-(--jitter-accent) text-on-accent',
}

function hueShiftStyle(cell: HeatCell): CSSProperties {
  return { '--hue-shift': cell.hueShift } as CSSProperties
}

const DONE_SCALE: HeatTone[] = ['done-1', 'done-2', 'done-3', 'done-4']

const MISSED_CLASS = 'border-border hatch'

const BEFORE_START_CLASS = 'border-(--border-card-empty) stripes'

function Cell({ cell }: { cell: HeatCell }) {
  if (cell.isBeforeStart) {
    return (
      <span
        role="img"
        aria-label={cell.label}
        title={cell.label}
        className={cn(CELL, 'border', BEFORE_START_CLASS)}
      />
    )
  }

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
      style={hueShiftStyle(cell)}
      className={cn(
        CELL,
        'border',
        cell.isFuture
          ? 'border-dashed border-(--border-card-empty)'
          : cell.isMissed
            ? MISSED_CLASS
            : TONE_CLASS[cell.tone],
      )}
    >
      {cell.isMet && <IconCheck size={12} aria-hidden="true" />}
    </span>
  )
}

function WindowNav({ dayWindow }: { dayWindow: DayWindowNav }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={dayWindow.goBack}
        disabled={!dayWindow.canGoBack}
        aria-label={DAILY_TRACKER_TEXTS.previousDays}
        title={DAILY_TRACKER_TEXTS.previousDays}
      >
        <IconChevronLeft size={14} aria-hidden="true" />
      </Button>
      <span className="text-caption">{dayWindow.rangeLabel}</span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={dayWindow.goForward}
        disabled={!dayWindow.canGoForward}
        aria-label={DAILY_TRACKER_TEXTS.nextDays}
        title={DAILY_TRACKER_TEXTS.nextDays}
      >
        <IconChevronRight size={14} aria-hidden="true" />
      </Button>
    </div>
  )
}

function Legend() {
  const items = [
    {
      label: DAILY_TRACKER_TEXTS.legendEmpty,
      className: TONE_CLASS.empty,
    },
    {
      label: DAILY_TRACKER_TEXTS.legendMissed,
      className: MISSED_CLASS,
    },
    {
      label: DAILY_TRACKER_TEXTS.legendPartial,
      className: TONE_CLASS['partial-2'],
    },
    {
      label: DAILY_TRACKER_TEXTS.legendBeforeStart,
      className: BEFORE_START_CLASS,
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
        <span className="flex gap-0.5">
          {DONE_SCALE.map((tone) => (
            <span
              key={tone}
              className={cn('size-3 rounded-sm border', TONE_CLASS[tone])}
            />
          ))}
        </span>
        {DAILY_TRACKER_TEXTS.legendDone}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-3 text-center">·</span>
        {DAILY_TRACKER_TEXTS.legendOff}
      </span>
    </div>
  )
}

export function HabitHeatmap({ days, rows, dayWindow }: HabitHeatmapProps) {
  return (
    <div className="flex flex-col gap-3">
      {dayWindow.isWindowed && <WindowNav dayWindow={dayWindow} />}
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
            {rows.map(({ habit, cells, daysCompleted, totalDays }) => (
              <tr key={habit.id}>
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
