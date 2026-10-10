import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '@/features/projects/api/projects'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
