import { createEnumGuard } from '@/shared/lib/enums'

export const SETTINGS_TABS = [
  'appearance',
  'preferences',
  'personas',
  'account',
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]

export const SETTINGS_TAB_PARAM = 'tab'

const DEFAULT_SETTINGS_TAB: SettingsTab = 'appearance'

export const isSettingsTab = createEnumGuard(SETTINGS_TABS)

export function readSettingsTab(params: URLSearchParams): SettingsTab {
  const value = params.get(SETTINGS_TAB_PARAM)
  return isSettingsTab(value) ? value : DEFAULT_SETTINGS_TAB
}
