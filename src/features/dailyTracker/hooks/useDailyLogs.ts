import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDailyLogs, logMood } from '@/features/dailyTracker/api/dailyTracker'
import { queryKeys } from '@/shared/query/queryKeys'
import { invalidateDailyTrackerQueries } from '@/shared/query/queryInvalidation'

export function useDailyLogs(start: string, end: string) {
  return useQuery({
    queryKey: queryKeys.dailyTracker.dailyLogs(start, end),
    queryFn: () => getDailyLogs(start, end),
  })
}

type LogMoodVars = {
  date: string
  mood: number
  comment: string | null
}

export function useLogMood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, mood, comment }: LogMoodVars) =>
      logMood(date, mood, comment),
    onSuccess: () => invalidateDailyTrackerQueries(queryClient),
  })
}
