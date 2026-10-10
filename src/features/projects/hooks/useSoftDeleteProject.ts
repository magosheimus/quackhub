import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteProject } from '@/features/projects/api/projects'
import { queryKeys } from '@/shared/query/queryKeys'

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
