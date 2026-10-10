import { useQuery } from '@tanstack/react-query'
import { getEpicsByProject } from '@/services/epics/epics'
import { queryKeys } from '@/lib/queryKeys'

export function useEpics(projectId: string) {
  return useQuery({
    queryKey: queryKeys.epics.byProject(projectId),
    queryFn: () => getEpicsByProject(projectId),
    enabled: !!projectId,
  })
}
