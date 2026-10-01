import { Button } from '@/components/ui/button'
import type { BoardFilters } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Epic = Database['public']['Tables']['epics']['Row']
type Project = Database['public']['Tables']['projects']['Row']

type FilterBarProps = {
  filters: BoardFilters
  onUpdateFilter: <K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) => void
  onReset: () => void
  epics: Epic[]
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (projectId: string | null) => void
}

export function FilterBar({
  filters,
  onUpdateFilter,
  onReset,
  epics,
  projects,
  selectedProjectId,
  onSelectProject,
}: FilterBarProps) {
  const hasActiveFilter =
    filters.flagged !== null ||
    filters.srsOverdue ||
    filters.epicId !== null ||
    selectedProjectId !== null

  function handleReset() {
    onReset()
    onSelectProject(null)
  }

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

      {projects.map((project) => (
        <Button
          key={project.id}
          type="button"
          variant={selectedProjectId === project.id ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onSelectProject(
              selectedProjectId === project.id ? null : project.id,
            )
          }
        >
          {project.name}
        </Button>
      ))}

      {hasActiveFilter && (
        <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
          Limpar
        </Button>
      )}
    </div>
  )
}
