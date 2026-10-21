import { IconPlus, IconFlag } from '@/shared/lib/icons'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '@/features/tasks/lib/taskStatus'
import {
  PRIORITY_CONFIG,
  PRIORITY_ICON_SIZE,
} from '@/features/tasks/lib/taskPriority'
import { Button } from '@/components/ui/button'
import type { Task } from '@/features/tasks/model/task'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BACKLOG_TEXTS } from '@/features/backlog/constants/texts'
import type { ProjectLabels } from '@/features/projects/lib/project'
import { ProjectCode } from '@/features/projects/components/ProjectCode'
import { EpicChip } from '@/features/epics/components/EpicChip'
import type { EpicLabel } from '@/features/epics/lib/epic'
import type { ColorScope } from '@/shared/lib/palette'
import { AssigneeBadge } from '@/features/personas/components/AssigneeBadge'
import { DueBadge } from '@/features/tasks/components/DueBadge'
import { ImportanceBadge } from '@/features/tasks/components/ImportanceBadge'

type BacklogRowProps = {
  task: Task
  projectLabels: ProjectLabels
  epicLabel: EpicLabel | null
  colorScope: ColorScope
  onAddToSprint?: () => void
}

export function BacklogRow({
  task,
  projectLabels,
  epicLabel,
  colorScope,
  onAddToSprint,
}: BacklogRowProps) {
  const priority = PRIORITY_CONFIG[task.priority]
  const PriorityIcon = priority.icon

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
        className="flex flex-wrap items-center gap-3 rounded-md border border-l-4 border-border bg-card p-3 text-body-sm"
      >
        <div className="flex w-4 shrink-0 flex-col items-center gap-1">
          {task.flag && (
            <IconFlag
              size={PRIORITY_ICON_SIZE}
              className="text-danger"
              aria-label={COMMON_TEXTS.urgent}
            />
          )}
          <span title={priority.ariaLabel} className="inline-flex">
            <PriorityIcon
              size={PRIORITY_ICON_SIZE}
              className={priority.className}
              aria-label={priority.ariaLabel}
            />
          </span>
        </div>

        <div className="flex min-w-40 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {task.number && (
              <ProjectCode
                label={projectLabels.get(task.projectId)}
                taskNumber={task.number}
                withColor={colorScope === 'project'}
              />
            )}
            {epicLabel && (
              <EpicChip label={epicLabel} withSeparator={!!task.number} />
            )}
          </div>
          <Link
            to={`/cards/${task.id}`}
            className="wrap-break-word text-fg hover:text-accent hover:underline"
          >
            {task.title}
          </Link>
        </div>

        <DueBadge due={task.due} />
        <ImportanceBadge value={task.importance} />

        <span className="text-fg-muted">{STATUS_LABELS[task.status]}</span>

        <AssigneeBadge assigneeId={task.assigneeId} />

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
