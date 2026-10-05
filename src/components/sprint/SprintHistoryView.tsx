import { IconClock, IconChevronRight } from '@/lib/icons'
import { useState } from 'react'
import { useSprints } from '@/hooks/sprints/useSprints'
import { PageTitle } from '@/components/ui/page-title'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import { SprintSummary } from './SprintSummary'
import { LoadingText } from '../ui/loading-text'

function formatShortDate(date: string | null): string {
  if (!date) return '?'
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

export function SprintHistoryView() {
  const { data: sprints, isLoading } = useSprints()
  const [openSprintIds, setOpenSprintIds] = useState<Set<string>>(new Set())
  const closedSprints = sprints
    ?.filter((s) => s.status === 'closed')
    .sort((a, b) => (b.end_date ?? '').localeCompare(a.end_date ?? ''))

  function toggleSprint(id: string) {
    setOpenSprintIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return <LoadingText />
  }

  if (!closedSprints || closedSprints.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title="Histórico" icon={IconClock} count={0} />
        <div className="text-sm text-(--text-muted)">
          — nenhuma sprint encerrada ainda —
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Histórico"
        icon={IconClock}
        count={closedSprints.length}
      />
      <div className="flex flex-col gap-2">
        {closedSprints.map((sprint) => {
          const isOpen = openSprintIds.has(sprint.id)
          const percent = Math.round((sprint.completion_rate ?? 0) * 100)
          return (
            <div key={sprint.id} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleSprint(sprint.id)}
                aria-expanded={isOpen}
                className="flex items-center gap-4 rounded-md border border-border bg-(--bg-card) p-4 text-left hover:bg-(--bg-card-hover)"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-base text-(--text-primary)">
                    {sprint.name}
                    <span className="ml-2 text-xs text-(--text-muted)">
                      ({formatShortDate(sprint.start_date)} -{' '}
                      {formatShortDate(sprint.end_date)})
                    </span>
                  </span>
                  {sprint.goal && (
                    <span className="text-sm text-(--text-muted)">
                      {sprint.goal}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-(--text-muted)">
                    {sprint.completed_tasks ?? 0} de {sprint.total_tasks ?? 0}
                  </span>
                  <SegmentedProgress
                    value={percent}
                    label={`Progresso de ${sprint.name}`}
                  />
                </div>
                <IconChevronRight
                  size={12}
                  aria-hidden="true"
                  className={`text-(--text-muted) transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>
              {isOpen && <SprintSummary sprint={sprint} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
