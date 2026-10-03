import { Link } from 'react-router-dom'
import { useSprints } from '@/hooks/sprints/useSprints'
import { LoadingText } from '../ui/loading-text'

export function SprintHistoryView() {
  const { data: sprints, isLoading } = useSprints()
  const closedSprints = sprints?.filter((s) => s.status === 'closed')

  if (isLoading) {
    return <LoadingText />
  }

  if (!closedSprints || closedSprints.length === 0) {
    return (
      <div className="text-sm text-[--text-muted]">
        — nenhuma sprint encerrada ainda —
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {closedSprints.map((sprint) => (
        <Link
          key={sprint.id}
          to={`/sprints/${sprint.id}`}
          className="rounded-(--radius-md) border border-(--border) bg-(--bg-card) p-3 text-sm text-[--text-primary] hover:bg-(--bg-card-hover)"
        >
          {sprint.name}
          {sprint.completion_rate != null && (
            <span className="ml-2 text-xs text-[--text-muted]">
              {Math.round(sprint.completion_rate * 100)}% concluído
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
