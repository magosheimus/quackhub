import { Link } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SprintCreateModal } from '@/components/sprint/SprintCreateModal'

export function BoardEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-(--bg-surface) bg-(--bg-page) px-6 py-12 text-center">
      <Timer size={32} aria-hidden="true" className="text-(--text-muted)" />

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
