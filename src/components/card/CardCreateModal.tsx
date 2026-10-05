import { IconPlus } from '@/lib/icons'
import { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/projects/useProjects'
import { useCreateTask } from '@/hooks/tasks/useCreateTask'
import { EpicSelector } from '@/components/epic/EpicSelector'
import { getInitialStatusForType, type TaskPriority } from '@/lib/board'
import type { ProjectType } from '@/lib/project'
import { useDebouncedValue } from '@/hooks/shared/useDebouncedValue'
import { useSimilarCards } from '@/hooks/tasks/useSimilarCards'
import { SimilarCardsHint } from './SimilarCardsHint'
import { RecurrenceFields, type RecurrenceValue } from './RecurrenceFields'
import { detectRecurrencePattern } from '@/lib/cardSearch'
import { TagInput } from './TagInput'
import { useProjectTags } from '@/hooks/tasks/tags/useProjectTags'
import { useSprints } from '@/hooks/sprints/useSprints'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const NONE_VALUE = '__backlog__'

type CardCreateModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialTitle?: string
  onCreated?: (task: Task) => void
  hideTrigger?: boolean
  initialProjectId?: string | null
}

export function CardCreateModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialProjectId,
  initialTitle,
  onCreated,
  hideTrigger = false,
}: CardCreateModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const [projectId, setProjectId] = useState<string | null>(
    initialProjectId ?? null,
  )
  const [epicId, setEpicId] = useState<string | null>(null)
  const [sprintId, setSprintId] = useState<string | null>(null)
  const [title, setTitle] = useState(initialTitle ?? '')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('média')
  const [flagged, setFlagged] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [recurrence, setRecurrence] = useState<RecurrenceValue>({
    type: null,
    interval: null,
    dayOfMonth: null,
    endDate: null,
  })
  const [recurrenceBannerDismissed, setRecurrenceBannerDismissed] =
    useState(false)

  const { data: projects } = useProjects()
  const { data: sprints } = useSprints()
  const { mutate: createTask, isPending } = useCreateTask()

  const project = projects?.find((p) => p.id === projectId)
  const debouncedTitle = useDebouncedValue(title, 300)
  const { data: similarCards } = useSimilarCards(debouncedTitle, projectId)
  const { data: tagSuggestions } = useProjectTags(projectId)

  const eligibleSprints = sprints?.filter(
    (s) => s.status === 'planned' || s.status === 'active',
  )

  const recurrenceDetected =
    !recurrenceBannerDismissed && detectRecurrencePattern(similarCards ?? [])

  function resetForm() {
    setProjectId(initialProjectId ?? null)
    setEpicId(null)
    setSprintId(null)
    setTitle('')
    setDescription('')
    setPriority('média')
    setFlagged(false)
    setRecurrence({
      type: null,
      interval: null,
      dayOfMonth: null,
      endDate: null,
    })
    setRecurrenceBannerDismissed(false)
    setTags([])
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm()
    if (isControlled) {
      controlledOnOpenChange?.(nextOpen)
    } else {
      setInternalOpen(nextOpen)
    }
  }

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open && initialTitle !== undefined) {
      setTitle(initialTitle)
    }
  }

  function buildTaskPayload() {
    if (!projectId || !title.trim() || !project) return null
    return {
      project_id: projectId,
      epic_id: epicId,
      sprint_id: sprintId,
      title: title.trim(),
      description: description.trim() || null,
      priority,
      flagged,
      status: getInitialStatusForType(project.type as ProjectType),
      recurrence_type: recurrence.type,
      recurrence_interval: recurrence.interval,
      recurrence_day_of_month: recurrence.dayOfMonth,
      recurrence_end_date: recurrence.endDate,
    }
  }

  function resetPartial() {
    setTitle('')
    setDescription('')
    setFlagged(false)
    setRecurrence({
      type: null,
      interval: null,
      dayOfMonth: null,
      endDate: null,
    })
    setRecurrenceBannerDismissed(false)
  }

  function handleSubmit() {
    const data = buildTaskPayload()
    if (!data) return
    createTask(
      { data, tags },
      {
        onSuccess: (task) => {
          onCreated?.(task)
          handleOpenChange(false)
        },
      },
    )
  }

  function handleSubmitAndAddAnother() {
    const data = buildTaskPayload()
    if (!data) return
    createTask(
      { data, tags },
      {
        onSuccess: () => {
          resetPartial()
          titleInputRef.current?.focus()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger render={<Button size="sm" />}>
          <IconPlus size={12} aria-hidden="true" />
          Novo Card
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo card</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span
              id="card-project-label"
              className="text-xs text-[--text-muted]"
            >
              Projeto
            </span>
            <Select
              value={projectId ?? ''}
              onValueChange={(v) => {
                setProjectId(v)
                setEpicId(null)
              }}
            >
              <SelectTrigger aria-labelledby="card-project-label">
                <SelectValue>
                  {project?.name ?? 'Selecionar projeto'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="card-title" className="text-xs text-[--text-muted]">
              Título
            </label>
            <Input
              id="card-title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do card"
              disabled={!projectId}
            />
            <SimilarCardsHint cards={similarCards ?? []} />
          </div>

          {project?.type === 'general' && (
            <div className="flex flex-col gap-2">
              {recurrenceDetected && (
                <div className="flex flex-col gap-2 rounded-md border border-accent bg-(--bg-surface) p-2 text-sm">
                  <span className="text-[--text-primary]">
                    ↻ Este card parece recorrente
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRecurrenceBannerDismissed(true)}
                    >
                      Criar mesmo assim
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setRecurrence({
                          type: 'monthly',
                          interval: 1,
                          dayOfMonth: null,
                          endDate: null,
                        })
                        setRecurrenceBannerDismissed(true)
                      }}
                    >
                      Criar como recorrência
                    </Button>
                  </div>
                </div>
              )}
              {!recurrenceDetected && (
                <RecurrenceFields value={recurrence} onChange={setRecurrence} />
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--text-muted]">Épico</span>
            {projectId ? (
              <EpicSelector
                projectId={projectId}
                value={epicId}
                onChange={setEpicId}
              />
            ) : (
              <span className="text-xs text-[--text-muted]">
                Selecione um projeto primeiro
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span
              id="card-sprint-label"
              className="text-xs text-[--text-muted]"
            >
              Sprint (opcional)
            </span>
            <Select
              value={sprintId ?? NONE_VALUE}
              onValueChange={(v) => setSprintId(v === NONE_VALUE ? null : v)}
            >
              <SelectTrigger aria-labelledby="card-sprint-label">
                <SelectValue>
                  {sprintId
                    ? (eligibleSprints?.find((s) => s.id === sprintId)?.name ??
                      'Sprint')
                    : 'Backlog (padrão)'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Backlog (padrão)</SelectItem>
                {eligibleSprints?.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--text-muted]">Tags</span>
            <TagInput
              tags={tags}
              onChange={setTags}
              suggestions={tagSuggestions ?? []}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--text-muted]">Prioridade</span>
            <div className="flex gap-1" role="group" aria-label="Prioridade">
              {PRIORITY_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={priority === option ? 'selected' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(option)}
                >
                  {option.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <label
            htmlFor="card-flagged"
            className="flex items-center gap-2 text-sm text-[--text-primary]"
          >
            <Checkbox
              id="card-flagged"
              checked={flagged}
              onCheckedChange={(checked) => setFlagged(checked === true)}
            />
            Marcar como urgente
          </label>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="card-description"
              className="text-xs text-[--text-muted]"
            >
              Descrição (opcional)
            </label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicionar contexto..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmitAndAddAnother}
            disabled={!projectId || !title.trim() || isPending}
          >
            Criar e adicionar outro
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!projectId || !title.trim() || isPending}
          >
            {isPending ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
