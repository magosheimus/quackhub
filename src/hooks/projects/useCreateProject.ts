import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '@/services/projects/projects'
import { queryKeys } from '@/lib/queryKeys'

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
