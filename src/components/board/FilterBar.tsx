import { Button } from '@/components/ui/button'
import {
  COLUMN_LABELS,
  PRIORITY_CONFIG,
  type TaskPriority,
  type TaskStatus,
  type BoardFilters,
} from '@/lib/board'
import type { Database } from '@/types/database.types'

type Epic = Database['public']['Tables']['epics']['Row']

const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const STATUS_OPTIONS: TaskStatus[] = [
  'to_study',
  'todo',
  'studying',
  'doing',
  'to_review',
  'blocked',
  'scheduled',
  'done',
]

type FilterBarProps = {
  filters: BoardFilters
  onUpdateFilter: <K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) => void
  onReset: () => void
  epics: Epic[]
}

export function FilterBar({
  filters,
  onUpdateFilter,
  onReset,
  epics,
}: FilterBarProps) {
  const hasActiveFilter =
    filters.flagged !== null ||
    filters.srsOverdue ||
    filters.priority !== null ||
    filters.status !== null ||
    filters.epicId !== null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[--text-muted]">FILTROS RÁPIDOS:</span>

      <Button
        type="button"
        variant={filters.flagged === true ? 'default' : 'outline'}
        size="sm"
        onClick={() =>
          onUpdateFilter('flagged', filters.flagged === true ? null : true)
        }
      >
        Urgente
      </Button>

      <Button
        type="button"
        variant={filters.srsOverdue ? 'default' : 'outline'}
        size="sm"
        onClick={() => onUpdateFilter('srsOverdue', !filters.srsOverdue)}
      >
        SRS vencido
      </Button>

      {PRIORITY_OPTIONS.map((option) => (
        <Button
          key={option}
          type="button"
          variant={filters.priority === option ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onUpdateFilter(
              'priority',
              filters.priority === option ? null : option,
            )
          }
        >
          {PRIORITY_CONFIG[option].text}
        </Button>
      ))}

      {STATUS_OPTIONS.map((status) => (
        <Button
          key={status}
          type="button"
          variant={filters.status === status ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onUpdateFilter('status', filters.status === status ? null : status)
          }
        >
          {COLUMN_LABELS[status]}
        </Button>
      ))}

      {epics.map((epic) => (
        <Button
          key={epic.id}
          type="button"
          variant={filters.epicId === epic.id ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onUpdateFilter(
              'epicId',
              filters.epicId === epic.id ? null : epic.id,
            )
          }
        >
          {epic.name}
        </Button>
      ))}

      {hasActiveFilter && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Limpar
        </Button>
      )}
    </div>
  )
}
