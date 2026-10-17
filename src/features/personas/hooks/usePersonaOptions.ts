import { usePersonas } from '@/features/personas/hooks/usePersonas'
import { findPersona } from '@/features/personas/lib/persona'
import type { Persona } from '@/features/personas/model/persona'

export function usePersonaOptions(): Persona[] {
  const { data: personas = [] } = usePersonas()
  return personas
}

export function useAssignee(assigneeId: string | null): Persona | null {
  return findPersona(usePersonaOptions(), assigneeId)
}

export function usePersonaSelect(value: string | null) {
  const personaOptions = usePersonaOptions()
  return {
    personaOptions,
    selected: findPersona(personaOptions, value),
  }
}
