import { useQuery } from '@tanstack/react-query'
import { getCompletionByProject } from '@/services/analytics/analytics'

export function useCompletionByProject(sprintId: string | null) {
  return useQuery({
    queryKey: ['analytics', 'completion-by-project', sprintId],
    queryFn: () => getCompletionByProject(sprintId ?? ''),
    enabled: !!sprintId,
  })
}
