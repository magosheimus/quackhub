import { useState } from 'react'
import { useTriageDraft } from '@/features/drafts/hooks/useTriageDraft'
import type { DraftsItem } from '@/shared/types/entities'

export function useDraftToHabit() {
  const { mutate: triage } = useTriageDraft()
  const [draft, setDraft] = useState<DraftsItem | null>(null)

  function handleCreated() {
    if (!draft) {
      return
    }
    triage({ id: draft.id, decision: { triaged_to: 'habit' } })
  }

  return {
    draft,
    open: setDraft,
    close: () => setDraft(null),
    handleCreated,
  }
}
