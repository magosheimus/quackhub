import { createEnumGuard } from '@/shared/lib/enums'
import type { Persona, Task } from '@/shared/types/entities'
import { getInitialLetter, type Letter } from '@/shared/lib/letters'

export const PERSONA_ICON_KEYS = [
  'avatar',
  'duck',
  'smile',
  'meh',
  'sunglasses',
  'crown',
  'robot',
  'android',
  'alien',
  'skull',
  'trex',
  'snail',
  'dog',
  'heart',
  'star',
  'sparkle',
  'sparkles',
  'gem',
  'eye',
  'cloud',
  'sticker',
  'github',
  'gitlab',
  'linux',
  'discord',
  'bluesky',
] as const

export type PersonaIconKey = (typeof PERSONA_ICON_KEYS)[number]

export type PersonaIconOption = PersonaIconKey | null

export const isPersonaIconKey = createEnumGuard(PERSONA_ICON_KEYS)

export function getPersonaIconKey(
  persona: Pick<Persona, 'icon'>,
): PersonaIconOption {
  return isPersonaIconKey(persona.icon) ? persona.icon : null
}

export type PersonaGlyph =
  | { kind: 'icon'; icon: PersonaIconKey }
  | { kind: 'letter'; letter: Letter }
  | { kind: 'empty' }

export function resolvePersonaGlyph(
  icon: PersonaIconOption,
  name: string,
): PersonaGlyph {
  if (icon) {
    return { kind: 'icon', icon }
  }
  const letter = getInitialLetter(name)
  return letter ? { kind: 'letter', letter } : { kind: 'empty' }
}

export function hasPersonaGlyph(
  icon: PersonaIconOption,
  name: string,
): boolean {
  return resolvePersonaGlyph(icon, name).kind !== 'empty'
}

export type PersonaOption = {
  id: string
  name: string
  icon: PersonaIconOption
}

export function toPersonaOption(
  persona: Pick<Persona, 'id' | 'name' | 'icon'>,
): PersonaOption {
  return {
    id: persona.id,
    name: persona.name,
    icon: getPersonaIconKey(persona),
  }
}

export function findPersonaOption(
  options: PersonaOption[],
  personaId: string | null,
): PersonaOption | null {
  if (!personaId) {
    return null
  }
  return options.find((option) => option.id === personaId) ?? null
}

export function getPersonasInTasks<P extends Pick<Persona, 'id'>>(
  personas: P[],
  tasks: Pick<Task, 'assignee_id'>[],
): P[] {
  const assigneeIds = new Set(tasks.map((task) => task.assignee_id))
  return personas.filter((persona) => assigneeIds.has(persona.id))
}

export function normalizePersonaName(value: string): string | null {
  const name = value.trim()
  return name ? name : null
}
