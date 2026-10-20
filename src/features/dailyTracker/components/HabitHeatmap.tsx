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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CounterControl } from '@/features/dailyTracker/components/CounterControl'
import type { Habit } from '@/shared/types/entities'

type HabitHeatmapProps = {
  days: HeatDay[]
  rows: HeatRow[]
  dayWindow: DayWindowNav
  actions: HeatCellActions
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

export type HeatCellActions = {
  onToggle: (habit: Habit, date: string) => void
  onSetValue: (habit: Habit, date: string, value: number) => void
  onCommitValue: (habit: Habit, date: string, text: string) => void
}

const EDITABLE_CLASS =
  'cursor-pointer outline-none hover:ring-1 hover:ring-accent focus-visible:ring-2 focus-visible:ring-accent'

function cellToneClass(cell: HeatCell): string {
  if (cell.isFuture) {
    return 'border-dashed border-(--border-card-empty)'
  }
  if (cell.isMissed) {
    return MISSED_CLASS
  }
  return TONE_CLASS[cell.tone]
}

function Cell({
  habit,
  cell,
  actions,
}: {
  habit: Habit
  cell: HeatCell
  actions: HeatCellActions
}) {
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

  const className = cn(CELL, 'border', cellToneClass(cell))
  const content = cell.isMet && (
    <IconCheck size={12} aria-hidden="true" className="icon-flat" />
  )

  if (!cell.isEditable) {
    return (
      <span
        role="img"
        aria-label={cell.label}
        title={cell.label}
        style={hueShiftStyle(cell)}
        className={className}
      >
        {content}
      </span>
    )
  }

  if (habit.type === 'counter') {
    return (
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={cell.label}
              title={cell.label}
              style={hueShiftStyle(cell)}
              className={cn(className, EDITABLE_CLASS)}
            />
          }
        >
          {content}
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <CounterControl
            habit={habit}
            value={cell.value}
            onSetValue={(target, value) =>
              actions.onSetValue(target, cell.date, value)
            }
            onCommitValue={(target, text) =>
              actions.onCommitValue(target, cell.date, text)
            }
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <button
      type="button"
      aria-label={cell.label}
      aria-pressed={cell.isMet}
      title={cell.label}
      style={hueShiftStyle(cell)}
      onClick={() => actions.onToggle(habit, cell.date)}
      className={cn(className, EDITABLE_CLASS)}
    >
      {content}
    </button>
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
    <div className="flex flex-wrap items-center gap-4 text-caption">
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

export function HabitHeatmap({
  days,
  rows,
  dayWindow,
  actions,
}: HabitHeatmapProps) {
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
                    'min-w-7 text-micro font-normal',
                    day.isToday && 'text-accent',
                  )}
                >
                  <div>{day.weekday}</div>
                  <div>{day.dayNumber}</div>
                </th>
              ))}
              <th scope="col" className="pl-3 text-left text-micro font-normal">
                {DAILY_TRACKER_TEXTS.doneColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ habit, cells, daysCompleted, totalDays }) => (
              <tr key={habit.id}>
                <th
                  scope="row"
                  className="pr-3 text-left text-body-strong whitespace-nowrap"
                >
                  <span className="flex max-w-44 items-center gap-2">
                    <HabitIcon habit={habit} />
                    <span className="truncate">{habit.name}</span>
                  </span>
                </th>
                {cells.map((cell) => (
                  <td key={cell.date} className="text-center">
                    <Cell habit={habit} cell={cell} actions={actions} />
                  </td>
                ))}
                <td className="pl-3 whitespace-nowrap text-micro">
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
