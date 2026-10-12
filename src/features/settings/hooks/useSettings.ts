import { useSyncExternalStore } from 'react'
import {
  getSettings,
  subscribeSettings,
  updateSettings,
} from '@/features/settings/lib/settingsStore'

export function useSettings() {
  const settings = useSyncExternalStore(subscribeSettings, getSettings)
  return { settings, updateSettings }
}
