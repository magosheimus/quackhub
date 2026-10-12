import { Draggable } from '@hello-pangea/dnd'
import { Link } from 'react-router-dom'
import { IconFlag, IconMove } from '@/shared/lib/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BoardColumnKey, MoveOption } from '@/features/board/lib/board'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import {
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
} from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import type { ReactNode } from 'react'
import type { Task } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'

const CARD_CLASS =
  'flex gap-2 rounded-md border border-l-4 border-border bg-card p-3 text-sm hover:bg-card-hover'

function getBorderStyle(task: Task) {
  const priority = PRIORITY_CONFIG[task.priority]
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
  const priority = PRIORITY_CONFIG[task.priority]
  const PriorityIcon = priority.icon
  const projectPrefix = projectPrefixById.get(task.project_id) ?? ''

  return (
    <>
      <div className="flex w-4 shrink-0 flex-col items-center gap-1 pt-0.5">
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

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {task.task_number && (
          <span className="text-caption">
            {projectPrefix}-{task.task_number}
          </span>
        )}
        <Link
          to={`/cards/${task.id}`}
          className="line-clamp-3 text-fg hover:text-accent hover:underline"
        >
          {task.title}
        </Link>
        <span className="text-caption">{priority.text}</span>
        {showStatus && (
          <span
            className={`w-fit rounded-sm px-2 py-0.5 text-xs font-medium text-page ${
              STATUS_BADGE_CLASS[task.status]
            }`}
          >
            {STATUS_LABELS[task.status]}
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
  moveOptions?: MoveOption[]
  onMove?: (column: BoardColumnKey) => void
}

type MoveMenuProps = {
  taskTitle: string
  options: MoveOption[]
  onMove: (column: BoardColumnKey) => void
}

function MoveMenu({ taskTitle, options, onMove }: MoveMenuProps) {
  if (options.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={BOARD_TEXTS.moveCard(taskTitle)}
            className="ml-auto hidden shrink-0 self-start pointer-coarse:inline-flex"
          />
        }
      >
        <IconMove size={16} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{BOARD_TEXTS.moveTo}</DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.column}
              onClick={() => onMove(option.column)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function BoardCard({
  task,
  index,
  projectPrefixById,
  moveOptions,
  onMove,
}: BoardCardProps) {
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
            snapshot.isDragging ? 'bg-card-hover' : ''
          }`}
        >
          <BoardCardBody task={task} projectPrefixById={projectPrefixById} />
          {moveOptions && onMove && (
            <MoveMenu
              taskTitle={task.title}
              options={moveOptions}
              onMove={onMove}
            />
          )}
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
    <div style={getBorderStyle(task)} className={`${CARD_CLASS} flex-wrap`}>
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
