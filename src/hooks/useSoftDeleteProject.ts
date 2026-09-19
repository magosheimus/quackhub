import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteProject } from '@/services/projects'

export function useSoftDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: softDeleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
