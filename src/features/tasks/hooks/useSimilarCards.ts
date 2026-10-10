import { useQuery } from '@tanstack/react-query'
import { searchSimilarCards } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSimilarCards(title: string, projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.tasks.similar(projectId, title),
    queryFn: () => searchSimilarCards(title, projectId as string),
    enabled: Boolean(projectId) && title.trim().length >= 3,
  })
}
