import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triageItem } from '@/services/drafts/drafts'
import { queryKeys } from '@/lib/queryKeys'
import type { DraftTriageTarget } from '@/types/entities'

type TriageDecision = {
  triaged_to: DraftTriageTarget
  triaged_task_id?: string | null
}

export function useTriageDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: TriageDecision }) =>
      triageItem(id, decision),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
