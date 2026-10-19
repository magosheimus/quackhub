import {
  getTextureOpacity,
  textureOpacityUpdate,
} from '@/features/settings/lib/settings'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function useAppearanceSettings() {
  const { settings, updateSettings: update } = useSettings()

  function setTextureOpacity(value: number | readonly number[]) {
    const opacity = typeof value === 'number' ? value : value[0]
    update(textureOpacityUpdate(settings, opacity))
  }

  return {
    settings,
    update,
    textureOpacity: getTextureOpacity(settings),
    setTextureOpacity,
  }
}
