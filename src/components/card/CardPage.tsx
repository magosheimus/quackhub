import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
} from '@/lib/icons'
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
import { CardAttachments } from './CardAttachments'
import { CardHistory } from './CardHistory'
import {
  PRIORITY_CONFIG,
  COLUMN_LABELS,
  STATUS_BADGE_CLASS,
  type TaskPriority,
} from '@/lib/board'
import { useSprints } from '@/hooks/sprints/useSprints'
import type { Database } from '@/types/database.types'
import { RegisterPerformanceModal } from '@/components/srs/RegisterPerformanceModal'
import { LoadingText } from '../ui/loading-text'

type Task = Database['public']['Tables']['tasks']['Row']

const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const NONE_EPIC = '__none__'
const NONE_SPRINT = '__none__'
const INLINE_TRIGGER_CLASS =
  'h-auto! w-fit! border! border-transparent! bg-transparent! p-0! shadow-none! data-[popup-open]:border-(--border)! data-[popup-open]:bg-[var(--bg-input)]! data-[popup-open]:px-2! data-[popup-open]:py-1!'
const SRS_ELIGIBLE_STATUSES: Task['status'][] = [
  'studying',
  'to_review',
  'scheduled',
]

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR')
}

export function CardPage() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading } = useTaskById(id ?? '')

  if (isLoading) {
    return <LoadingText />
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
  const [isSrsModalOpen, setIsSrsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const navigate = useNavigate()
  const { mutate: updateTask } = useUpdateTask()
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === task.project_id)
  const { data: epics } = useEpics(task.project_id)
  const epic = epics?.find((e) => e.id === task.epic_id)
  const { data: sprints } = useSprints()
  const assignableSprints = sprints?.filter((s) => s.status !== 'closed')
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
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <IconArrowLeft size={16} />
        </Button>

        <IconFolder size={24} className="shrink-0 text-[--text-muted]" />

        <div className="flex flex-col gap-0.5">
          {task.task_number && (
            <span className="ml-2 text-xs text-[--text-muted]">
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
            className={`-mt-2 rounded-md px-2 py-0 font-heading text-3xl leading-tight text-[--text-primary] outline-none ${
              isEditingTitle
                ? 'border border-border bg-(--bg-input) shadow-[inset_1px_1px_2px_color-mix(in_srgb,var(--lcd-ink)_20%,transparent),inset_-1px_-1px_0_color-mix(in_srgb,var(--lcd-screen)_40%,transparent)]'
                : 'border! border-transparent! bg-transparent! shadow-none!'
            }`}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsDetailsOpen((open) => !open)}
              className="flex w-fit items-center gap-1 text-sm font-medium text-[--text-primary]"
            >
              {isDetailsOpen ? (
                <IconChevronDown size={12} />
              ) : (
                <IconChevronRight size={12} />
              )}
              Detalhes
            </button>
            {isDetailsOpen && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[--text-muted]">Tipo:</span>
                    <span className="text-sm text-[--text-primary]">
                      {project?.type === 'study' ? 'Estudo' : 'Geral'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      id="epic-label"
                      className="text-xs text-[--text-muted]"
                    >
                      Épico:
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
                      <SelectTrigger
                        aria-labelledby="epic-label"
                        className={INLINE_TRIGGER_CLASS}
                      >
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

                  <div className="flex items-center gap-1.5">
                    <span
                      id="sprint-label"
                      className="text-xs text-[--text-muted]"
                    >
                      Sprint:
                    </span>
                    <Select
                      value={task.sprint_id ?? NONE_SPRINT}
                      onValueChange={(v) =>
                        updateTask({
                          id: task.id,
                          data: { sprint_id: v === NONE_SPRINT ? null : v },
                        })
                      }
                    >
                      <SelectTrigger
                        aria-labelledby="sprint-label"
                        className={INLINE_TRIGGER_CLASS}
                      >
                        <SelectValue>
                          {assignableSprints?.find(
                            (s) => s.id === task.sprint_id,
                          )?.name ?? 'Backlog'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_SPRINT}>Backlog</SelectItem>
                        {assignableSprints?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      id="priority-label"
                      className="text-xs text-[--text-muted]"
                    >
                      Prioridade:
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
                      <SelectTrigger
                        aria-labelledby="priority-label"
                        className={INLINE_TRIGGER_CLASS}
                      >
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
                    <span
                      id="flagged-label"
                      className="text-xs text-[--text-muted]"
                    >
                      Urgente:
                    </span>
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
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[--text-muted]">
                      Situação:
                    </span>
                    <span
                      className={`rounded-(--radius-sm) px-2 py-0.5 text-xs font-medium text-(--bg-page) ${
                        STATUS_BADGE_CLASS[task.status] ?? 'bg-(--text-muted)'
                      }`}
                    >
                      {COLUMN_LABELS[task.status] ?? task.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[--text-muted]">Tags:</span>
                    <TagInput
                      tags={tags ?? []}
                      onChange={handleTagsChange}
                      suggestions={tagSuggestions ?? []}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="card-description"
              className="text-sm font-medium text-[--text-primary]"
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

          <CardAttachments taskId={task.id} />

          <CardChecklist taskId={task.id} />

          <CardDependencies taskId={task.id} projectId={task.project_id} />

          <CardHistory taskId={task.id} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 rounded-md border border-border bg-(--bg-card) p-3">
            <span className="text-xs text-[--text-muted]">Datas</span>
            <span className="text-sm text-[--text-primary]">
              Criado: {formatDate(task.created_at)}
            </span>
            <span className="text-sm text-[--text-primary]">
              Atualizado: {formatDate(task.updated_at)}
            </span>
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

          {project?.type === 'study' &&
            SRS_ELIGIBLE_STATUSES.includes(task.status) && (
              <div className="flex flex-col gap-1.5 rounded-md border border-border bg-(--bg-card) p-3">
                <span className="text-xs text-[--text-muted]">SRS</span>
                <span className="text-sm text-[--text-primary]">
                  EF: {(task.ease_factor ?? 2.5).toFixed(2)}
                </span>
                <span className="text-sm text-[--text-primary]">
                  Próxima revisão: {task.next_review ?? '—'}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsSrsModalOpen(true)}
                >
                  Registrar Desempenho
                </Button>
              </div>
            )}
        </div>
      </div>

      <RegisterPerformanceModal
        task={task}
        open={isSrsModalOpen}
        onOpenChange={setIsSrsModalOpen}
      />
    </div>
  )
}
