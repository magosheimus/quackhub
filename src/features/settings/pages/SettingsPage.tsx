import { IconSettings } from '@/shared/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { PersonaManager } from '@/features/personas/components/PersonaManager'
import { AccountSettings } from '@/features/settings/components/AccountSettings'
import { AppearanceSettings } from '@/features/settings/components/AppearanceSettings'
import { PreferenceSettings } from '@/features/settings/components/PreferenceSettings'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import {
  SETTINGS_TAB_LABELS,
  SETTINGS_TEXTS,
} from '@/features/settings/constants/texts'
import { useSettingsPage } from '@/features/settings/hooks/useSettingsPage'
import { SETTINGS_TABS } from '@/features/settings/lib/settingsTab'

export function SettingsPage() {
  const { tab, selectTab } = useSettingsPage()

  return (
    <Tabs value={tab} onValueChange={selectTab}>
      <div className="flex flex-col gap-4">
        <PageTitle title={SETTINGS_TEXTS.title} icon={IconSettings} />
        <TabsList aria-label={SETTINGS_TEXTS.title}>
          {SETTINGS_TABS.map((settingsTab) => (
            <TabsTab key={settingsTab} value={settingsTab}>
              {SETTINGS_TAB_LABELS[settingsTab]}
            </TabsTab>
          ))}
        </TabsList>
      </div>

      <TabsPanel value="appearance">
        <AppearanceSettings />
      </TabsPanel>

      <TabsPanel value="preferences">
        <PreferenceSettings />
      </TabsPanel>

      <TabsPanel value="personas">
        <SettingsSection>
          <PersonaManager />
        </SettingsSection>
      </TabsPanel>

      <TabsPanel value="account">
        <AccountSettings />
      </TabsPanel>
    </Tabs>
  )
}
