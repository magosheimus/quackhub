import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { IconMinus, IconPlus } from '@/shared/lib/icons'
import type { Habit } from '@/shared/types/entities'

type CounterControlProps = {
  habit: Habit
  value: number
  onSetValue: (habit: Habit, value: number) => void
  onCommitValue: (habit: Habit, text: string) => void
}

export function CounterControl({
  habit,
  value,
  onSetValue,
  onCommitValue,
}: CounterControlProps) {
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
