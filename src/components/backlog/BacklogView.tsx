import { useSearchParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from '@/hooks/projects/useProjects'
import { useEpics } from '@/hooks/epics/useEpics'
import { useBacklogTasks } from '@/hooks/tasks/useBacklogTasks'
import {
  COLUMN_LABELS,
  type TaskStatus,
  type TaskPriority,
  getInitialStatusForType,
} from '@/lib/board'
import { BacklogRow } from './BacklogRow'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useAddTaskToSprint } from '@/hooks/tasks/sprint/useAddTaskToSprint'
import type { ProjectType } from '@/lib/project'
import { useSprints } from '@/hooks/sprints/useSprints'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const STATUS_OPTIONS: TaskStatus[] = [
  'to_study',
  'studying',
  'scheduled',
  'to_review',
  'todo',
  'doing',
  'blocked',
  'done',
]
const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const NONE_VALUE = '__all__'

export function BacklogView() {
  const [searchParams] = useSearchParams()

  const [projectFilter, setProjectFilter] = useState<string | null>(
    searchParams.get('project') || null,
  )
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(
    (searchParams.get('status') as TaskStatus) || null,
  )
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(
    null,
  )
  const [epicFilter, setEpicFilter] = useState<string | null>(null)

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
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
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
      <div className="flex flex-wrap gap-2">
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
          onValueChange={(v) =>
            setStatusFilter(v === NONE_VALUE ? null : (v as TaskStatus))
          }
        >
          <SelectTrigger>
            <SelectValue>
              {statusFilter ? COLUMN_LABELS[statusFilter] : 'Todos os status'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todos os status</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {COLUMN_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter ?? NONE_VALUE}
          onValueChange={(v) =>
            setPriorityFilter(v === NONE_VALUE ? null : (v as TaskPriority))
          }
        >
          <SelectTrigger>
            <SelectValue>
              {priorityFilter
                ? priorityFilter.toUpperCase()
                : 'Todas as prioridades'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todas as prioridades</SelectItem>
            {PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.toUpperCase()}
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

      <div className="flex flex-col gap-2">
        {isLoadingTasks && (
          <div className="text-sm text-[--text-muted]">
            [ CARREGANDO........ ]
          </div>
        )}
        {!isLoadingTasks && filteredTasks.length === 0 && (
          <div className="text-sm text-[--text-muted]">
            — nenhum card no backlog —
          </div>
        )}
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const taskProject = projectById.get(task.project_id)
            return (
              <BacklogRow
                key={task.id}
                task={task}
                projectPrefixById={projectPrefixById}
                epicName={
                  task.epic_id ? (epicNameById.get(task.epic_id) ?? null) : null
                }
                onAddToSprint={
                  targetSprint && taskProject
                    ? () =>
                        addTaskToSprint({
                          taskId: task.id,
                          sprintId: targetSprint.id,
                          status: getInitialStatusForType(
                            taskProject.type as ProjectType,
                          ),
                          projectId: task.project_id,
                        })
                    : undefined
                }
              />
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
