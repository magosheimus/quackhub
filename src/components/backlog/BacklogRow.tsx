import { Flag } from 'lucide-react'
import { PRIORITY_CONFIG, COLUMN_LABELS, type TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Task = Database['public']['Tables']['tasks']['Row']

type BacklogRowProps = {
  task: Task
  projectPrefixById: Map<string, string>
  epicName: string | null
  onAddToSprint?: () => void
}

export function BacklogRow({
  task,
  projectPrefixById,
  epicName,
  onAddToSprint,
}: BacklogRowProps) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  const PriorityIcon = priority.icon
  const projectPrefix = projectPrefixById.get(task.project_id) ?? ''
  const [isLeaving, setIsLeaving] = useState(false)

  function handleAddToSprint() {
    if (!onAddToSprint) return
    setIsLeaving(true)
    setTimeout(onAddToSprint, 150)
  }

  return (
    <div
      style={{ borderLeftColor: `var(${priority.colorVar})` }}
      className={`flex items-center gap-3 rounded-[--radius-md] border border-l-4 border-[--border] bg-[--bg-card] p-3 text-sm transition-opacity duration-150 motion-reduce:transition-none ${
        isLeaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex w-4 shrink-0 flex-col items-center gap-1">
        {task.flagged && (
          <Flag
            size={14}
            className="text-[--signal-danger]"
            aria-label="Urgente"
          />
        )}
        <PriorityIcon
          size={14}
          className={priority.className}
          aria-label={priority.ariaLabel}
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        {task.task_number && (
          <span className="text-xs text-[--text-muted]">
            {projectPrefix}-{task.task_number}
          </span>
        )}
        <span className="text-[--text-primary]">{task.title}</span>
      </div>

      <span className="text-xs text-[--text-muted]">
        {COLUMN_LABELS[task.status] ?? task.status}
      </span>

      {epicName && (
        <span className="text-xs text-[--text-muted]">{epicName}</span>
      )}

      {onAddToSprint && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToSprint}
          disabled={isLeaving}
        >
          + Adicionar à Sprint
        </Button>
      )}
    </div>
  )
}
