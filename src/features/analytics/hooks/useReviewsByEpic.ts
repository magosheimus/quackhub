import { useQuery } from '@tanstack/react-query'
import { getReviewsByEpic } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useReviewsByEpic(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.reviewsByEpic(sprintId),
    queryFn: () => getReviewsByEpic(sprintId),
  })
}
