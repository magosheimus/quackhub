import { useSettings } from '@/features/settings/hooks/useSettings'

export function usePreferenceSettings() {
  const { settings, updateSettings: update } = useSettings()
  return { settings, update }
}
