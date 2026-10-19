import { useState } from 'react'
import {
  downloadSnapshotAsJson,
  exportAllData,
} from '@/features/settings/api/exportData'
import { reportError } from '@/shared/lib/errors'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSignOut } from '@/features/auth/hooks/useAuthMutations'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'

export function useAccountSettings() {
  const [isExporting, setIsExporting] = useState(false)
  const { session } = useAuth()
  const { mutate: signOut, isPending: isSigningOut } = useSignOut()

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
    isExporting,
    exportData,
    accountEmail: session?.user.email ?? '',
    signOut: () => signOut(),
    isSigningOut,
  }
}
