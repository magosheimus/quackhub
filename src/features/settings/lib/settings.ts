import { createEnumGuard } from '@/shared/lib/enums'

const SETTINGS_KEY = 'quackhub-settings'

export type Settings = {
  cartucho: 'sage' | 'amber' | 'slate' | 'earth' | 'sage-dark' | 'amber-dark'
  texture: 'none' | 'grid' | 'dots'
  gridOpacity: number
  dotsOpacity: number
  scanlines: boolean
  glow: boolean
  fontBody: 'jetbrains' | 'ibm-plex'
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy'
  weekStartsOn: 0 | 1
}

export const FONT_BODIES = [
  'jetbrains',
  'ibm-plex',
] as const satisfies readonly Settings['fontBody'][]

export const DATE_FORMATS = [
  'dd/MM/yyyy',
  'MM/dd/yyyy',
] as const satisfies readonly Settings['dateFormat'][]

export const isFontBody = createEnumGuard(FONT_BODIES)
export const isDateFormat = createEnumGuard(DATE_FORMATS)

// Valores de Select chegam como texto ('0' | '1')
export function parseWeekStart(
  value: unknown,
): Settings['weekStartsOn'] | null {
  if (value === '0') {
    return 0
  }
  if (value === '1') {
    return 1
  }
  return null
}

// O slider de intensidade controla a opacidade da textura ativa
export function getTextureOpacity(settings: Settings): number {
  return settings.texture === 'dots'
    ? settings.dotsOpacity
    : settings.gridOpacity
}

export function textureOpacityUpdate(
  settings: Settings,
  value: number,
): Partial<Settings> {
  return settings.texture === 'dots'
    ? { dotsOpacity: value }
    : { gridOpacity: value }
}

export const DEFAULT_SETTINGS: Settings = {
  cartucho: 'sage',
  texture: 'none',
  gridOpacity: 45,
  dotsOpacity: 70,
  scanlines: false,
  glow: false,
  fontBody: 'jetbrains',
  dateFormat: 'dd/MM/yyyy',
  weekStartsOn: 0,
}

export function isDarkCartucho(cartucho: Settings['cartucho']): boolean {
  return cartucho === 'sage-dark' || cartucho === 'amber-dark'
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: Partial<Settings>): Settings {
  const current = loadSettings()
  const next = { ...current, ...s }
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  } catch {
    // ignore — não é crítico
  }
  return next
}

const CARTUCHO_CLASS: Record<Settings['cartucho'], string> = {
  sage: '',
  amber: 'cartucho-amber',
  slate: 'cartucho-slate',
  earth: 'cartucho-earth',
  'sage-dark': 'cartucho-sage-dark',
  'amber-dark': 'cartucho-amber-dark',
}

const TEXTURE_CLASS: Record<Settings['texture'], string> = {
  none: '',
  grid: 'texture-grid',
  dots: 'texture-dots',
}

const FONT_CLASS: Record<Settings['fontBody'], string> = {
  jetbrains: '',
  'ibm-plex': 'font-ibm-plex',
}

export function applySettings(s: Settings): void {
  const rootClasses = [
    CARTUCHO_CLASS[s.cartucho],
    TEXTURE_CLASS[s.texture],
    FONT_CLASS[s.fontBody],
    s.scanlines ? 'scanlines-on' : '',
    s.glow ? 'glow-on' : '',
  ]
    .filter(Boolean)
    .join(' ')

  document.documentElement.className = rootClasses

  const opacity =
    s.texture === 'grid'
      ? s.gridOpacity
      : s.texture === 'dots'
        ? s.dotsOpacity
        : 0
  document.documentElement.style.setProperty('--texture-opacity', `${opacity}%`)
}
