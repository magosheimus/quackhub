import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerPerformance } from '@/services/srs/srs'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'
import { queryKeys } from '@/lib/queryKeys'

type RegisterPerformanceInput = {
  taskId: string
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
    onSuccess: (_log, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.srsLogs.byTask(taskId),
      })
      invalidateTaskQueries(queryClient, taskId)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
