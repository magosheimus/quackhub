import { useSearchParams } from 'react-router-dom'
import {
  isSettingsTab,
  readSettingsTab,
  SETTINGS_TAB_PARAM,
} from '@/features/settings/lib/settingsTab'
import { useLeaveSettingsOnEscape } from '@/features/settings/hooks/useLeaveSettingsOnEscape'

export function useSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  useLeaveSettingsOnEscape()

  function selectTab(value: unknown) {
    if (isSettingsTab(value)) {
      setSearchParams({ [SETTINGS_TAB_PARAM]: value }, { replace: true })
    }
  }

  return { tab: readSettingsTab(searchParams), selectTab }
}
