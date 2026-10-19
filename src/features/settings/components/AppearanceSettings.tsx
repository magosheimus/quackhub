import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { LCD_GHOSTS } from '@/features/settings/lib/settings'
import {
  LCD_GHOST_LABELS,
  SETTINGS_TEXTS,
} from '@/features/settings/constants/texts'
import { useAppearanceSettings } from '@/features/settings/hooks/useAppearanceSettings'
import { CartuchoOptions } from './CartuchoOptions'
import { SettingsSection } from './SettingsSection'
import { TextureOptions } from './TextureOptions'

export function AppearanceSettings() {
  const { settings, update, textureOpacity, setTextureOpacity } =
    useAppearanceSettings()

  return (
    <SettingsSection>
      <div className="flex flex-col gap-2 lg:hidden">
        <span className="text-caption">{SETTINGS_TEXTS.cartucho}</span>
        <CartuchoOptions
          selected={settings.cartucho}
          onSelect={(cartucho) => update({ cartucho })}
          className="flex-wrap"
        />
      </div>

      <TextureOptions
        selected={settings.texture}
        opacity={settings.textureOpacity}
        onSelect={(texture) => update({ texture })}
      />

      {settings.texture !== 'none' && (
        <div className="flex items-center gap-3">
          <span className="text-caption">{SETTINGS_TEXTS.intensity}</span>
          <Slider
            value={[textureOpacity]}
            onValueChange={setTextureOpacity}
            className="flex-1"
          />
          <span className="w-10 text-caption">{textureOpacity}%</span>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={settings.scanlines}
            onCheckedChange={(checked) =>
              update({ scanlines: checked === true })
            }
            aria-labelledby="scanlines-label"
          />
          <span id="scanlines-label" className="text-caption">
            {SETTINGS_TEXTS.scanlines}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={settings.glow}
            onCheckedChange={(checked) => update({ glow: checked === true })}
            aria-labelledby="glow-label"
          />
          <span id="glow-label" className="text-caption">
            {SETTINGS_TEXTS.glow}
          </span>
        </div>
        {settings.glow && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption">{SETTINGS_TEXTS.lcdGhost}</span>
            {LCD_GHOSTS.map((lcdGhost) => (
              <Button
                key={lcdGhost}
                type="button"
                size="sm"
                variant={
                  settings.lcdGhost === lcdGhost ? 'selected' : 'outline'
                }
                onClick={() => update({ lcdGhost })}
              >
                {LCD_GHOST_LABELS[lcdGhost]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </SettingsSection>
  )
}
