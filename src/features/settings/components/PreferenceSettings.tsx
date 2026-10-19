import { OptionStepper } from '@/components/pickers/option-stepper'
import { DATE_FORMATS, WEEK_STARTS } from '@/features/settings/lib/settings'
import {
  DATE_FORMAT_LABELS,
  SETTINGS_TEXTS,
  WEEK_START_LABELS,
} from '@/features/settings/constants/texts'
import { usePreferenceSettings } from '@/features/settings/hooks/usePreferenceSettings'
import {
  SettingsGroup,
  SettingsOption,
  SettingsOptionList,
} from './SettingsGroup'
import { SettingsSection } from './SettingsSection'

export function PreferenceSettings() {
  const { settings, update } = usePreferenceSettings()

  return (
    <SettingsSection>
      <SettingsGroup title={SETTINGS_TEXTS.dates}>
        <SettingsOptionList>
          <SettingsOption label={SETTINGS_TEXTS.dateFormat}>
            <OptionStepper
              label={SETTINGS_TEXTS.dateFormat}
              options={DATE_FORMATS}
              value={settings.dateFormat}
              labels={DATE_FORMAT_LABELS}
              onChange={(dateFormat) => update({ dateFormat })}
            />
          </SettingsOption>
          <SettingsOption label={SETTINGS_TEXTS.weekStart}>
            <OptionStepper
              label={SETTINGS_TEXTS.weekStart}
              options={WEEK_STARTS}
              value={settings.weekStartsOn}
              labels={WEEK_START_LABELS}
              onChange={(weekStartsOn) => update({ weekStartsOn })}
            />
          </SettingsOption>
        </SettingsOptionList>
      </SettingsGroup>
    </SettingsSection>
  )
}
