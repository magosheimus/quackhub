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
  epics: Epic[]
  projects: Project[]
}

const CHIP_CLASS = 'bg-(--bg-card) hover:bg-(--bg-hover)'

function chipProps(active: boolean) {
  return {
    variant: active ? ('default' as const) : ('outline' as const),
    className: active ? undefined : CHIP_CLASS,
  }
}

export function FilterBar({
  filters,
  onUpdateFilter,
  epics,
  projects,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium uppercase tracking-wide text-(--text-primary)">
        Filtros rápidos:
      </span>

      {epics.map((epic) => (
        <Button
          key={epic.id}
          type="button"
          size="sm"
          {...chipProps(filters.epicId === epic.id)}
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

      {projects.map((project) => {
        const isActive = filters.projectIds.includes(project.id)
        return (
          <Button
            key={project.id}
            type="button"
            size="sm"
            {...chipProps(isActive)}
            onClick={() =>
              onUpdateFilter(
                'projectIds',
                isActive
                  ? filters.projectIds.filter((id) => id !== project.id)
                  : [...filters.projectIds, project.id],
              )
            }
          >
            {project.name}
          </Button>
        )
      })}
    </div>
  )
}
