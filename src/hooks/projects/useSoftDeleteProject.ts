import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteProject } from '@/services/projects/projects'
import { queryKeys } from '@/lib/queryKeys'

export function useSoftDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: softDeleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
