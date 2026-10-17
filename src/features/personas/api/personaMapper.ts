import { isPersonaIconKey } from '@/features/personas/lib/persona'
import type {
  NewPersona,
  Persona,
  PersonaUpdate,
} from '@/features/personas/model/persona'
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/shared/types/database.types'

export function toPersona(row: Tables<'personas'>): Persona {
  return {
    id: row.id,
    name: row.name,
    icon: isPersonaIconKey(row.icon) ? row.icon : null,
  }
}

export function toPersonaInsert(persona: NewPersona): TablesInsert<'personas'> {
  return { name: persona.name, icon: persona.icon }
}

export function toPersonaUpdate(
  changes: PersonaUpdate,
): TablesUpdate<'personas'> {
  return { name: changes.name, icon: changes.icon }
}
