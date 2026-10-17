import { useState } from 'react'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useToggleSet } from '@/shared/hooks/useToggleSet'
import { todayLocal } from '@/shared/lib/date'
import {
  ARCHIVE_PAGE_SIZE,
  groupArchivedDrafts,
} from '@/features/drafts/lib/drafts'
import type { DraftsItem } from '@/shared/types/entities'

export function useDraftsArchive(items: DraftsItem[]) {
  const { settings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ARCHIVE_PAGE_SIZE)
  const collapsedGroups = useToggleSet<string>()
  const hiddenCount = Math.max(items.length - visibleCount, 0)

  return {
    isOpen,
    toggleOpen: () => setIsOpen((open) => !open),
    groups: groupArchivedDrafts(
      items.slice(0, visibleCount),
      todayLocal(),
      settings.weekStartsOn,
    ),
    isGroupOpen: (key: string) => !collapsedGroups.has(key),
    toggleGroup: collapsedGroups.toggle,
    hiddenCount,
    showMore: () => setVisibleCount((count) => count + ARCHIVE_PAGE_SIZE),
  }
}
