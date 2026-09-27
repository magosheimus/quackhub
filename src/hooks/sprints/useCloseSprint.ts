import { useMutation, useQueryClient } from '@tanstack/react-query'
import { closeSprint } from '@/services/sprints/sprints'
import type { CarryoverDecision } from '@/lib/sprint'

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
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog'],
      })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'sprint'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
