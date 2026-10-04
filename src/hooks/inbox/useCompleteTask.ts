import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskStatus } from '@/services/tasks/tasks'

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => updateTaskStatus(id, 'done'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
    },
    onError: (error) => {
      window.alert(error.message)
    },
  })
}
