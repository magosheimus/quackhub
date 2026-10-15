import { Button } from '@/components/ui/button'
import type { BoardFilters } from '@/features/board/lib/board'
import { ColorDot } from '@/components/ui/color-dot'
import type { EpicOption } from '@/features/epics/lib/epic'
import type { ProjectOption } from '@/features/projects/lib/project'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import type { PersonaOption } from '@/features/personas/lib/persona'
import { toggleItem } from '@/shared/lib/array'

type FilterBarProps = {
  filters: BoardFilters
  onUpdateFilter: <K extends keyof BoardFilters>(
    key: K,
    value: BoardFilters[K],
  ) => void
  epics: EpicOption[]
  projects: ProjectOption[]
  personas: PersonaOption[]
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
  personas,
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
                toggleItem(filters.projectIds, project.id),
              )
            }
          >
            <ColorDot color={project.color} />
            {project.name}
          </Button>
        )
      })}

      {personas.map((persona) => (
        <Button
          key={persona.id}
          type="button"
          size="sm"
          {...chipProps(filters.assigneeIds.includes(persona.id))}
          onClick={() =>
            onUpdateFilter(
              'assigneeIds',
              toggleItem(filters.assigneeIds, persona.id),
            )
          }
        >
          <PersonaIcon icon={persona.icon} name={persona.name} />
          {persona.name}
        </Button>
      ))}
    </div>
  )
}
