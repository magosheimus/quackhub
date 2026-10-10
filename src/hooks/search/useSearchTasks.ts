import { useQuery } from '@tanstack/react-query'
import { searchTasks } from '@/services/search/search'
import { queryKeys } from '@/lib/queryKeys'

export function useSearchTasks(query: string) {
  return useQuery({
    queryKey: queryKeys.search.byQuery(query),
    queryFn: () => searchTasks(query),
    enabled: query.trim().length > 0,
  })
}
