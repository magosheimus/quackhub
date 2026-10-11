import { IconHourglass } from '@/shared/lib/icons'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SprintCreateModal } from '@/features/sprints/components/SprintCreateModal'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BOARD_TEXTS } from '@/features/board/constants/texts'

export function BoardEmptyState() {
  return (
    <div className="flex h-21 flex-col items-center justify-center gap-1 rounded-md border border-(--border-card-empty) bg-card-empty px-2 text-xs text-fg-muted">
      <IconHourglass size={24} aria-hidden="true" className="text-fg-muted" />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-fg">
          {BOARD_TEXTS.emptyTitle}
        </span>
        <span className="text-sm text-fg-muted">
          {BOARD_TEXTS.emptyDescription}
        </span>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="sm" render={<Link to="/backlog" />}>
          {COMMON_TEXTS.goToBacklog}
        </Button>
        <SprintCreateModal />
      </div>
    </div>
  )
}
