import { useQuery } from '@tanstack/react-query'
import { getAllEpics } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useAllEpics() {
  return useQuery({
    queryKey: queryKeys.epics.all,
    queryFn: getAllEpics,
  })
}
