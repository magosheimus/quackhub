import { HintTooltip } from '@/components/feedback/hint-tooltip'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { useAssignee } from '@/features/personas/hooks/usePersonaOptions'

type AssigneeBadgeProps = {
  assigneeId: string | null
  compact?: boolean
}

export function AssigneeBadge({
  assigneeId,
  compact = false,
}: AssigneeBadgeProps) {
  const assignee = useAssignee(assigneeId)
  if (!assignee) {
    return null
  }
  const hint = PERSONAS_TEXTS.assigneeHint(assignee.name)

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-fg">
        <PersonaIcon icon={assignee.icon} name={assignee.name} size={16} />
        {assignee.name}
      </span>
    )
  }

  return (
    <HintTooltip text={hint}>
      <span role="img" aria-label={hint} className="inline-flex text-fg">
        <PersonaIcon icon={assignee.icon} name={assignee.name} size={24} />
      </span>
    </HintTooltip>
  )
}
