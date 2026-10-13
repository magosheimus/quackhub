import { IconPlus, IconRefresh } from '@/shared/lib/icons'
import { UrgentToggle } from '@/features/tasks/components/UrgentToggle'
import { InlineHint } from '@/components/ui/inline-hint'
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
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useCreateTask } from '@/features/tasks/hooks/useCreateTask'
import { EpicSelector } from '@/features/epics/components/EpicSelector'
import { getInitialStatusForType } from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import { TASK_PRIORITIES } from '@/shared/lib/enums'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useSimilarCards } from '@/features/tasks/hooks/useSimilarCards'
import { SimilarCardsHint } from './SimilarCardsHint'
import { RecurrenceFields, type RecurrenceValue } from './RecurrenceFields'
import { detectRecurrencePattern } from '@/features/tasks/lib/cardSearch'
import { TagInput } from './TagInput'
import { useProjectTags } from '@/features/tasks/hooks/tags/useProjectTags'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import type { Task, TaskPriority } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { useCreateEpic } from '@/features/epics/hooks/useCreateEpic'
import { isStudyProject } from '@/features/projects/lib/project'
import { DEFAULT_PALETTE_COLOR } from '@/shared/lib/palette'
import { InfoTip } from '@/components/ui/info-tip'

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
  const [newEpicName, setNewEpicName] = useState<string | null>(null)
  const [epicId, setEpicId] = useState<string | null>(null)
  const [sprintId, setSprintId] = useState<string | null>(null)
  const [title, setTitle] = useState(initialTitle ?? '')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [flagged, setFlagged] = useState(false)
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [createAnother, setCreateAnother] = useState(false)
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
  const { mutateAsync: createEpic, isPending: isCreatingEpic } = useCreateEpic()

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
    setNewEpicName(null)
    setEpicId(null)
    setSprintId(null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setFlagged(false)
    setDueDate(null)
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
      due_date: project.type === 'general' ? dueDate : null,
      status: getInitialStatusForType(project.type),
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
    setDueDate(null)
    setRecurrence({
      type: null,
      interval: null,
      dayOfMonth: null,
      endDate: null,
    })
    setRecurrenceBannerDismissed(false)
  }

  async function resolveEpicId(): Promise<string | null> {
    const name = newEpicName?.trim()
    if (!name || !projectId) {
      return epicId
    }
    const epic = await createEpic({
      project_id: projectId,
      name,
      color: DEFAULT_PALETTE_COLOR,
    })
    setEpicId(epic.id)
    setNewEpicName(null)
    return epic.id
  }

  async function handleSubmit() {
    const data = buildTaskPayload()
    if (!data) return
    let resolvedEpicId: string | null
    try {
      resolvedEpicId = await resolveEpicId()
    } catch {
      // erro já exibido pelo MutationCache; não cria o card sem o épico
      return
    }
    createTask(
      { data: { ...data, epic_id: resolvedEpicId }, tags },
      {
        onSuccess: (task) => {
          if (createAnother) {
            resetPartial()
            titleInputRef.current?.focus()
            return
          }
          onCreated?.(task)
          handleOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger render={<Button size="sm" />}>
          <IconPlus size={12} aria-hidden="true" />
          {TASKS_TEXTS.newCardTitle}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-156">
        <DialogHeader>
          <DialogTitle>{TASKS_TEXTS.newCard}</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 **:data-[slot=select-trigger]:w-full">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span id="card-project-label" className="text-caption">
                {TASKS_TEXTS.project}
              </span>
              <Select
                value={projectId ?? ''}
                onValueChange={(v) => {
                  setProjectId(v)
                  setNewEpicName(null)
                  setEpicId(null)
                }}
              >
                <SelectTrigger aria-labelledby="card-project-label">
                  <SelectValue>
                    {project?.name ?? TASKS_TEXTS.selectProject}
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
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-caption">
                {TASKS_TEXTS.epic}
                <InfoTip text={TASKS_TEXTS.hintEpic} />
              </span>
              {projectId ? (
                <EpicSelector
                  newEpicName={newEpicName}
                  onNewEpicNameChange={setNewEpicName}
                  projectId={projectId}
                  value={epicId}
                  onChange={setEpicId}
                />
              ) : (
                <Select disabled>
                  <SelectTrigger aria-label={TASKS_TEXTS.epic}>
                    <SelectValue>{TASKS_TEXTS.selectProjectFirst}</SelectValue>
                  </SelectTrigger>
                </Select>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center gap-1.5">
                <span id="card-sprint-label" className="text-caption">
                  {TASKS_TEXTS.sprintOptional}
                </span>
                <InfoTip text={TASKS_TEXTS.hintSprint} />
              </span>
              <Select
                value={sprintId ?? NONE_VALUE}
                onValueChange={(v) => setSprintId(v === NONE_VALUE ? null : v)}
              >
                <SelectTrigger aria-labelledby="card-sprint-label">
                  <SelectValue>
                    {sprintId
                      ? (eligibleSprints?.find((s) => s.id === sprintId)
                          ?.name ?? TASKS_TEXTS.sprint)
                      : TASKS_TEXTS.backlogDefault}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>
                    {TASKS_TEXTS.backlogDefault}
                  </SelectItem>
                  {eligibleSprints?.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isStudyProject(project) && (
            <InlineHint icon={IconRefresh}>
              {TASKS_TEXTS.studyCardHint}
            </InlineHint>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="card-title" className="text-caption">
              {TASKS_TEXTS.title}
            </label>
            <Input
              id="card-title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={TASKS_TEXTS.titlePlaceholder}
              disabled={!projectId}
            />
            <SimilarCardsHint cards={similarCards ?? []} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-caption">{TASKS_TEXTS.priority}</span>
              <div
                className="flex gap-1"
                role="group"
                aria-label={TASKS_TEXTS.priority}
              >
                {TASK_PRIORITIES.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={priority === option ? 'selected' : 'outline'}
                    size="sm"
                    onClick={() => setPriority(option)}
                  >
                    {PRIORITY_CONFIG[option].text}
                  </Button>
                ))}
              </div>
              <UrgentToggle
                flagged={flagged}
                onToggle={() => setFlagged((current) => !current)}
                className="pt-1"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-caption">{TASKS_TEXTS.tags}</span>
              <TagInput
                tags={tags}
                onChange={setTags}
                suggestions={tagSuggestions ?? []}
              />
            </div>
          </div>

          {project?.type === 'general' && (
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="card-due-date" className="text-caption">
                  {TASKS_TEXTS.dueDate}
                </label>
                <Input
                  id="card-due-date"
                  type="date"
                  value={dueDate ?? ''}
                  onChange={(e) => setDueDate(e.target.value || null)}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                {!recurrence.type && (
                  <span className="flex items-center gap-1.5 text-caption">
                    {TASKS_TEXTS.recurrence}
                    <InfoTip text={TASKS_TEXTS.hintRecurrence} />
                  </span>
                )}
                {recurrenceDetected && (
                  <div className="flex flex-col gap-2 rounded-md border border-accent bg-surface p-2 text-sm">
                    <span className="text-fg">
                      {TASKS_TEXTS.looksRecurring}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRecurrenceBannerDismissed(true)}
                      >
                        {TASKS_TEXTS.createAnyway}
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
                        {TASKS_TEXTS.createAsRecurring}
                      </Button>
                    </div>
                  </div>
                )}
                {!recurrenceDetected && (
                  <RecurrenceFields
                    value={recurrence}
                    onChange={setRecurrence}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="card-description" className="text-caption">
              {TASKS_TEXTS.descriptionOptional}
            </label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={TASKS_TEXTS.descriptionPlaceholder}
            />
          </div>
        </div>

        <DialogFooter>
          <label className="flex items-center gap-2 text-caption sm:mr-auto">
            <Checkbox
              checked={createAnother}
              onCheckedChange={(checked) => setCreateAnother(checked === true)}
            />
            {TASKS_TEXTS.createAnother}
          </label>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !projectId || !title.trim() || isPending || isCreatingEpic
            }
          >
            {isPending || isCreatingEpic
              ? COMMON_TEXTS.creating
              : COMMON_TEXTS.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
