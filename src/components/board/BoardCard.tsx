import { Draggable } from '@hello-pangea/dnd'
import { Link } from 'react-router-dom'
import { IconFlag } from '@/lib/icons'
import {
  COLUMN_LABELS,
  PRIORITY_CONFIG,
  STATUS_BADGE_CLASS,
  type TaskPriority,
} from '@/lib/board'
import type { Database } from '@/types/database.types'
import type { ReactNode } from 'react'

type Task = Database['public']['Tables']['tasks']['Row']

const CARD_CLASS =
  'flex gap-2 rounded-md border border-l-4 border-border bg-(--bg-card) p-3 text-sm hover:bg-(--bg-card-hover)'

function getBorderStyle(task: Task) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  return { borderLeftColor: `var(${priority.colorVar})` }
}

type BoardCardBodyProps = {
  task: Task
  projectPrefixById: Map<string, string>
  showStatus?: boolean
}

function BoardCardBody({
  task,
  projectPrefixById,
  showStatus = false,
}: BoardCardBodyProps) {
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority]
  const PriorityIcon = priority.icon
  const projectPrefix = projectPrefixById.get(task.project_id) ?? ''

  return (
    <>
      <div className="flex w-4 shrink-0 flex-col items-center gap-1 pt-0.5">
        {task.flagged && (
          <IconFlag
            size={12}
            className="text-(--signal-danger)"
            aria-label="Urgente"
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

      <div className="flex flex-col gap-1">
        {task.task_number && (
          <span className="text-xs text-(--text-muted)">
            {projectPrefix}-{task.task_number}
          </span>
        )}
        <Link
          to={`/cards/${task.id}`}
          className="line-clamp-3 text-(--text-primary) hover:text-accent hover:underline"
        >
          {task.title}
        </Link>
        <span className="text-xs text-(--text-muted)">{priority.text}</span>
        {showStatus && (
          <span
            className={`w-fit rounded-(--radius-sm) px-2 py-0.5 text-xs font-medium text-(--bg-page) ${
              STATUS_BADGE_CLASS[task.status] ?? 'bg-(--text-muted)'
            }`}
          >
            {COLUMN_LABELS[task.status] ?? task.status}
          </span>
        )}
      </div>
    </>
  )
}

type BoardCardProps = {
  task: Task
  index: number
  projectPrefixById: Map<string, string>
}

export function BoardCard({ task, index, projectPrefixById }: BoardCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            ...getBorderStyle(task),
          }}
          className={`${CARD_CLASS} ${
            snapshot.isDragging ? 'bg-(--bg-card-hover)' : ''
          }`}
        >
          <BoardCardBody task={task} projectPrefixById={projectPrefixById} />
        </div>
      )}
    </Draggable>
  )
}

type StaticBoardCardProps = {
  task: Task
  projectPrefixById: Map<string, string>
  showStatus?: boolean
  actions?: ReactNode
}

export function StaticBoardCard({
  task,
  projectPrefixById,
  showStatus,
  actions,
}: StaticBoardCardProps) {
  return (
    <div style={getBorderStyle(task)} className={CARD_CLASS}>
      <BoardCardBody
        task={task}
        projectPrefixById={projectPrefixById}
        showStatus={showStatus}
      />
      {actions && (
        <div className="ml-auto flex items-center gap-2 self-center">
          {actions}
        </div>
      )}
    </div>
  )
}
