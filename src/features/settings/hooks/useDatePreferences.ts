import { useSettings } from '@/features/settings/hooks/useSettings'

export function useDatePreferences() {
  const { settings } = useSettings()
  return {
    dateFormat: settings.dateFormat,
    weekStartsOn: settings.weekStartsOn,
  }
}
