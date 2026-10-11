import { useMutation, useQueryClient } from '@tanstack/react-query'
import { closeSprint } from '@/features/sprints/api/sprints'
import type { CarryoverDecision } from '@/features/sprints/lib/sprint'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import { queryKeys } from '@/shared/query/queryKeys'

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
  })
}
