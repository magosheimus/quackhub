import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerPerformance } from '@/services/srs/srs'

type RegisterPerformanceInput = {
  taskId: string
  projectId: string
  sprintId: string | null
  nota: number
  confianca: number
  comment?: string
}

export function useRegisterPerformance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      nota,
      confianca,
      comment,
    }: RegisterPerformanceInput) =>
      registerPerformance(taskId, nota, confianca, comment),
    onSuccess: (_log, { taskId, projectId, sprintId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] })
      queryClient.invalidateQueries({ queryKey: ['srs-logs', taskId] })
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog', projectId],
      })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'backlog', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project'] })
      if (sprintId) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', 'sprint', sprintId],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
