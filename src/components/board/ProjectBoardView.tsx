import { useState, type ReactNode } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { BoardCard, StaticBoardCard } from './BoardCard'
import { CardCreateModal } from '@/components/card/CardCreateModal'
import { EpicManageModal } from '@/components/epic/EpicManageModal'
import { Button } from '@/components/ui/button'
import { useAddTaskToSprint } from '@/hooks/tasks/sprint/useAddTaskToSprint'
import { getColumnsForType, getInitialStatusForType } from '@/lib/board'
import {
  getProjectBucket,
  sortByStatusOrder,
  type ProjectBucket,
} from '@/lib/projectBoard'
import type { ProjectType } from '@/lib/project'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']

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
  const projectType = project.type as ProjectType

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
          <span className="font-heading text-2xl text-(--text-primary)">
            {project.name}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-(--text-muted)">
              {activeSprintName
                ? `Sprint ativa: ${activeSprintName}`
                : 'Sem sprint ativa'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCardModalOpen(true)}
            >
              + Novo card
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEpicModalOpen(true)}
            >
              + Criar épico
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Section title="SPRINT ATUAL" count={sprintTasks.length}>
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

          <Section title="BACKLOG" count={buckets.backlog.length}>
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

          <Section title="CONCLUÍDOS" count={buckets.done.length}>
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
        <span className="font-heading text-lg text-(--text-primary)">
          {title}
        </span>
        <span className="text-xs text-(--text-muted)">{count}</span>
      </div>
      {count === 0 && (
        <span className="px-1 text-xs text-(--text-muted)">
          — nenhum card —
        </span>
      )}
      {children}
    </div>
  )
}
