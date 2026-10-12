import { IconPlus, IconFlag } from '@/shared/lib/icons'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import { Button } from '@/components/ui/button'
import type { Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BACKLOG_TEXTS } from '@/features/backlog/constants/texts'

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
  const priority = PRIORITY_CONFIG[task.priority]
  const PriorityIcon = priority.icon
  const projectPrefix = projectPrefixById.get(task.project_id) ?? ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      style={{ overflow: 'hidden' }}
    >
      <div
        style={{ borderLeftColor: `var(${priority.colorVar})` }}
        className="flex flex-wrap items-center gap-3 rounded-md border border-l-4 border-border bg-card p-3 text-sm"
      >
        <div className="flex w-4 shrink-0 flex-col items-center gap-1">
          {task.flagged && (
            <IconFlag
              size={12}
              className="text-danger"
              aria-label={COMMON_TEXTS.urgent}
            />
          )}
          <span title={priority.ariaLabel} className="inline-flex">
            <PriorityIcon
              size={12}
              className={priority.className}
              aria-label={priority.ariaLabel}
            />
          </span>
        </div>

        <div className="flex min-w-40 flex-1 flex-col gap-0.5">
          {task.task_number && (
            <span className="text-caption">
              {projectPrefix}-{task.task_number}
            </span>
          )}
          <Link
            to={`/cards/${task.id}`}
            className="wrap-break-word text-fg hover:text-accent hover:underline"
          >
            {task.title}
          </Link>
        </div>

        <span className="text-caption">{STATUS_LABELS[task.status]}</span>

        {epicName && <span className="text-caption">{epicName}</span>}

        {onAddToSprint && (
          <Button variant="outline" size="sm" onClick={onAddToSprint}>
            <IconPlus size={12} aria-hidden="true" />
            {BACKLOG_TEXTS.addToSprint}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
