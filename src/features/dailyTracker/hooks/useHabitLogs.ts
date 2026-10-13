import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getHabitLogs,
  logHabit,
} from '@/features/dailyTracker/api/dailyTracker'
import { queryKeys } from '@/shared/query/queryKeys'
import { invalidateDailyTrackerQueries } from '@/shared/query/queryInvalidation'
import type { HabitLog } from '@/shared/types/entities'

export function useHabitLogs(start: string, end: string) {
  return useQuery({
    queryKey: queryKeys.dailyTracker.habitLogs(start, end),
    queryFn: () => getHabitLogs(start, end),
  })
}

type LogHabitVars = {
  habitId: string
  date: string
  value: number
}

export function useLogHabit(start: string, end: string) {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.dailyTracker.habitLogs(start, end)

  return useMutation({
    mutationFn: ({ habitId, date, value }: LogHabitVars) =>
      logHabit(habitId, date, value),

    onMutate: async ({ habitId, date, value }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousLogs = queryClient.getQueryData<HabitLog[]>(queryKey)
      queryClient.setQueryData<HabitLog[]>(queryKey, (logs = []) => {
        const others = logs.filter(
          (log) => !(log.habit_id === habitId && log.date === date),
        )
        const current = logs.find(
          (log) => log.habit_id === habitId && log.date === date,
        )
        return [
          ...others,
          {
            id: current?.id ?? `optimistic-${habitId}-${date}`,
            user_id: current?.user_id ?? '',
            habit_id: habitId,
            date,
            value,
            created_at: current?.created_at ?? new Date().toISOString(),
          },
        ]
      })
      return { previousLogs }
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousLogs)
    },

    onSettled: () => invalidateDailyTrackerQueries(queryClient),
  })
}
