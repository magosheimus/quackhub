import { HintTooltip } from '@/components/ui/hint-tooltip'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { useAssignee } from '@/features/personas/hooks/usePersonaOptions'

type AssigneeBadgeProps = {
  assigneeId: string | null
}

export function AssigneeBadge({ assigneeId }: AssigneeBadgeProps) {
  const assignee = useAssignee(assigneeId)
  if (!assignee) {
    return null
  }
  const hint = PERSONAS_TEXTS.assigneeHint(assignee.name)

  return (
    <HintTooltip text={hint}>
      <span role="img" aria-label={hint} className="inline-flex text-fg">
        <PersonaIcon icon={assignee.icon} name={assignee.name} size={20} />
      </span>
    </HintTooltip>
  )
}
