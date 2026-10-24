import { useState } from 'react'
import { flushSync } from 'react-dom'
import type { DropResult } from '@hello-pangea/dnd'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useArrangeDrafts } from '@/features/drafts/hooks/useArrangeDrafts'
import {
  arrangeDraftsAfterDrop,
  groupDraftsByProject,
} from '@/features/drafts/lib/drafts'
import type { DraftsItem } from '@/shared/types/entities'

export function useDraftGroups(pending: DraftsItem[]) {
  const { data: projects } = useProjects()
  const { mutate: arrange } = useArrangeDrafts()
  const [isDragging, setIsDragging] = useState(false)

  const groups = groupDraftsByProject(pending, projects ?? [], isDragging)

  function handleBeforeCapture() {
    flushSync(() => {
      setIsDragging(true)
    })
  }

  function handleDragEnd({ source, destination }: DropResult) {
    setIsDragging(false)
    if (!destination) {
      return
    }
    const arrangement = arrangeDraftsAfterDrop(groups, source, destination)
    if (arrangement) {
      arrange(arrangement)
    }
  }

  return {
    groups,
    orderedPending: groups.flatMap((group) => group.items),
    handleBeforeCapture,
    handleDragEnd,
  }
}
