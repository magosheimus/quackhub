import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triageItem } from '@/features/drafts/api/drafts'
import { queryKeys } from '@/shared/query/queryKeys'
import type { DraftTriageTarget } from '@/shared/types/entities'

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
