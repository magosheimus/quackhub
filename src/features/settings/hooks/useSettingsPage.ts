import { useState } from 'react'
import {
  applySettings,
  getTextureOpacity,
  isDateFormat,
  isFontBody,
  loadSettings,
  parseWeekStart,
  saveSettings,
  textureOpacityUpdate,
  type Settings,
} from '@/features/settings/lib/settings'
import {
  downloadSnapshotAsJson,
  exportAllData,
} from '@/features/settings/api/exportData'
import { reportError } from '@/shared/lib/errors'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'

export function useSettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [isExporting, setIsExporting] = useState(false)

  function update(partial: Partial<Settings>) {
    const next = saveSettings(partial)
    setSettings(next)
    applySettings(next)
  }

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
  }
}
