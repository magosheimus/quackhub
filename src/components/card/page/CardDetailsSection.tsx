import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from '../TagInput'
import {
  PRIORITY_CONFIG,
  COLUMN_LABELS,
  STATUS_BADGE_CLASS,
  type TaskPriority,
} from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']
type Epic = Database['public']['Tables']['epics']['Row']
type Sprint = Database['public']['Tables']['sprints']['Row']

const PRIORITY_OPTIONS: TaskPriority[] = ['alta', 'média', 'baixa']
const NONE_EPIC = '__none__'
const NONE_SPRINT = '__none__'
const INLINE_TRIGGER_CLASS =
  'h-auto! w-fit! border! border-transparent! bg-transparent! p-0! shadow-none! data-[popup-open]:border-(--border)! data-[popup-open]:bg-(--bg-input)! data-[popup-open]:px-2! data-[popup-open]:py-1!'

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
    <div className="flex flex-col gap-3 rounded-md border border-border bg-(--bg-card) p-3">
      <span className="text-sm font-medium text-(--text-primary)">
        Detalhes
      </span>

      <div className="grid grid-cols-2 gap-4 pl-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-(--text-muted)">Tipo:</span>
            <span className="text-sm text-(--text-primary)">
              {projectType === 'study' ? 'Estudo' : 'Geral'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span id="epic-label" className="text-xs text-(--text-muted)">
              Épico:
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
                <SelectValue>{epicName ?? 'Nenhum'}</SelectValue>
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
            <span id="sprint-label" className="text-xs text-(--text-muted)">
              Sprint:
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
                <SelectValue>{sprintName ?? 'Backlog'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_SPRINT}>Backlog</SelectItem>
                {sprints?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <span id="priority-label" className="text-xs text-(--text-muted)">
              Prioridade:
            </span>
            <Select
              value={priority}
              onValueChange={(v) => onUpdate({ priority: v as TaskPriority })}
            >
              <SelectTrigger
                aria-labelledby="priority-label"
                className={INLINE_TRIGGER_CLASS}
              >
                <SelectValue>{PRIORITY_CONFIG[priority].text}</SelectValue>
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
            <span id="flagged-label" className="text-xs text-(--text-muted)">
              Urgente:
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
            <span className="text-xs text-(--text-muted)">Situação:</span>
            <span
              className={`rounded-(--radius-sm) px-2 py-0.5 text-xs font-medium text-(--bg-page) ${
                STATUS_BADGE_CLASS[status] ?? 'bg-(--text-muted)'
              }`}
            >
              {COLUMN_LABELS[status] ?? status}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-(--text-muted)">Tags:</span>
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
