import { Flag } from 'lucide-react'
import { PRIORITY_CONFIG, COLUMN_LABELS, type TaskPriority } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type BacklogRowProps = {
  task: Task
  projectPrefix: string
  epicName: string | null
}

export function BacklogRow({ task, projectPrefix, epicName }: BacklogRowProps) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  const PriorityIcon = priority.icon

  return (
    <div
      style={{ borderLeftColor: `var(${priority.colorVar})` }}
      className="flex items-center gap-3 rounded-[--radius-md] border border-l-4 border-[--border] bg-[--bg-card] p-3 text-sm"
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
    </div>
  )
}
