import { useProjects } from '@/features/projects/hooks/useProjects'
import { toProjectLabel } from '@/features/projects/lib/project'

export function useProjectNavItems() {
  const { data: projects, isLoading } = useProjects()

  return {
    isLoading,
    items: (projects ?? []).map((project) => ({
      project,
      color: toProjectLabel(project).color,
    })),
  }
}
