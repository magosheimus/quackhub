import { useReorderList } from '@/shared/hooks/useReorderList'
import { queryKeys } from '@/shared/query/queryKeys'
import type { Epic } from '@/shared/types/entities'

export function useReorderEpics(projectId: string, epics: Epic[]) {
  return useReorderList({
    table: 'epics',
    items: epics,
    queryKey: queryKeys.epics.byProject(projectId),
    invalidateKey: queryKeys.epics.root,
  })
}
