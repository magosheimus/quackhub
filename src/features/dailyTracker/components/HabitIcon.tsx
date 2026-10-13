import { HABIT_ICONS } from '@/features/dailyTracker/components/habitIcons'
import { getHabitIconKey } from '@/features/dailyTracker/lib/habitAppearance'
import type { Habit } from '@/shared/types/entities'

type HabitIconProps = {
  habit: Pick<Habit, 'icon'>
  size?: number
}

export function HabitIcon({ habit, size = 14 }: HabitIconProps) {
  const Icon = HABIT_ICONS[getHabitIconKey(habit)]
  return (
    <Icon size={size} aria-hidden="true" className="shrink-0 text-fg-muted" />
  )
}
