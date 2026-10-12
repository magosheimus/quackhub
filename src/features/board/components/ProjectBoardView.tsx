import { IconBulletlist, IconPlus } from '@/shared/lib/icons'
import { useState, type ReactNode } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { BoardCard, StaticBoardCard } from './BoardCard'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { EpicManageModal } from '@/features/epics/components/EpicManageModal'
import { Button } from '@/components/ui/button'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import { getColumnsForType } from '@/features/board/lib/board'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import {
  getProjectBucket,
  sortByStatusOrder,
  type ProjectBucket,
} from '@/features/board/lib/projectBoard'
import type { Project, Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BOARD_TEXTS } from '@/features/board/constants/texts'

type ProjectBoardViewProps = {
  project: Project
  activeSprintId: string | null
  activeSprintName: string | null
  tasks: Task[]
  projectPrefixById: Map<string, string>
}

export function ProjectBoardView({
  project,
  activeSprintId,
  activeSprintName,
  tasks,
  projectPrefixById,
}: ProjectBoardViewProps) {
  const { mutate: addTaskToSprint } = useAddTaskToSprint()
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const projectType = project.type

  const buckets: Record<ProjectBucket, Task[]> = {
    sprint: [],
    done: [],
    backlog: [],
  }
  for (const task of tasks) {
    buckets[getProjectBucket(task, activeSprintId)].push(task)
  }
  const sprintTasks = sortByStatusOrder(
    buckets.sprint,
    getColumnsForType(projectType),
  )

  function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination || !activeSprintId) return
    if (
      source.droppableId !== 'backlog' ||
      destination.droppableId !== 'sprint'
    ) {
      return
    }
    addTaskToSprint({
      taskId: draggableId,
      sprintId: activeSprintId,
      status: getInitialStatusForType(projectType),
      projectId: project.id,
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-heading text-3xl text-fg">{project.name}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption">
              {activeSprintName
                ? BOARD_TEXTS.activeSprint(activeSprintName)
                : BOARD_TEXTS.noActiveSprint}
            </span>
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

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Section
            title={BOARD_TEXTS.currentSprintSection}
            count={sprintTasks.length}
          >
            <Droppable droppableId="sprint" isDropDisabled={!activeSprintId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex min-h-16 flex-col gap-2"
                >
                  {sprintTasks.map((task) => (
                    <StaticBoardCard
                      key={task.id}
                      task={task}
                      projectPrefixById={projectPrefixById}
                      showStatus
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Section>

          <Section
            title={BOARD_TEXTS.backlogSection}
            count={buckets.backlog.length}
          >
            <Droppable droppableId="backlog" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex min-h-16 flex-col gap-2"
                >
                  {buckets.backlog.map((task, index) => (
                    <BoardCard
                      key={task.id}
                      task={task}
                      index={index}
                      projectPrefixById={projectPrefixById}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Section>

          <Section title={BOARD_TEXTS.doneSection} count={buckets.done.length}>
            <div className="flex flex-col gap-2">
              {buckets.done.map((task) => (
                <StaticBoardCard
                  key={task.id}
                  task={task}
                  projectPrefixById={projectPrefixById}
                />
              ))}
            </div>
          </Section>
        </div>

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
    </DragDropContext>
  )
}

function Section({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-heading text-xl text-fg">{title}</span>
        <span className="text-caption">{count}</span>
      </div>
      {count === 0 && (
        <span className="px-1 text-caption">{BOARD_TEXTS.noCards}</span>
      )}
      {children}
    </div>
  )
}
