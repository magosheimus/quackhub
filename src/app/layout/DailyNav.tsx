import {
  IconCalendarWeeks,
  IconInbox,
  IconNotes,
  IconStar,
} from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'
import { APP_TEXTS } from '@/app/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { DRAFTS_PATH } from '@/features/drafts/constants/paths'
import { NavItem } from './NavItem'
import { useNavCounts } from './useNavCounts'

type DailyNavProps = {
  orientation: 'horizontal' | 'vertical'
}

function CountBadge({
  count,
  isHighlighted,
}: {
  count: number
  isHighlighted: boolean
}) {
  if (count === 0) {
    return null
  }
  return (
    <span
      className={cn(
        'ml-auto rounded-sm px-1.5 text-xs leading-5',
        isHighlighted
          ? 'bg-accent text-on-accent'
          : 'border border-border text-fg-muted',
      )}
    >
      {count}
    </span>
  )
}

export function DailyNav({ orientation }: DailyNavProps) {
  const { inboxCount, draftsCount } = useNavCounts()
  const isHorizontal = orientation === 'horizontal'
  const hintSide = isHorizontal ? 'bottom' : 'right'

  return (
    <nav
      aria-label={APP_TEXTS.dailyNavigation}
      className={cn('flex gap-1', isHorizontal ? 'items-center' : 'flex-col')}
    >
      <NavItem
        to="/diario"
        icon={IconCalendarWeeks}
        hint={APP_TEXTS.hintDailyTracker}
        label={DAILY_TRACKER_TEXTS.title}
        hintSide={hintSide}
      />
      <NavItem
        to="/inbox"
        icon={IconInbox}
        hint={APP_TEXTS.hintInbox}
        label={INBOX_TEXTS.title}
        badge={<CountBadge count={inboxCount} isHighlighted />}
        hintSide={hintSide}
      />
      <NavItem
        to="/board"
        icon={IconStar}
        hint={APP_TEXTS.hintCurrentSprint}
        label={COMMON_TEXTS.currentSprint}
        hintSide={hintSide}
      />
      <NavItem
        to={DRAFTS_PATH}
        icon={IconNotes}
        hint={APP_TEXTS.hintDrafts}
        label={DRAFTS_TEXTS.title}
        badge={<CountBadge count={draftsCount} isHighlighted={false} />}
        hintSide={hintSide}
      />
    </nav>
  )
}
