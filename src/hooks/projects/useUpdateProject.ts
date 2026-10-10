import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/services/projects/projects'
import { queryKeys } from '@/lib/queryKeys'
import type { ProjectUpdate } from '@/types/entities'

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
