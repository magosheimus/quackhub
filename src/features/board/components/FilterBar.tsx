import { Button } from '@/components/ui/button'
import type { BoardFilters } from '@/features/board/lib/board'
import type { Epic, Project } from '@/shared/types/entities'
import { BOARD_TEXTS } from '@/features/board/constants/texts'

type FilterBarProps = {
  filters: BoardFilters
  onUpdateFilter: <K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) => void
  epics: Epic[]
  projects: Project[]
}

const CHIP_CLASS = 'bg-card hover:bg-hover'

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
      <span className="text-sm font-medium uppercase tracking-wide text-fg">
        {BOARD_TEXTS.quickFilters}
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
