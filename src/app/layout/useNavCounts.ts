import { useDraftsSections } from '@/features/drafts/hooks/useDraftsSections'
import { useInboxItems } from '@/features/inbox/hooks/useInboxItems'

export function useNavCounts() {
  const { pending } = useDraftsSections()
  const { data: inboxData } = useInboxItems()
  return {
    draftsCount: pending.length,
    inboxCount:
      (inboxData?.urgent.length ?? 0) +
      (inboxData?.srsOverdue.length ?? 0) +
      (inboxData?.dueByToday.length ?? 0),
  }
}
