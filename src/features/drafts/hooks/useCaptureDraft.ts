import { useMutation, useQueryClient } from '@tanstack/react-query'
import { captureItem } from '@/features/drafts/api/drafts'
import { invalidateDraftQueries } from '@/shared/query/queryInvalidation'

type DraftCapture = {
  content: string
  projectId: string | null
}

export function useCaptureDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ content, projectId }: DraftCapture) =>
      captureItem(content, projectId),
    onSuccess: () => {
      invalidateDraftQueries(queryClient)
    },
  })
}
