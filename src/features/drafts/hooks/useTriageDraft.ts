import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triageItem } from '@/features/drafts/api/drafts'
import { invalidateDraftQueries } from '@/shared/query/queryInvalidation'
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
    onSuccess: () => {
      invalidateDraftQueries(queryClient)
    },
  })
}
