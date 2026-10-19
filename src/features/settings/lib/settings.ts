import { createEnumGuard } from '@/shared/lib/enums'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

const SETTINGS_KEY = STORAGE_KEYS.settings

export type Texture = 'none' | 'lines' | 'grid' | 'graph' | 'dots' | 'lcd'
export type PatternTexture = Exclude<Texture, 'none'>

export type Settings = {
  cartucho: 'sage' | 'amber' | 'slate' | 'earth' | 'sage-dark' | 'amber-dark'
  texture: Texture
  textureOpacity: Record<PatternTexture, number>
  scanlines: boolean
  glow: boolean
  lcdGhost: 'off' | 'subtle' | 'glitch'
  fontBody: 'jetbrains' | 'ibm-plex'
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy'
  weekStartsOn: 0 | 1
  hiddenQuickFilters: string[]
  sidebarCollapsed: boolean
}

export const FONT_BODIES = [
  'jetbrains',
  'ibm-plex',
] as const satisfies readonly Settings['fontBody'][]

export const DATE_FORMATS = [
  'dd/MM/yyyy',
  'MM/dd/yyyy',
] as const satisfies readonly Settings['dateFormat'][]

export const CARTUCHOS = [
  'sage',
  'amber',
  'slate',
  'earth',
  'sage-dark',
  'amber-dark',
] as const satisfies readonly Settings['cartucho'][]

export const PATTERN_TEXTURES = [
  'lines',
  'grid',
  'graph',
  'dots',
  'lcd',
] as const satisfies readonly PatternTexture[]

export const TEXTURES = [
  'none',
  ...PATTERN_TEXTURES,
] as const satisfies readonly Texture[]

export const WEEK_STARTS = [
  0, 1,
] as const satisfies readonly Settings['weekStartsOn'][]

export const LCD_GHOSTS = [
  'off',
  'subtle',
  'glitch',
] as const satisfies readonly Settings['lcdGhost'][]

export const isFontBody = createEnumGuard(FONT_BODIES)
export const isDateFormat = createEnumGuard(DATE_FORMATS)
export const isCartucho = createEnumGuard(CARTUCHOS)
export const isTexture = createEnumGuard(TEXTURES)
export const isLcdGhost = createEnumGuard(LCD_GHOSTS)

// O slider de intensidade controla a opacidade da textura ativa
export function getTextureOpacity(settings: Settings): number {
  return settings.texture === 'none'
    ? 0
    : settings.textureOpacity[settings.texture]
}

export function textureOpacityUpdate(
  settings: Settings,
  value: number,
): Partial<Settings> {
  if (settings.texture === 'none') {
    return {}
  }
  return {
    textureOpacity: { ...settings.textureOpacity, [settings.texture]: value },
  }
}

export const DEFAULT_SETTINGS: Settings = {
  cartucho: 'sage',
  texture: 'none',
  textureOpacity: { lines: 50, grid: 50, graph: 50, dots: 50, lcd: 35 },
  scanlines: false,
  glow: false,
  lcdGhost: 'subtle',
  fontBody: 'jetbrains',
  dateFormat: 'dd/MM/yyyy',
  weekStartsOn: 0,
  hiddenQuickFilters: [],
  sidebarCollapsed: false,
}

export function getDefaultAppearance(): Partial<Settings> {
  return {
    cartucho: DEFAULT_SETTINGS.cartucho,
    fontBody: DEFAULT_SETTINGS.fontBody,
    texture: DEFAULT_SETTINGS.texture,
    textureOpacity: DEFAULT_SETTINGS.textureOpacity,
    scanlines: DEFAULT_SETTINGS.scanlines,
    glow: DEFAULT_SETTINGS.glow,
    lcdGhost: DEFAULT_SETTINGS.lcdGhost,
  }
}

function isOpacity(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && value <= 100
}

function pickStringList(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : []
}

function pickBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

type LegacySettingsKey = 'gridOpacity' | 'dotsOpacity'

function normalizeTextureOpacity(
  saved: unknown,
  legacy: Partial<Record<PatternTexture, unknown>>,
): Settings['textureOpacity'] {
  const savedOpacity =
    typeof saved === 'object' && saved !== null
      ? (saved as Partial<Record<PatternTexture, unknown>>)
      : {}
  const opacity = { ...DEFAULT_SETTINGS.textureOpacity }
  for (const texture of PATTERN_TEXTURES) {
    const value = savedOpacity[texture] ?? legacy[texture]
    if (isOpacity(value)) {
      opacity[texture] = value
    }
  }
  return opacity
}

export function normalizeSettings(raw: unknown): Settings {
  if (typeof raw !== 'object' || raw === null) {
    return DEFAULT_SETTINGS
  }
  const source = raw as Partial<
    Record<keyof Settings | LegacySettingsKey, unknown>
  >
  return {
    cartucho: isCartucho(source.cartucho)
      ? source.cartucho
      : DEFAULT_SETTINGS.cartucho,
    texture: isTexture(source.texture)
      ? source.texture
      : DEFAULT_SETTINGS.texture,
    textureOpacity: normalizeTextureOpacity(source.textureOpacity, {
      grid: source.gridOpacity,
      dots: source.dotsOpacity,
    }),
    scanlines: pickBoolean(source.scanlines, DEFAULT_SETTINGS.scanlines),
    glow: pickBoolean(source.glow, DEFAULT_SETTINGS.glow),
    lcdGhost: isLcdGhost(source.lcdGhost)
      ? source.lcdGhost
      : DEFAULT_SETTINGS.lcdGhost,
    fontBody: isFontBody(source.fontBody)
      ? source.fontBody
      : DEFAULT_SETTINGS.fontBody,
    dateFormat: isDateFormat(source.dateFormat)
      ? source.dateFormat
      : DEFAULT_SETTINGS.dateFormat,
    weekStartsOn:
      source.weekStartsOn === 0 || source.weekStartsOn === 1
        ? source.weekStartsOn
        : DEFAULT_SETTINGS.weekStartsOn,
    hiddenQuickFilters: pickStringList(source.hiddenQuickFilters),
    sidebarCollapsed: pickBoolean(
      source.sidebarCollapsed,
      DEFAULT_SETTINGS.sidebarCollapsed,
    ),
  }
}

export function isDarkCartucho(cartucho: Settings['cartucho']): boolean {
  return cartucho === 'sage-dark' || cartucho === 'amber-dark'
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return normalizeSettings(JSON.parse(raw))
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

const TEXTURE_CLASS: Record<Texture, string> = {
  none: '',
  lines: 'texture-lines',
  grid: 'texture-grid',
  graph: 'texture-graph',
  dots: 'texture-dots',
  lcd: 'texture-lcd',
}

const LCD_GHOST_CLASS: Record<Settings['lcdGhost'], string> = {
  off: 'lcd-off',
  subtle: '',
  glitch: 'lcd-glitch',
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
    s.glow ? LCD_GHOST_CLASS[s.lcdGhost] : '',
    isDarkCartucho(s.cartucho) ? 'theme-dark' : '',
  ]
    .filter(Boolean)
    .join(' ')

  document.documentElement.className = rootClasses

  const opacity = getTextureOpacity(s)

  document.documentElement.style.setProperty('--texture-opacity', `${opacity}%`)
}
