import {
  isDateFormat,
  isFontBody,
  parseWeekStart,
} from '@/features/settings/lib/settings'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function usePreferenceSettings() {
  const { settings, updateSettings: update } = useSettings()

  function selectFontBody(value: unknown) {
    if (isFontBody(value)) {
      update({ fontBody: value })
    }
  }

  function selectDateFormat(value: unknown) {
    if (isDateFormat(value)) {
      update({ dateFormat: value })
    }
  }

  function selectWeekStart(value: unknown) {
    const weekStartsOn = parseWeekStart(value)
    if (weekStartsOn !== null) {
      update({ weekStartsOn })
    }
  }

  return { settings, selectFontBody, selectDateFormat, selectWeekStart }
}
