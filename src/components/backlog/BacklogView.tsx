// src/components/backlog/BacklogView.tsx
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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
import { COLUMN_LABELS, type TaskStatus, type TaskPriority } from '@/lib/board'
import { BacklogRow } from './BacklogRow'

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
  const { id: projectId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(
    (searchParams.get('status') as TaskStatus) || null,
  )
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(
    null,
  )
  const [epicFilter, setEpicFilter] = useState<string | null>(null)

  const { data: projects, isLoading: isLoadingProjects } = useProjects()
  const { data: tasks, isLoading: isLoadingTasks } = useBacklogTasks(
    projectId ?? '',
  )
  const { data: epics } = useEpics(projectId ?? '')

  const project = projects?.find((p) => p.id === projectId)

  if (isLoadingProjects) {
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
  }

  if (!projectId || !project) {
    return (
      <div className="text-sm text-[--text-muted]">
        — Projeto não encontrado —
      </div>
    )
  }

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
        {filteredTasks.map((task) => (
          <BacklogRow
            key={task.id}
            task={task}
            projectPrefix={project.prefix ?? ''}
            epicName={
              task.epic_id ? (epicNameById.get(task.epic_id) ?? null) : null
            }
          />
        ))}
      </div>
    </div>
  )
}
