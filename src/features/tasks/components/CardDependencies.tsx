import { SectionLabel } from '@/components/ui/section-label'
import { IconRedo } from '@/shared/lib/icons'
import { useDependencies } from '@/features/tasks/hooks/dependencies/useDependencies'
import { useAddDependency } from '@/features/tasks/hooks/dependencies/useAddDependency'
import { useRemoveDependency } from '@/features/tasks/hooks/dependencies/useRemoveDependency'
import { DependencyPicker } from '@/features/tasks/components/DependencyPicker'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { HintTooltip } from '@/components/ui/hint-tooltip'

type CardDependenciesProps = {
  taskId: string
  projectId: string
}

export function CardDependencies({ taskId, projectId }: CardDependenciesProps) {
  const { data: dependencies } = useDependencies(taskId)
  const { mutate: addDependency } = useAddDependency()
  const { mutate: removeDependency } = useRemoveDependency()

  return (
    <div className="flex flex-col gap-2">
      <HintTooltip text={TASKS_TEXTS.hintDependsOn}>
        <SectionLabel icon={IconRedo}>{TASKS_TEXTS.dependsOn}</SectionLabel>
      </HintTooltip>
      <DependencyPicker
        projectId={projectId}
        dependencies={dependencies ?? []}
        excludeTaskId={taskId}
        onAdd={(task) => addDependency({ taskId, dependsOnTaskId: task.id })}
        onRemove={(task) =>
          removeDependency({ taskId, dependsOnTaskId: task.id })
        }
      />
    </div>
  )
}
