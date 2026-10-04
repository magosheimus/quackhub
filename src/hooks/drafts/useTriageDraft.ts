import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triageItem } from '@/services/drafts/drafts'

type TriageDecision = {
  triaged_to: string
  triaged_task_id?: string | null
}

export function useTriageDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: TriageDecision }) =>
      triageItem(id, decision),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
