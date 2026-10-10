import { useQuery } from '@tanstack/react-query'
import { getReviewsByEpic } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useReviewsByEpic(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.reviewsByEpic(sprintId),
    queryFn: () => getReviewsByEpic(sprintId),
  })
}
