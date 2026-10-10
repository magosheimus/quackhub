import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDraftContent } from '@/services/drafts/drafts'
import { queryKeys } from '@/lib/queryKeys'

export function useUpdateDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateDraftContent(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
