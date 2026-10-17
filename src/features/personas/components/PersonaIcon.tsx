import { PERSONA_ICONS } from '@/features/personas/components/personaIcons'
import {
  resolvePersonaGlyph,
  type PersonaIconOption,
} from '@/features/personas/lib/persona'
import { LETTER_ICONS } from '@/shared/lib/icons'

const ICON_STROKE_WIDTH = 0.4

type PersonaIconProps = {
  icon: PersonaIconOption
  name: string
  size?: number
}

export function PersonaIcon({ icon, name, size = 16 }: PersonaIconProps) {
  const glyph = resolvePersonaGlyph(icon, name)
  if (glyph.kind === 'empty') {
    return null
  }
  const Icon =
    glyph.kind === 'icon'
      ? PERSONA_ICONS[glyph.icon]
      : LETTER_ICONS[glyph.letter]
  return (
    <Icon
      size={size}
      stroke="currentColor"
      strokeWidth={ICON_STROKE_WIDTH}
      aria-hidden="true"
      className="icon-flat shrink-0"
    />
  )
}
