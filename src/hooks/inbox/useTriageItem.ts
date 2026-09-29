import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triageItem } from '@/services/inbox/inbox'

type TriageDecision = {
  triaged_to: string
  triaged_task_id?: string | null
}

export function useTriageItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: TriageDecision }) =>
      triageItem(id, decision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
