import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/services/projects'
import type { Database } from '@/types/database.types'

type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
