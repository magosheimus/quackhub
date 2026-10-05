import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDraftContent } from '@/services/drafts/drafts'

export function useUpdateDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateDraftContent(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
