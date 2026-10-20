import { useSettings } from '@/features/settings/hooks/useSettings'

// Preferências que os campos de data precisam (formato e início da semana)
export function useDatePreferences() {
  const { settings } = useSettings()
  return {
    dateFormat: settings.dateFormat,
    weekStartsOn: settings.weekStartsOn,
  }
}
