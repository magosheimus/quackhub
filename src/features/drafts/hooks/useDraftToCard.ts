import { useState } from 'react'
import { useTriageDraft } from '@/features/drafts/hooks/useTriageDraft'
import {
  findAdjacentDraft,
  findDraftAfterTriage,
  getDraftPosition,
} from '@/features/drafts/lib/drafts'
import type { CardCreatedContext } from '@/features/tasks/components/CardCreateModal'
import type { DraftsItem } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'

export function useDraftToCard(pending: DraftsItem[]) {
  const { mutate: triage } = useTriageDraft()
  const [draft, setDraft] = useState<DraftsItem | null>(null)

  const previousDraft = draft ? findAdjacentDraft(pending, draft.id, -1) : null
  const nextDraft = draft ? findAdjacentDraft(pending, draft.id, 1) : null

  function handleCreated(
    task: Task,
    { willCreateAnother }: CardCreatedContext,
  ) {
    if (!draft) {
      return
    }
    triage({
      id: draft.id,
      decision: { triaged_to: 'task', triaged_task_id: task.id },
    })
    setDraft(willCreateAnother ? findDraftAfterTriage(pending, draft.id) : null)
  }

  return {
    isOpen: draft !== null,
    prefill: draft
      ? { id: draft.id, title: draft.content, projectId: draft.project_id }
      : undefined,
    position: draft ? getDraftPosition(pending, draft.id) : null,
    canGoPrevious: previousDraft !== null,
    canGoNext: nextDraft !== null,
    goPrevious: () => setDraft(previousDraft),
    goNext: () => setDraft(nextDraft),
    open: setDraft,
    close: () => setDraft(null),
    handleCreated,
  }
}
