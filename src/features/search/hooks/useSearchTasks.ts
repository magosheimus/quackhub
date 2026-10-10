import { useQuery } from '@tanstack/react-query'
import { searchTasks } from '@/features/search/api/search'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSearchTasks(query: string) {
  return useQuery({
    queryKey: queryKeys.search.byQuery(query),
    queryFn: () => searchTasks(query),
    enabled: query.trim().length > 0,
  })
}
