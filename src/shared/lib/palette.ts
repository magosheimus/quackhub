import { createEnumGuard } from '@/shared/lib/enums'

export const PALETTE_COLORS = [
  'amber',
  'sage',
  'blue',
  'rose',
  'lavender',
  'sand',
] as const

export type PaletteColor = (typeof PALETTE_COLORS)[number]

export const DEFAULT_PALETTE_COLOR: PaletteColor = 'amber'

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
}

export function paletteVar(color: PaletteColor): string {
  return PALETTE_VARS[color]
}

export function resolvePaletteColor(value: unknown, fallback: string): string {
  const color = toPaletteColor(value)
  return color ? paletteVar(color) : fallback
}
