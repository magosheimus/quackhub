import { useEffect } from 'react'
import {
  fetchRemoteSettings,
  saveRemoteSettings,
} from '@/features/settings/api/userSettings'
import {
  getSettings,
  subscribeSettings,
  updateSettings,
} from '@/features/settings/lib/settingsStore'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { reportError } from '@/shared/lib/errors'

const PUSH_DELAY_MS = 500

export function useSettingsSync() {
  useEffect(() => {
    let isActive = true
    let lastSynced: string | null = null
    let pushTimer: number | undefined

    async function push() {
      if (!navigator.onLine) {
        return
      }
      const settings = getSettings()
      try {
        await saveRemoteSettings(settings)
        lastSynced = JSON.stringify(settings)
      } catch (error) {
        reportError(error, SETTINGS_TEXTS.syncError)
      }
    }

    async function pull() {
      if (!navigator.onLine) {
        return
      }
      try {
        const remote = await fetchRemoteSettings()
        if (!isActive) {
          return
        }
        if (remote) {
          lastSynced = JSON.stringify(remote)
          updateSettings(remote)
        } else {
          await push()
        }
      } catch (error) {
        reportError(error, SETTINGS_TEXTS.syncError)
      }
    }

    const unsubscribe = subscribeSettings(() => {
      if (JSON.stringify(getSettings()) === lastSynced) {
        return
      }
      window.clearTimeout(pushTimer)
      pushTimer = window.setTimeout(push, PUSH_DELAY_MS)
    })

    void pull()

    return () => {
      isActive = false
      unsubscribe()
      window.clearTimeout(pushTimer)
    }
  }, [])
}
