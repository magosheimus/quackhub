import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  archiveHabit,
  createHabit,
  updateHabit,
} from '@/features/dailyTracker/api/dailyTracker'
import { invalidateDailyTrackerQueries } from '@/shared/query/queryInvalidation'
import type { HabitUpdate, NewHabit } from '@/shared/types/entities'

function useInvalidateHabits() {
  const queryClient = useQueryClient()
  return () => invalidateDailyTrackerQueries(queryClient)
}

export function useCreateHabit() {
  const invalidate = useInvalidateHabits()
  return useMutation({
    mutationFn: (habit: NewHabit) => createHabit(habit),
    onSuccess: invalidate,
  })
}

export function useUpdateHabit() {
  const invalidate = useInvalidateHabits()
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: HabitUpdate }) =>
      updateHabit(id, changes),
    onSuccess: invalidate,
  })
}

export function useArchiveHabit() {
  const invalidate = useInvalidateHabits()
  return useMutation({
    mutationFn: (id: string) => archiveHabit(id),
    onSuccess: invalidate,
  })
}
