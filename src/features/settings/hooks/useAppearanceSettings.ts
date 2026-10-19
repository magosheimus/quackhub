import {
  getDefaultAppearance,
  getTextureOpacity,
  textureOpacityUpdate,
} from '@/features/settings/lib/settings'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useState } from 'react'

export function useAppearanceSettings() {
  const { settings, updateSettings: update } = useSettings()
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)

  function setTextureOpacity(value: number | readonly number[]) {
    const opacity = typeof value === 'number' ? value : value[0]
    update(textureOpacityUpdate(settings, opacity))
  }

  return {
    settings,
    update,
    textureOpacity: getTextureOpacity(settings),
    setTextureOpacity,
    restoreDefaults: () => update(getDefaultAppearance()),
    isConfirmingRestore,
    setIsConfirmingRestore,
  }
}
