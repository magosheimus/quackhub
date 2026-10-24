import { useState } from 'react'
import { IconBulletlist, IconFolderFilled, IconPlus } from '@/shared/lib/icons'
import { ProjectProgressView } from './ProjectProgressView'
import { ProjectEpicsView } from './ProjectEpicsView'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { EpicManageModal } from '@/features/epics/components/EpicManageModal'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useProjectView } from '@/features/board/hooks/useProjectView'
import {
  PROJECT_VIEWS,
  type ProjectView,
} from '@/features/board/lib/projectBoard'
import type { Project } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import type { ProjectLabels } from '@/features/projects/lib/project'

const VIEW_LABELS: Record<ProjectView, string> = {
  progress: BOARD_TEXTS.viewProgress,
  epics: BOARD_TEXTS.viewEpics,
}

const VIEW_HINTS: Record<ProjectView, string> = {
  progress: BOARD_TEXTS.progressHint,
  epics: BOARD_TEXTS.epicsHint,
}

type ProjectBoardViewProps = {
  project: Project
  activeSprintId: string | null
  activeSprintName: string | null
  tasks: Task[]
  projectLabels: ProjectLabels
  projectColor: string
}

export function ProjectBoardView({
  project,
  activeSprintId,
  activeSprintName,
  tasks,
  projectLabels,
  projectColor,
}: ProjectBoardViewProps) {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const { view, selectView } = useProjectView()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="flex items-center gap-3 font-heading text-heading-1 text-fg">
          <IconFolderFilled
            size={28}
            aria-hidden="true"
            style={{ color: projectColor }}
          />
          {project.name}
        </span>
        <span className="text-caption">
          {activeSprintName
            ? BOARD_TEXTS.activeSprint(activeSprintName)
            : BOARD_TEXTS.noActiveSprint}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          className="flex gap-2"
          role="group"
          aria-label={BOARD_TEXTS.viewLabel}
        >
          {PROJECT_VIEWS.map((option) => (
            <Tooltip key={option}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="sm"
                    variant={view === option ? 'selected' : 'outline'}
                    aria-pressed={view === option}
                    onClick={() => selectView(option)}
                  />
                }
              >
                {VIEW_LABELS[option]}
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {VIEW_HINTS[option]}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCardModalOpen(true)}
          >
            <IconPlus size={12} aria-hidden="true" />
            {BOARD_TEXTS.newCard}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEpicModalOpen(true)}
          >
            <IconBulletlist size={12} aria-hidden="true" />
            {COMMON_TEXTS.manageEpics}
          </Button>
        </div>
      </div>

      {view === 'epics' ? (
        <ProjectEpicsView
          projectId={project.id}
          onAddEpic={() => setIsEpicModalOpen(true)}
          activeSprintId={activeSprintId}
          tasks={tasks}
          projectLabels={projectLabels}
        />
      ) : (
        <ProjectProgressView
          project={project}
          onAddCard={() => setIsCardModalOpen(true)}
          activeSprintId={activeSprintId}
          tasks={tasks}
          projectLabels={projectLabels}
        />
      )}

      {isCardModalOpen && (
        <CardCreateModal
          open={isCardModalOpen}
          onOpenChange={setIsCardModalOpen}
          initialProjectId={project.id}
          hideTrigger
        />
      )}
      {isEpicModalOpen && (
        <EpicManageModal
          initialProjectId={project.id}
          open={isEpicModalOpen}
          onOpenChange={setIsEpicModalOpen}
        />
      )}
    </div>
  )
}
