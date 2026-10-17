import type { PersonaIconOption } from '@/features/personas/lib/persona'

export type Persona = {
  id: string
  name: string
  icon: PersonaIconOption
}

export type NewPersona = {
  name: string
  icon: PersonaIconOption
}

export type PersonaUpdate = Partial<NewPersona>
