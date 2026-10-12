import {
  applySettings,
  loadSettings,
  saveSettings,
  type Settings,
} from '@/features/settings/lib/settings'

let current: Settings = loadSettings()
const listeners = new Set<() => void>()

export function getSettings(): Settings {
  return current
}

export function subscribeSettings(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function updateSettings(partial: Partial<Settings>): void {
  current = saveSettings({ ...current, ...partial })
  applySettings(current)
  listeners.forEach((listener) => listener())
}
