import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { usePersonaSelect } from '@/features/personas/hooks/usePersonaOptions'

const NONE_VALUE = '__none__'

type PersonaSelectProps = {
  value: string | null
  onChange: (personaId: string | null) => void
  noneLabel?: string
}

export function PersonaSelect({
  value,
  onChange,
  noneLabel = PERSONAS_TEXTS.noAssignee,
}: PersonaSelectProps) {
  const { personaOptions, selected } = usePersonaSelect(value)

  return (
    <Select
      value={value ?? NONE_VALUE}
      onValueChange={(next) => onChange(next === NONE_VALUE ? null : next)}
    >
      <SelectTrigger aria-label={PERSONAS_TEXTS.assignee}>
        <SelectValue>
          {selected ? (
            <>
              <PersonaIcon icon={selected.icon} name={selected.name} />
              {selected.name}
            </>
          ) : (
            noneLabel
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>{noneLabel}</SelectItem>
        {personaOptions.map((persona) => (
          <SelectItem key={persona.id} value={persona.id}>
            <PersonaIcon icon={persona.icon} name={persona.name} />
            {persona.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
