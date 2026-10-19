import { Slider } from '@/components/ui/slider'
import {
  OnOffStepper,
  OptionStepper,
} from '@/components/pickers/option-stepper'
import { FONT_BODIES, LCD_GHOSTS } from '@/features/settings/lib/settings'
import {
  FONT_LABELS,
  LCD_GHOST_LABELS,
  SETTINGS_TEXTS,
} from '@/features/settings/constants/texts'
import { useAppearanceSettings } from '@/features/settings/hooks/useAppearanceSettings'
import { CartuchoOptions } from './CartuchoOptions'
import {
  SettingsAction,
  SettingsGroup,
  SettingsOption,
  SettingsOptionList,
} from './SettingsGroup'
import { SettingsSection } from './SettingsSection'
import { TextureOptions } from './TextureOptions'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'

export function AppearanceSettings() {
  const {
    settings,
    update,
    textureOpacity,
    setTextureOpacity,
    restoreDefaults,
    isConfirmingRestore,
    setIsConfirmingRestore,
  } = useAppearanceSettings()

  return (
    <SettingsSection>
      <SettingsGroup title={SETTINGS_TEXTS.cartucho}>
        <CartuchoOptions
          selected={settings.cartucho}
          onSelect={(cartucho) => update({ cartucho })}
          className="flex-wrap"
        />
      </SettingsGroup>

      <SettingsGroup title={SETTINGS_TEXTS.typography}>
        <SettingsOptionList>
          <SettingsOption label={SETTINGS_TEXTS.bodyFont}>
            <OptionStepper
              label={SETTINGS_TEXTS.bodyFont}
              options={FONT_BODIES}
              value={settings.fontBody}
              labels={FONT_LABELS}
              onChange={(fontBody) => update({ fontBody })}
            />
          </SettingsOption>
        </SettingsOptionList>
      </SettingsGroup>

      <SettingsGroup title={SETTINGS_TEXTS.background}>
        <TextureOptions
          selected={settings.texture}
          opacity={settings.textureOpacity}
          onSelect={(texture) => update({ texture })}
        />
        {settings.texture !== 'none' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-fg">{SETTINGS_TEXTS.intensity}</span>
            <Slider
              value={[textureOpacity]}
              onValueChange={setTextureOpacity}
              className="data-horizontal:w-64"
            />
            <span className="w-10 text-caption">{textureOpacity}%</span>
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup title={SETTINGS_TEXTS.effects}>
        <SettingsOptionList>
          <SettingsOption label={SETTINGS_TEXTS.scanlines}>
            <OnOffStepper
              label={SETTINGS_TEXTS.scanlines}
              checked={settings.scanlines}
              onChange={(scanlines) => update({ scanlines })}
            />
          </SettingsOption>
          <SettingsOption label={SETTINGS_TEXTS.glow}>
            <OnOffStepper
              label={SETTINGS_TEXTS.glow}
              checked={settings.glow}
              onChange={(glow) => update({ glow })}
            />
          </SettingsOption>
          {settings.glow && (
            <SettingsOption label={SETTINGS_TEXTS.lcdGhost}>
              <OptionStepper
                label={SETTINGS_TEXTS.lcdGhost}
                options={LCD_GHOSTS}
                value={settings.lcdGhost}
                labels={LCD_GHOST_LABELS}
                onChange={(lcdGhost) => update({ lcdGhost })}
              />
            </SettingsOption>
          )}
        </SettingsOptionList>
      </SettingsGroup>
      <SettingsAction
        title={SETTINGS_TEXTS.restoreAppearance}
        description={SETTINGS_TEXTS.restoreAppearanceDescription}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsConfirmingRestore(true)}
        >
          {SETTINGS_TEXTS.restoreAppearance}
        </Button>
      </SettingsAction>
      <ConfirmDialog
        open={isConfirmingRestore}
        onOpenChange={setIsConfirmingRestore}
        title={SETTINGS_TEXTS.restoreAppearanceTitle}
        description={SETTINGS_TEXTS.restoreAppearanceDescription}
        confirmLabel={SETTINGS_TEXTS.restoreAppearanceConfirm}
        onConfirm={restoreDefaults}
      />
    </SettingsSection>
  )
}
