import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/features/projects/api/projects'
import { queryKeys } from '@/shared/query/queryKeys'
import type { ProjectUpdate } from '@/shared/types/entities'

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.root })
    },
  })
}
