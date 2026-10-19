import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AUTH_TEXTS } from '@/features/auth/constants/texts'
import { DeleteAccountDialog } from '@/features/auth/components/DeleteAccountDialog'
import { PRIVACY_PATH } from '@/features/privacy/constants/paths'
import { PRIVACY_TEXTS } from '@/features/privacy/constants/texts'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { useAccountSettings } from '@/features/settings/hooks/useAccountSettings'
import { ClearCacheButton } from './ClearCacheButton'
import { SettingsAction, SettingsGroup } from './SettingsGroup'
import { SettingsSection } from './SettingsSection'

export function AccountSettings() {
  const { isExporting, exportData, accountEmail, signOut, isSigningOut } =
    useAccountSettings()

  return (
    <SettingsSection>
      <SettingsGroup title={SETTINGS_TEXTS.data}>
        <div className="flex flex-col gap-3">
          <SettingsAction
            title={SETTINGS_TEXTS.exportData}
            description={SETTINGS_TEXTS.exportDescription}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportData}
              disabled={isExporting}
            >
              {isExporting ? SETTINGS_TEXTS.exporting : SETTINGS_TEXTS.export}
            </Button>
          </SettingsAction>
          <SettingsAction
            title={SETTINGS_TEXTS.clearCache}
            description={SETTINGS_TEXTS.clearCacheDescription}
          >
            <ClearCacheButton />
          </SettingsAction>
        </div>
      </SettingsGroup>

      <SettingsGroup title={AUTH_TEXTS.account}>
        <div className="flex flex-col gap-3">
          <SettingsAction title={AUTH_TEXTS.signedInAs(accountEmail)}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={signOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? AUTH_TEXTS.signingOut : AUTH_TEXTS.signOut}
            </Button>
          </SettingsAction>
        </div>
        <Link
          to={PRIVACY_PATH}
          className="text-caption underline hover:text-fg"
        >
          {PRIVACY_TEXTS.linkLabel}
        </Link>
      </SettingsGroup>

      <SettingsGroup title={SETTINGS_TEXTS.dangerZone}>
        <div className="rounded-md border border-danger surface-danger p-4">
          <SettingsAction
            title={AUTH_TEXTS.deleteAccount}
            description={AUTH_TEXTS.deleteAccountDescription}
            tone="danger"
          >
            <DeleteAccountDialog accountEmail={accountEmail} />
          </SettingsAction>
        </div>
      </SettingsGroup>
    </SettingsSection>
  )
}
