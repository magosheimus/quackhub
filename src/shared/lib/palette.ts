import { createEnumGuard } from '@/shared/lib/enums'

export const PALETTE_COLORS = [
  'amber',
  'sage',
  'blue',
  'rose',
  'lavender',
  'sand',
  'magenta',
  'teal',
  'indigo',
  'brown',
  'lime',
  'graphite',
] as const

export type PaletteColor = (typeof PALETTE_COLORS)[number]

export const DEFAULT_PALETTE_COLOR: PaletteColor = 'amber'

export const NEUTRAL_COLOR = 'var(--text-muted)'

// Onde vários projetos se misturam a cor identifica o projeto; dentro de um projeto, o épico
export type ColorScope = 'project' | 'epic'

export const isPaletteColor = createEnumGuard(PALETTE_COLORS)

export function toPaletteColor(value: unknown): PaletteColor | null {
  return isPaletteColor(value) ? value : null
}

const PALETTE_VARS: Record<PaletteColor, string> = {
  amber: 'var(--palette-amber)',
  sage: 'var(--palette-sage)',
  blue: 'var(--palette-blue)',
  rose: 'var(--palette-rose)',
  lavender: 'var(--palette-lavender)',
  sand: 'var(--palette-sand)',
  magenta: 'var(--palette-magenta)',
  teal: 'var(--palette-teal)',
  indigo: 'var(--palette-indigo)',
  brown: 'var(--palette-brown)',
  lime: 'var(--palette-lime)',
  graphite: 'var(--palette-graphite)',
}

export function paletteVar(color: PaletteColor): string {
  return PALETTE_VARS[color]
}

export function resolvePaletteColor(value: unknown, fallback: string): string {
  const color = toPaletteColor(value)
  return color ? paletteVar(color) : fallback
}
