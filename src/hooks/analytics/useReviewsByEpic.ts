import { useQuery } from '@tanstack/react-query'
import { getReviewsByEpic } from '@/services/analytics/analytics'

export function useReviewsByEpic(sprintId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'reviews-by-epic', sprintId ?? 'all'],
    queryFn: () => getReviewsByEpic(sprintId),
  })
}
