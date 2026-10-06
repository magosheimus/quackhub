import { IconHourglass } from '@/lib/icons'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SprintCreateModal } from '@/components/sprint/SprintCreateModal'

export function BoardEmptyState() {
  return (
    <div className="flex h-21 flex-col items-center justify-center gap-1 rounded-md border border-(--border-card-empty) bg-(--bg-card-empty) px-2 text-xs text-(--text-muted)">
      <IconHourglass
        size={24}
        aria-hidden="true"
        className="text-(--text-muted)"
      />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-(--text-primary)">
          Nenhuma sprint ativa
        </span>
        <span className="text-sm text-(--text-muted)">
          Crie uma sprint para começar a planejar o board.
        </span>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="sm" render={<Link to="/backlog" />}>
          Ir para o Backlog
        </Button>
        <SprintCreateModal />
      </div>
    </div>
  )
}
