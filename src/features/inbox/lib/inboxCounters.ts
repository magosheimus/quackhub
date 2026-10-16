import { INBOX_TEXTS } from '@/features/inbox/constants/texts'

export type InboxCounterTone = 'default' | 'muted' | 'danger'

export type InboxCounter = {
  key: 'deadlines' | 'reviews' | 'urgent'
  value: number
  label: string
  tone: InboxCounterTone
  overdueDetail: string | null
}

type InboxCounts = {
  dueByToday: number
  overdue: number
  srsOverdue: number
  urgent: number
}

export function buildInboxCounters(counts: InboxCounts): InboxCounter[] {
  return [
    {
      key: 'deadlines',
      value: counts.dueByToday,
      label: INBOX_TEXTS.deadlinesCounter,
      tone: counts.dueByToday === 0 ? 'muted' : 'default',
      overdueDetail:
        counts.overdue > 0 ? INBOX_TEXTS.overdueDetail(counts.overdue) : null,
    },
    {
      key: 'reviews',
      value: counts.srsOverdue,
      label: INBOX_TEXTS.reviewsCounter,
      tone: counts.srsOverdue === 0 ? 'muted' : 'default',
      overdueDetail: null,
    },
    {
      key: 'urgent',
      value: counts.urgent,
      label: INBOX_TEXTS.urgentCounter,
      tone: counts.urgent === 0 ? 'muted' : 'danger',
      overdueDetail: null,
    },
  ]
}
