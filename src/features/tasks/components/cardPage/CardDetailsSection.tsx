import { IconInfo } from '@/shared/lib/icons'
import { ColorDot } from '@/components/ui/color-dot'
import type { EpicLabel, EpicOption } from '@/features/epics/lib/epic'
import { SectionLabel } from '@/components/ui/section-label'
import type { ReactNode } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from '@/features/tasks/components/TagInput'
import { UrgentToggle } from '@/features/tasks/components/UrgentToggle'
import {
  getStatusOptions,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
} from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import {
  isTaskPriority,
  isTaskStatus,
  TASK_PRIORITIES,
} from '@/shared/lib/enums'
import type {
  ProjectType,
  Sprint,
  TaskPriority,
  TaskStatus,
  TaskUpdate,
} from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { PROJECT_TYPE_LABELS } from '@/features/projects/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/ui/panel'
import { cn } from '@/shared/lib/utils'
import type { ProjectOption } from '@/features/projects/lib/project'

const NONE_EPIC = '__none__'
const NONE_SPRINT = '__none__'
const INLINE_TRIGGER_CLASS =
  'h-auto! w-fit! border! border-transparent! bg-transparent! p-0! shadow-none! data-[popup-open]:border-border! data-[popup-open]:bg-input! data-[popup-open]:px-2! data-[popup-open]:py-1!'

type CardDetailsSectionProps = {
  projectId: string
  projectName?: string
  projectOptions: ProjectOption[]
  onProjectChange: (projectId: string) => void
  projectType?: ProjectType | null
  status: TaskStatus
  priority: TaskPriority
  flagged: boolean
  epicId: string | null
  epicLabel?: EpicLabel
  epicOptions: EpicOption[]
  sprintId: string | null
  sprints?: Sprint[]
  tags: string[]
  tagSuggestions: string[]
  onUpdate: (data: TaskUpdate) => void
  onStatusChange: (status: TaskStatus) => void
  onTagsChange: (tags: string[]) => void
}

type DetailRowProps = {
  label: string
  labelId?: string
  children: ReactNode
}

function DetailRow({ label, labelId, children }: DetailRowProps) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span id={labelId} className="shrink-0 text-caption">
        {label}
      </span>
      {children}
    </div>
  )
}

export function CardDetailsSection({
  projectId,
  projectName,
  projectOptions,
  onProjectChange,
  projectType,
  status,
  priority,
  flagged,
  epicId,
  epicLabel,
  epicOptions,
  sprintId,
  sprints,
  tags,
  tagSuggestions,
  onUpdate,
  onStatusChange,
  onTagsChange,
}: CardDetailsSectionProps) {
  const sprintName = sprints?.find((s) => s.id === sprintId)?.name

  return (
    <Panel className="flex flex-col gap-3 p-3">
      <SectionLabel icon={IconInfo}>{TASKS_TEXTS.details}</SectionLabel>

      <div className="grid grid-cols-1 gap-4 pl-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <DetailRow label={TASKS_TEXTS.projectLabel} labelId="project-label">
            <Select
              value={projectId}
              onValueChange={(value) => {
                if (value) {
                  onProjectChange(value)
                }
              }}
            >
              <SelectTrigger
                aria-labelledby="project-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>{projectName}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <ColorDot color={option.color} />
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DetailRow>
          <DetailRow label={TASKS_TEXTS.typeLabel}>
            <span className="text-sm text-fg">
              {PROJECT_TYPE_LABELS[projectType ?? 'general']}
            </span>
          </DetailRow>
          <DetailRow label={TASKS_TEXTS.epicLabel} labelId="epic-label">
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
                <SelectValue>
                  {epicLabel ? (
                    <>
                      <ColorDot color={epicLabel.color} />
                      {epicLabel.name}
                    </>
                  ) : (
                    TASKS_TEXTS.none
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_EPIC}>{TASKS_TEXTS.none}</SelectItem>
                {epicOptions.map((epic) => (
                  <SelectItem key={epic.id} value={epic.id}>
                    <ColorDot color={epic.color} />
                    {epic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DetailRow>
          <DetailRow label={TASKS_TEXTS.sprintLabel} labelId="sprint-label">
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
          </DetailRow>
          <DetailRow label={TASKS_TEXTS.priorityLabel} labelId="priority-label">
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
          </DetailRow>
          <UrgentToggle
            flagged={flagged}
            onToggle={() => onUpdate({ flagged: !flagged })}
          />
        </div>

        <div className="flex flex-col gap-3">
          <DetailRow label={TASKS_TEXTS.statusLabel} labelId="status-label">
            <Select
              value={status}
              onValueChange={(v) => {
                if (isTaskStatus(v)) {
                  onStatusChange(v)
                }
              }}
            >
              <SelectTrigger
                aria-labelledby="status-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>
                  <span
                    className={cn(
                      'rounded-sm px-2 py-0.5 text-xs font-medium text-page',
                      STATUS_BADGE_CLASS[status],
                    )}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions(projectType).map((option) => (
                  <SelectItem key={option} value={option}>
                    {STATUS_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DetailRow>
          <DetailRow label={TASKS_TEXTS.tagsLabel}>
            <TagInput
              tags={tags}
              onChange={onTagsChange}
              suggestions={tagSuggestions}
            />
          </DetailRow>
        </div>
      </div>
    </Panel>
  )
}
