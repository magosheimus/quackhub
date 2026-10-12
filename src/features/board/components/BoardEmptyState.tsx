import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { IconHourglass } from '@/shared/lib/icons'
import { SprintCreateModal } from '@/features/sprints/components/SprintCreateModal'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BOARD_TEXTS } from '@/features/board/constants/texts'

export function BoardEmptyState() {
  return (
    <EmptyState
      icon={IconHourglass}
      title={BOARD_TEXTS.emptyTitle}
      description={BOARD_TEXTS.emptyDescription}
    >
      <Button variant="outline" size="sm" render={<Link to="/backlog" />}>
        {COMMON_TEXTS.goToBacklog}
      </Button>
      <SprintCreateModal />
    </EmptyState>
  )
}
