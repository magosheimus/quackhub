import { useQuery } from '@tanstack/react-query'
import { getAllEpics } from '@/services/epics/epics'

export function useAllEpics() {
  return useQuery({
    queryKey: ['epics', 'all'],
    queryFn: getAllEpics,
  })
}
