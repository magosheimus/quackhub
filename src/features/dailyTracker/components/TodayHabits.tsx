import { Button } from '@/components/ui/button'
import { EmptyMessage } from '@/components/ui/empty-message'
import { Input } from '@/components/ui/input'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import type { TodayHabitItem } from '@/features/dailyTracker/hooks/useDailyTrackerPage'
import { IconCheck, IconMinus, IconPlus } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'
import type { Habit } from '@/shared/types/entities'

type TodayHabitsProps = {
  hasHabits: boolean
  pending: TodayHabitItem[]
  done: TodayHabitItem[]
  onSetValue: (habit: Habit, value: number) => void
  onCommitValue: (habit: Habit, text: string) => void
  onToggle: (habit: Habit) => void
  onCreateHabit: () => void
}

function CounterControl({
  item,
  onSetValue,
  onCommitValue,
}: {
  item: TodayHabitItem
  onSetValue: (habit: Habit, value: number) => void
  onCommitValue: (habit: Habit, text: string) => void
}) {
  const { habit, value } = item
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={DAILY_TRACKER_TEXTS.decrease(habit.name)}
        onClick={() => onSetValue(habit, value - 1)}
        disabled={value === 0}
      >
        <IconMinus size={12} aria-hidden="true" />
      </Button>
      <Input
        key={value}
        type="text"
        inputMode="numeric"
        defaultValue={value}
        aria-label={DAILY_TRACKER_TEXTS.counterValue(habit.name)}
        onBlur={(e) => onCommitValue(habit, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
        className="h-7 w-16 text-center"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={DAILY_TRACKER_TEXTS.increase(habit.name)}
        onClick={() => onSetValue(habit, value + 1)}
      >
        <IconPlus size={12} aria-hidden="true" />
      </Button>
    </div>
  )
}

export function TodayHabits({
  hasHabits,
  pending,
  done,
  onSetValue,
  onCommitValue,
  onToggle,
  onCreateHabit,
}: TodayHabitsProps) {
  if (pending.length === 0 && done.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <EmptyMessage>
          {hasHabits
            ? DAILY_TRACKER_TEXTS.noHabitsToday
            : DAILY_TRACKER_TEXTS.noHabits}
        </EmptyMessage>
        {!hasHabits && (
          <Button type="button" size="sm" onClick={onCreateHabit}>
            <IconPlus size={12} aria-hidden="true" />
            {DAILY_TRACKER_TEXTS.createFirstHabit}
          </Button>
        )}
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {[...pending, ...done].map((item) => {
        const isDone = item.isMet
        return (
          <li
            key={item.habit.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0"
          >
            <div
              className={cn(
                'flex min-w-0 items-center gap-2.5',
                isDone && 'opacity-60',
              )}
            >
              <HabitIcon habit={item.habit} size={18} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={cn(
                    'truncate text-sm',
                    isDone ? 'text-fg-muted line-through' : 'text-fg',
                  )}
                >
                  {item.habit.name}
                </span>
                {item.meta && <span className="text-caption">{item.meta}</span>}
              </div>
            </div>
            {item.habit.type === 'counter' ? (
              <CounterControl
                item={item}
                onSetValue={onSetValue}
                onCommitValue={onCommitValue}
              />
            ) : isDone ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onToggle(item.habit)}
                className="text-fg-muted"
              >
                <IconCheck size={12} aria-hidden="true" />
                {DAILY_TRACKER_TEXTS.doneToday} · {DAILY_TRACKER_TEXTS.undo}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggle(item.habit)}
              >
                {DAILY_TRACKER_TEXTS.markDone}
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
