import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from '@/features/tasks/components/TagInput'
import {
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
} from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import { isTaskPriority, TASK_PRIORITIES } from '@/shared/lib/enums'
import type {
  Epic,
  Sprint,
  Task,
  TaskPriority,
  TaskUpdate,
} from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

const NONE_EPIC = '__none__'
const NONE_SPRINT = '__none__'
const INLINE_TRIGGER_CLASS =
  'h-auto! w-fit! border! border-transparent! bg-transparent! p-0! shadow-none! data-[popup-open]:border-border! data-[popup-open]:bg-input! data-[popup-open]:px-2! data-[popup-open]:py-1!'

type CardDetailsSectionProps = {
  projectType?: string | null
  status: Task['status']
  priority: TaskPriority
  flagged: boolean
  epicId: string | null
  epicName?: string
  epics?: Epic[]
  sprintId: string | null
  sprints?: Sprint[]
  tags: string[]
  tagSuggestions: string[]
  onUpdate: (data: TaskUpdate) => void
  onTagsChange: (tags: string[]) => void
}

export function CardDetailsSection({
  projectType,
  status,
  priority,
  flagged,
  epicId,
  epicName,
  epics,
  sprintId,
  sprints,
  tags,
  tagSuggestions,
  onUpdate,
  onTagsChange,
}: CardDetailsSectionProps) {
  const sprintName = sprints?.find((s) => s.id === sprintId)?.name

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-3">
      <span className="text-sm font-medium text-fg">{TASKS_TEXTS.details}</span>

      <div className="grid grid-cols-2 gap-4 pl-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-muted">
              {TASKS_TEXTS.typeLabel}
            </span>
            <span className="text-sm text-fg">
              {projectType === 'study'
                ? PROJECT_TYPE_LABELS.study
                : PROJECT_TYPE_LABELS.general}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span id="epic-label" className="text-xs text-fg-muted">
              {TASKS_TEXTS.epicLabel}
            </span>
            <Select
              value={epicId ?? NONE_EPIC}
              onValueChange={(v) =>
                onUpdate({ epic_id: v === NONE_EPIC ? null : v })
              }
            >
              <SelectTrigger
                aria-labelledby="epic-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>{epicName ?? TASKS_TEXTS.none}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_EPIC}>{TASKS_TEXTS.none}</SelectItem>
                {epics?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <span id="sprint-label" className="text-xs text-fg-muted">
              {TASKS_TEXTS.sprintLabel}
            </span>
            <Select
              value={sprintId ?? NONE_SPRINT}
              onValueChange={(v) =>
                onUpdate({ sprint_id: v === NONE_SPRINT ? null : v })
              }
            >
              <SelectTrigger
                aria-labelledby="sprint-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>{sprintName ?? COMMON_TEXTS.backlog}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_SPRINT}>
                  {COMMON_TEXTS.backlog}
                </SelectItem>
                {sprints?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <span id="priority-label" className="text-xs text-fg-muted">
              {TASKS_TEXTS.priorityLabel}
            </span>
            <Select
              value={priority}
              onValueChange={(v) => {
                if (isTaskPriority(v)) {
                  onUpdate({ priority: v })
                }
              }}
            >
              <SelectTrigger
                aria-labelledby="priority-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>{PRIORITY_CONFIG[priority].text}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TASK_PRIORITIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {PRIORITY_CONFIG[option].text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span id="flagged-label" className="text-xs text-fg-muted">
              {TASKS_TEXTS.urgentLabel}
            </span>
            <Checkbox
              checked={flagged}
              onCheckedChange={(checked) =>
                onUpdate({ flagged: checked === true })
              }
              aria-labelledby="flagged-label"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-muted">
              {TASKS_TEXTS.statusLabel}
            </span>
            <span
              className={`rounded-sm px-2 py-0.5 text-xs font-medium text-page ${
                STATUS_BADGE_CLASS[status]
              }`}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-muted">
              {TASKS_TEXTS.tagsLabel}
            </span>
            <TagInput
              tags={tags}
              onChange={onTagsChange}
              suggestions={tagSuggestions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
