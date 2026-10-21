import { useLocation, useNavigate } from 'react-router-dom'
import { HOME_PATH } from '@/features/auth/lib/redirect'
import { SETTINGS_PATH } from '@/features/settings/constants/paths'

export function useSettingsToggle() {
  const navigate = useNavigate()
  const location = useLocation()
  const isOnSettings = location.pathname === SETTINGS_PATH
  const hasPreviousPage = location.key !== 'default'

  function leaveSettings() {
    if (hasPreviousPage) {
      navigate(-1)
      return
    }
    navigate(HOME_PATH)
  }

  function toggleSettings() {
    if (isOnSettings) {
      leaveSettings()
      return
    }
    navigate(SETTINGS_PATH)
  }

  return { isOnSettings, leaveSettings, toggleSettings }
}
