import { useQuery } from '@tanstack/react-query'
import { searchSimilarCards } from '@/services/tasks/tasks'

export function useSimilarCards(title: string, projectId: string | null) {
  return useQuery({
    queryKey: ['tasks', 'similar', projectId, title],
    queryFn: () => searchSimilarCards(title, projectId as string),
    enabled: Boolean(projectId) && title.trim().length >= 3,
  })
}
