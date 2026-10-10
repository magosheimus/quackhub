import { useQuery } from '@tanstack/react-query'
import { getEpicsByProject } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useEpics(projectId: string) {
  return useQuery({
    queryKey: queryKeys.epics.byProject(projectId),
    queryFn: () => getEpicsByProject(projectId),
    enabled: !!projectId,
  })
}
