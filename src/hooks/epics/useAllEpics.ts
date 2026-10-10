import { useQuery } from '@tanstack/react-query'
import { getAllEpics } from '@/services/epics/epics'
import { queryKeys } from '@/lib/queryKeys'

export function useAllEpics() {
  return useQuery({
    queryKey: queryKeys.epics.all,
    queryFn: getAllEpics,
  })
}
