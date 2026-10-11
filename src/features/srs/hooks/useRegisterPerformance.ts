import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerPerformance } from '@/features/srs/api/srs'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import { queryKeys } from '@/shared/query/queryKeys'

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
  })
}
