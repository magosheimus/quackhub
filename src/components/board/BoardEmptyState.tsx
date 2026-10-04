import { Link } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { SprintCreateModal } from '@/components/sprint/SprintCreateModal'
import { useStartSprint } from '@/hooks/sprints/useStartSprint'
import type { Database } from '@/types/database.types'

type Sprint = Database['public']['Tables']['sprints']['Row']

type BoardEmptyStateProps = {
  plannedSprint: Sprint | null
}

export function BoardEmptyState({ plannedSprint }: BoardEmptyStateProps) {
  const { mutate: startSprint, isPending } = useStartSprint()

  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-(--bg-surface) bg-(--bg-page) px-6 py-12 text-center">
      <Timer size={32} aria-hidden="true" className="text-(--text-muted)" />

      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-(--text-primary)">
          Nenhuma sprint ativa
        </span>
        <span className="text-sm text-(--text-muted)">
          {plannedSprint
            ? `${plannedSprint.name} está planejada. Inicie para ver o board.`
            : 'Crie uma sprint para começar a planejar o board.'}
        </span>
      </div>

      <div className="flex gap-4 pt-2">
        <Link
          to="/backlog"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          Ir para o Backlog
        </Link>
        {plannedSprint ? (
          <Button
            size="sm"
            onClick={() => startSprint(plannedSprint.id)}
            disabled={isPending}
          >
            {isPending ? 'Iniciando...' : 'Iniciar sprint'}
          </Button>
        ) : (
          <SprintCreateModal />
        )}
      </div>
    </div>
  )
}
