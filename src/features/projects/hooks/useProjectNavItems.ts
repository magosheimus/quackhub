import { useProjects } from '@/features/projects/hooks/useProjects'
import { toProjectLabel } from '@/features/projects/lib/project'
import { useReorderList } from '@/shared/hooks/useReorderList'
import { queryKeys } from '@/shared/query/queryKeys'

export function useProjectNavItems() {
  const { data: projects, isLoading } = useProjects()
  const { handleDragEnd } = useReorderList({
    table: 'projects',
    items: projects ?? [],
    queryKey: queryKeys.projects.root,
  })

  return {
    isLoading,
    handleDragEnd,
    items: (projects ?? []).map((project) => ({
      project,
      color: toProjectLabel(project).color,
    })),
  }
}
