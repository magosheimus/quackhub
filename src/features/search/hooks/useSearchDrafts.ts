import { useQuery } from '@tanstack/react-query'
import { searchDrafts } from '@/features/search/api/search'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSearchDrafts(query: string) {
  return useQuery({
    queryKey: queryKeys.search.drafts(query),
    queryFn: () => searchDrafts(query),
    enabled: query.trim().length > 0,
  })
}
