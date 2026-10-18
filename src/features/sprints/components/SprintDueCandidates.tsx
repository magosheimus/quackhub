import { Checkbox } from '@/components/ui/checkbox'
import { DueBadge } from '@/features/tasks/components/DueBadge'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import type { Task } from '@/features/tasks/model/task'

type SprintDueCandidatesProps = {
  inPeriod: Task[]
  overdue: Task[]
  isSelected: (task: Task) => boolean
  onToggle: (task: Task) => void
}

function CandidateGroup({
  title,
  tasks,
  isSelected,
  onToggle,
}: {
  title: string
  tasks: Task[]
  isSelected: (task: Task) => boolean
  onToggle: (task: Task) => void
}) {
  if (tasks.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption">{title}</span>
      {tasks.map((task) => (
        <label
          key={task.id}
          className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-sm hover:bg-hover"
        >
          <Checkbox
            checked={isSelected(task)}
            onCheckedChange={() => onToggle(task)}
          />
          <span className="min-w-0 flex-1 truncate text-fg">{task.title}</span>
          <DueBadge due={task.due} />
        </label>
      ))}
    </div>
  )
}

export function SprintDueCandidates({
  inPeriod,
  overdue,
  isSelected,
  onToggle,
}: SprintDueCandidatesProps) {
  if (inPeriod.length === 0 && overdue.length === 0) {
    return null
  }
  return (
    <div className="flex max-h-56 flex-col gap-3 overflow-y-auto rounded-md border border-border p-3">
      <CandidateGroup
        title={SPRINTS_TEXTS.dueInPeriod(inPeriod.length)}
        tasks={inPeriod}
        isSelected={isSelected}
        onToggle={onToggle}
      />
      <CandidateGroup
        title={SPRINTS_TEXTS.dueOverdue(overdue.length)}
        tasks={overdue}
        isSelected={isSelected}
        onToggle={onToggle}
      />
      <span className="text-caption">{SPRINTS_TEXTS.dueCandidatesHint}</span>
    </div>
  )
}
