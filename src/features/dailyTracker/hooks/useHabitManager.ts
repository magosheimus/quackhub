import { useState } from 'react'
import { useArchiveHabit } from '@/features/dailyTracker/hooks/useHabitMutations'
import {
  DAILY_TRACKER_TEXTS,
  HABIT_TYPE_LABELS,
} from '@/features/dailyTracker/constants/texts'
import {
  ALL_WEEKDAYS,
  formatDuration,
} from '@/features/dailyTracker/lib/dailyTracker'
import type { Habit } from '@/shared/types/entities'
import { useReorderList } from '@/shared/hooks/useReorderList'
import { queryKeys } from '@/shared/query/queryKeys'

export type HabitManagerRow = {
  habit: Habit
  typeLabel: string
  goalLabel: string
  weekdays: number[]
  durationLabel: string
}

function toManagerRow(habit: Habit): HabitManagerRow {
  return {
    habit,
    typeLabel: HABIT_TYPE_LABELS[habit.type],
    goalLabel:
      habit.goal !== null
        ? String(habit.goal)
        : DAILY_TRACKER_TEXTS.goalDisabled,
    weekdays: habit.weekdays ?? [...ALL_WEEKDAYS],
    durationLabel: habit.duration_minutes
      ? formatDuration(habit.duration_minutes)
      : DAILY_TRACKER_TEXTS.goalDisabled,
  }
}

export function useHabitManager(habits: Habit[]) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const { mutate: archiveHabit } = useArchiveHabit()
  const { handleDragEnd } = useReorderList({
    table: 'habits',
    items: habits,
    queryKey: queryKeys.dailyTracker.habits,
    invalidateKey: queryKeys.dailyTracker.root,
  })

  return {
    rows: habits.map(toManagerRow),
    handleDragEnd,
    editingHabit,
    startEditing: setEditingHabit,
    stopEditing: () => setEditingHabit(null),
    deletingHabit,
    startDeleting: setDeletingHabit,
    stopDeleting: () => setDeletingHabit(null),
    confirmDelete: () => {
      if (deletingHabit) {
        archiveHabit(deletingHabit.id)
      }
    },
  }
}
