import { useMutation, useQueryClient } from '@tanstack/react-query'
import { closeSprint } from '@/services/sprints/sprints'
import type { CarryoverDecision } from '@/lib/sprint'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'
import { queryKeys } from '@/lib/queryKeys'

type CloseSprintVars = {
  sprintId: string
  decisions: Record<string, CarryoverDecision>
  nextSprintId: string | null
}

export function useCloseSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sprintId, decisions, nextSprintId }: CloseSprintVars) =>
      closeSprint(sprintId, decisions, nextSprintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.root })
      invalidateTaskQueries(queryClient)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
