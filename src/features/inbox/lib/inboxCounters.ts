import { INBOX_TEXTS } from '@/features/inbox/constants/texts'

export type InboxCounterTone = 'default' | 'muted' | 'danger'

export type InboxCounter = {
  key: 'tasks' | 'reviews' | 'urgent'
  value: number
  label: string
  tone: InboxCounterTone
}

type InboxCounts = {
  dueToday: number
  srsOverdue: number
  urgent: number
}

export function buildInboxCounters(counts: InboxCounts): InboxCounter[] {
  return [
    {
      key: 'tasks',
      value: counts.dueToday,
      label: INBOX_TEXTS.tasksCounter,
      tone: counts.dueToday === 0 ? 'muted' : 'default',
    },
    {
      key: 'reviews',
      value: counts.srsOverdue,
      label: INBOX_TEXTS.reviewsCounter,
      tone: counts.srsOverdue === 0 ? 'muted' : 'default',
    },
    {
      key: 'urgent',
      value: counts.urgent,
      label: INBOX_TEXTS.urgentCounter,
      tone: counts.urgent === 0 ? 'muted' : 'danger',
    },
  ]
}
