import { useState } from 'react'
import {
  getTextureOpacity,
  isDateFormat,
  isFontBody,
  parseWeekStart,
  textureOpacityUpdate,
} from '@/features/settings/lib/settings'
import { useSettings } from '@/features/settings/hooks/useSettings'
import {
  downloadSnapshotAsJson,
  exportAllData,
} from '@/features/settings/api/exportData'
import { reportError } from '@/shared/lib/errors'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSignOut } from '@/features/auth/hooks/useAuthMutations'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { useLeaveSettingsOnEscape } from '@/features/settings/hooks/useLeaveSettingsOnEscape'

export function useSettingsPage() {
  const { settings, updateSettings: update } = useSettings()
  const [isExporting, setIsExporting] = useState(false)
  const { session } = useAuth()
  const { mutate: signOut, isPending: isSigningOut } = useSignOut()
  useLeaveSettingsOnEscape()

  function setTextureOpacity(value: number | readonly number[]) {
    const opacity = typeof value === 'number' ? value : value[0]
    update(textureOpacityUpdate(settings, opacity))
  }

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

  async function exportData() {
    setIsExporting(true)
    try {
      const snapshot = await exportAllData()
      downloadSnapshotAsJson(snapshot)
    } catch (error) {
      reportError(error, SETTINGS_TEXTS.exportError)
    } finally {
      setIsExporting(false)
    }
  }

  return {
    settings,
    textureOpacity: getTextureOpacity(settings),
    update,
    setTextureOpacity,
    selectFontBody,
    selectDateFormat,
    selectWeekStart,
    isExporting,
    exportData,
    accountEmail: session?.user.email ?? '',
    signOut: () => signOut(),
    isSigningOut,
  }
}
