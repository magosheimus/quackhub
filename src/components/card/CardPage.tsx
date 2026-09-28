import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTaskById } from '@/hooks/tasks/useTaskById'
import { useUpdateTask } from '@/hooks/tasks/useUpdateTask'
import { useProjects } from '@/hooks/projects/useProjects'
import { useEpics } from '@/hooks/epics/useEpics'
import { useTaskTags } from '@/hooks/tasks/tags/useTaskTags'
import { useAddTaskTag } from '@/hooks/tasks/tags/useAddTaskTag'
import { useRemoveTaskTag } from '@/hooks/tasks/tags/useRemoveTaskTag'
import { useProjectTags } from '@/hooks/tasks/tags/useProjectTags'
import { TagInput } from './TagInput'
import { RecurrenceFields, type RecurrenceValue } from './RecurrenceFields'
import { CardChecklist } from './CardChecklist'
import { CardDependencies } from './CardDependencies'
import { PRIORITY_CONFIG, type TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const NONE_EPIC = '__none__'

export function CardPage() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading } = useTaskById(id ?? '')

  if (isLoading) {
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
  }

  if (!task) {
    return (
      <div className="text-sm text-[--text-muted]">— Card não encontrado —</div>
    )
  }

  return <CardPageBody key={task.id} task={task} />
}

function CardPageBody({ task }: { task: Task }) {
  const [title, setTitle] = useState(task.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const navigate = useNavigate()
  const { mutate: updateTask } = useUpdateTask()
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === task.project_id)
  const { data: epics } = useEpics(task.project_id)
  const epic = epics?.find((e) => e.id === task.epic_id)
  const { data: tags } = useTaskTags(task.id)
  const { data: tagSuggestions } = useProjectTags(task.project_id)
  const { mutate: addTaskTag } = useAddTaskTag()
  const { mutate: removeTaskTag } = useRemoveTaskTag()

  function handleTitleBlur() {
    setIsEditingTitle(false)
    const trimmed = title.trim()
    if (!trimmed || trimmed === task.title) {
      setTitle(task.title)
      return
    }
    updateTask({ id: task.id, data: { title: trimmed } })
  }

  const [description, setDescription] = useState(task.description ?? '')

  function handleDescriptionBlur() {
    const trimmed = description.trim()
    if (trimmed === (task.description ?? '')) return
    updateTask({ id: task.id, data: { description: trimmed || null } })
  }

  function handleTagsChange(newTags: string[]) {
    const current = tags ?? []
    const added = newTags.filter((t) => !current.includes(t))
    const removed = current.filter((t) => !newTags.includes(t))
    added.forEach((tagName) => addTaskTag({ taskId: task.id, tagName }))
    removed.forEach((tagName) => removeTaskTag({ taskId: task.id, tagName }))
  }

  const recurrenceValue: RecurrenceValue = {
    type: task.recurrence_type as RecurrenceValue['type'],
    interval: task.recurrence_interval,
    dayOfMonth: task.recurrence_day_of_month,
    endDate: task.recurrence_end_date,
  }

  function handleRecurrenceChange(value: RecurrenceValue) {
    updateTask({
      id: task.id,
      data: {
        recurrence_type: value.type,
        recurrence_interval: value.interval,
        recurrence_day_of_month: value.dayOfMonth,
        recurrence_end_date: value.endDate,
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={14} /> Voltar
      </Button>

      <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-4">
          {task.task_number && (
            <span className="text-xs text-[--text-muted]">
              {epic ? `${epic.name}/` : ''}
              {project?.prefix}-{task.task_number}
            </span>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsEditingTitle(true)}
            onBlur={handleTitleBlur}
            aria-label="Título do card"
            className={`rounded-[--radius-md] px-2 py-1 font-heading text-2xl text-[--text-primary] outline-none ${
              isEditingTitle
                ? 'border border-[--border] bg-[--bg-input] shadow-[inset_1px_1px_2px_color-mix(in_srgb,var(--lcd-ink)_20%,transparent),inset_-1px_-1px_0_color-mix(in_srgb,var(--lcd-screen)_40%,transparent)]'
                : 'border! border-transparent! bg-transparent! shadow-none!'
            }`}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="card-description"
              className="text-xs text-[--text-muted]"
            >
              Descrição
            </label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Adicionar contexto..."
            />
          </div>
          <CardChecklist taskId={task.id} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--text-muted]">Tags</span>
            <TagInput
              tags={tags ?? []}
              onChange={handleTagsChange}
              suggestions={tagSuggestions ?? []}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="priority-label" className="text-xs text-[--text-muted]">
              Prioridade
            </span>
            <Select
              value={task.priority}
              onValueChange={(v) =>
                updateTask({
                  id: task.id,
                  data: { priority: v as TaskPriority },
                })
              }
            >
              <SelectTrigger aria-labelledby="priority-label">
                <SelectValue>
                  {PRIORITY_CONFIG[task.priority as TaskPriority].text}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {PRIORITY_CONFIG[option].text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.flagged}
              onCheckedChange={(checked) =>
                updateTask({
                  id: task.id,
                  data: { flagged: checked === true },
                })
              }
              aria-labelledby="flagged-label"
            />
            <span id="flagged-label" className="text-xs text-[--text-muted]">
              Urgente
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="epic-label" className="text-xs text-[--text-muted]">
              Épico
            </span>
            <Select
              value={task.epic_id ?? NONE_EPIC}
              onValueChange={(v) =>
                updateTask({
                  id: task.id,
                  data: { epic_id: v === NONE_EPIC ? null : v },
                })
              }
            >
              <SelectTrigger aria-labelledby="epic-label">
                <SelectValue>{epic ? epic.name : 'Nenhum'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_EPIC}>Nenhum</SelectItem>
                {epics?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {project?.type === 'general' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="card-due-date"
                  className="text-xs text-[--text-muted]"
                >
                  Due Date
                </label>
                <Input
                  id="card-due-date"
                  type="date"
                  value={task.due_date ?? ''}
                  onChange={(e) =>
                    updateTask({
                      id: task.id,
                      data: { due_date: e.target.value || null },
                    })
                  }
                />
              </div>

              <RecurrenceFields
                value={recurrenceValue}
                onChange={handleRecurrenceChange}
              />
            </>
          )}

          <CardDependencies taskId={task.id} projectId={task.project_id} />
        </div>
      </div>
    </div>
  )
}
