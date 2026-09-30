import { useQuery } from '@tanstack/react-query'
import { searchTasks } from '@/services/search/search'

export function useSearchTasks(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchTasks(query),
    enabled: query.trim().length > 0,
  })
}
