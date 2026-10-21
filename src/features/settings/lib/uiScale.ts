import { createEnumGuard } from '@/shared/lib/enums'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

export const UI_SCALES = ['80', '90', '100', '110', '120'] as const
export type UiScale = (typeof UI_SCALES)[number]

export const DEFAULT_UI_SCALE: UiScale = '100'

export const isUiScale = createEnumGuard(UI_SCALES)

export function loadUiScale(): UiScale {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.uiScale)
    return isUiScale(saved) ? saved : DEFAULT_UI_SCALE
  } catch {
    return DEFAULT_UI_SCALE
  }
}

export function saveUiScale(scale: UiScale): void {
  try {
    localStorage.setItem(STORAGE_KEYS.uiScale, scale)
  } catch {
    // ignora — não é crítico
  }
}

export function toScaleFactor(scale: UiScale): number {
  return Number(scale) / 100
}

export function applyUiScale(scale: UiScale): void {
  document.documentElement.style.setProperty(
    '--ui-scale',
    String(toScaleFactor(scale)),
  )
}
