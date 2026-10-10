import { IconPlus, IconBulletlist, IconChevronRight } from '@/shared/lib/icons'
import { useSearchParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { useBacklogTasks } from '@/features/tasks/hooks/useBacklogTasks'
import {
  COLUMN_LABELS,
  getInitialStatusForType,
  PRIORITY_CONFIG,
} from '@/features/board/lib/board'
import { BacklogRow } from '@/features/backlog/components/BacklogRow'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useAddTaskToSprint } from '@/features/tasks/hooks/sprint/useAddTaskToSprint'
import {
  isTaskPriority,
  isTaskStatus,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/shared/lib/enums'
import type { TaskPriority, TaskStatus } from '@/shared/types/entities'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { LoadingText } from '@/components/ui/loading-text'
import { Button } from '@/components/ui/button'
import { EpicManageModal } from '@/features/epics/components/EpicManageModal'
import { PageTitle } from '@/components/ui/page-title'

const NONE_VALUE = '__all__'

export function BacklogView() {
  const [searchParams] = useSearchParams()

  const [projectFilter, setProjectFilter] = useState<string | null>(
    searchParams.get('project') || null,
  )
  const initialStatus = searchParams.get('status')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(
    isTaskStatus(initialStatus) ? initialStatus : null,
  )
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(
    null,
  )
  const [epicFilter, setEpicFilter] = useState<string | null>(null)
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(
    new Set(),
  )

  function toggleProject(projectId: string) {
    setCollapsedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) next.delete(projectId)
      else next.add(projectId)
      return next
    })
  }

  const { data: projects, isLoading: isLoadingProjects } = useProjects()
  const { data: tasks, isLoading: isLoadingTasks } =
    useBacklogTasks(projectFilter)
  const { data: epics } = useEpics(projectFilter ?? '')

  const { data: activeSprint } = useActiveSprint()
  const { data: sprints } = useSprints()
  const { mutate: addTaskToSprint } = useAddTaskToSprint()

  const targetSprint =
    activeSprint ?? sprints?.find((s) => s.status === 'planned')

  if (isLoadingProjects) {
    return <LoadingText />
  }

  const projectById = new Map(projects?.map((p) => [p.id, p]))
  const projectPrefixById = new Map(
    projects?.map((p) => [p.id, p.prefix ?? '']),
  )
  const epicNameById = new Map(epics?.map((e) => [e.id, e.name]))

  const filteredTasks = (tasks ?? []).filter(
    (task) =>
      (!statusFilter || task.status === statusFilter) &&
      (!priorityFilter || task.priority === priorityFilter) &&
      (!epicFilter || task.epic_id === epicFilter),
  )

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Backlog"
        icon={IconBulletlist}
        count={filteredTasks.length}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsEpicModalOpen(true)}>
          <IconPlus size={16} aria-hidden="true" />
          Criar épico
        </Button>

        {isEpicModalOpen && (
          <EpicManageModal
            initialProjectId={projectFilter}
            open={isEpicModalOpen}
            onOpenChange={setIsEpicModalOpen}
          />
        )}

        <Select
          value={projectFilter ?? NONE_VALUE}
          onValueChange={(v) => {
            setProjectFilter(v === NONE_VALUE ? null : v)
            setEpicFilter(null)
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {projectFilter
                ? (projectById.get(projectFilter)?.name ?? 'Projeto')
                : 'Todos os projetos'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todos os projetos</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter ?? NONE_VALUE}
          onValueChange={(v) => setStatusFilter(isTaskStatus(v) ? v : null)}
        >
          <SelectTrigger>
            <SelectValue>
              {statusFilter ? COLUMN_LABELS[statusFilter] : 'Todos os status'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todos os status</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {COLUMN_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter ?? NONE_VALUE}
          onValueChange={(v) => setPriorityFilter(isTaskPriority(v) ? v : null)}
        >
          <SelectTrigger>
            <SelectValue>
              {priorityFilter
                ? PRIORITY_CONFIG[priorityFilter].text
                : 'Todas as prioridades'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todas as prioridades</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRIORITY_CONFIG[priority].text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {projectFilter && (
          <Select
            value={epicFilter ?? NONE_VALUE}
            onValueChange={(v) => setEpicFilter(v === NONE_VALUE ? null : v)}
          >
            <SelectTrigger>
              <SelectValue>
                {epicFilter ? epicNameById.get(epicFilter) : 'Todos os épicos'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>Todos os épicos</SelectItem>
              {epics?.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>
                  {epic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {isLoadingTasks && <LoadingText />}
        {!isLoadingTasks && filteredTasks.length === 0 && (
          <div className="text-sm text-(--text-muted)">
            — nenhum card no backlog —
          </div>
        )}
        {projects?.map((project) => {
          const projectTasks = filteredTasks.filter(
            (task) => task.project_id === project.id,
          )
          if (projectTasks.length === 0) return null
          const isCollapsed = collapsedProjects.has(project.id)

          return (
            <section key={project.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  aria-expanded={!isCollapsed}
                  className="flex items-center gap-2 font-heading text-xl uppercase text-(--text-primary)"
                >
                  <IconChevronRight
                    size={12}
                    aria-hidden="true"
                    className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                  />
                  {project.name}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-(--text-muted)">
                    {projectTasks.length}
                  </span>
                  {targetSprint && (
                    <Button
                      size="sm"
                      onClick={() =>
                        projectTasks.forEach((task) =>
                          addTaskToSprint({
                            taskId: task.id,
                            sprintId: targetSprint.id,
                            status: getInitialStatusForType(project.type),
                            projectId: task.project_id,
                          }),
                        )
                      }
                    >
                      <IconPlus size={12} aria-hidden="true" />
                      Adicionar todos
                    </Button>
                  )}
                </div>
              </div>
              {!isCollapsed && (
                <AnimatePresence>
                  {projectTasks.map((task) => (
                    <BacklogRow
                      key={task.id}
                      task={task}
                      projectPrefixById={projectPrefixById}
                      epicName={
                        task.epic_id
                          ? (epicNameById.get(task.epic_id) ?? null)
                          : null
                      }
                      onAddToSprint={
                        targetSprint
                          ? () =>
                              addTaskToSprint({
                                taskId: task.id,
                                sprintId: targetSprint.id,
                                status: getInitialStatusForType(project.type),
                                projectId: task.project_id,
                              })
                          : undefined
                      }
                    />
                  ))}
                </AnimatePresence>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
