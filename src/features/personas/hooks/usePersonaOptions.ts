import { usePersonas } from '@/features/personas/hooks/usePersonas'
import {
  findPersonaOption,
  toPersonaOption,
  type PersonaOption,
} from '@/features/personas/lib/persona'

export function usePersonaOptions(): PersonaOption[] {
  const { data: personas = [] } = usePersonas()
  return personas.map(toPersonaOption)
}

export function useAssignee(assigneeId: string | null): PersonaOption | null {
  return findPersonaOption(usePersonaOptions(), assigneeId)
}

export function usePersonaSelect(value: string | null) {
  const personaOptions = usePersonaOptions()
  return {
    personaOptions,
    selected: findPersonaOption(personaOptions, value),
  }
}
