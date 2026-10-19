import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AUTH_TEXTS } from '@/features/auth/constants/texts'
import { DeleteAccountDialog } from '@/features/auth/components/DeleteAccountDialog'
import { PRIVACY_PATH } from '@/features/privacy/constants/paths'
import { PRIVACY_TEXTS } from '@/features/privacy/constants/texts'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { useAccountSettings } from '@/features/settings/hooks/useAccountSettings'
import { ClearCacheButton } from './ClearCacheButton'
import { SettingsSection } from './SettingsSection'

export function AccountSettings() {
  const { isExporting, exportData, accountEmail, signOut, isSigningOut } =
    useAccountSettings()

  return (
    <>
      <SettingsSection title={SETTINGS_TEXTS.data}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-fg">{SETTINGS_TEXTS.exportData}</span>
            <span className="text-caption">
              {SETTINGS_TEXTS.exportDescription}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={isExporting}
          >
            {isExporting ? SETTINGS_TEXTS.exporting : SETTINGS_TEXTS.export}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-sm text-fg">{SETTINGS_TEXTS.clearCache}</span>
            <span className="text-caption">
              {SETTINGS_TEXTS.clearCacheDescription}
            </span>
          </div>
          <ClearCacheButton />
        </div>
      </SettingsSection>

      <SettingsSection title={AUTH_TEXTS.account}>
        <div className="flex items-center justify-between gap-4">
          <span className="min-w-0 flex-1 text-sm text-fg">
            {AUTH_TEXTS.signedInAs(accountEmail)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={signOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? AUTH_TEXTS.signingOut : AUTH_TEXTS.signOut}
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="min-w-0 flex-1 text-subtle">
            {AUTH_TEXTS.deleteAccountDescription}
          </span>
          <DeleteAccountDialog accountEmail={accountEmail} />
        </div>
        <Link
          to={PRIVACY_PATH}
          className="text-caption underline hover:text-fg"
        >
          {PRIVACY_TEXTS.linkLabel}
        </Link>
      </SettingsSection>
    </>
  )
}
