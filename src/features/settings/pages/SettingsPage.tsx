import { IconSettings } from '@/shared/lib/icons'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClearCacheButton } from '@/features/settings/components/ClearCacheButton'
import {
  DATE_FORMATS,
  FONT_BODIES,
  type Settings,
} from '@/features/settings/lib/settings'
import { useSettingsPage } from '@/features/settings/hooks/useSettingsPage'
import { PageTitle } from '@/components/ui/page-title'
import {
  FONT_LABELS,
  SETTINGS_TEXTS,
  TEXTURE_LABELS,
  WEEK_START_LABELS,
} from '@/features/settings/constants/texts'
import { Panel } from '@/components/ui/panel'
import { AUTH_TEXTS } from '@/features/auth/constants/texts'

const TEXTURES: Settings['texture'][] = ['none', 'grid', 'dots']

function SettingsCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-fg">
        {title}
      </span>
      {children}
    </Panel>
  )
}

export function SettingsPage() {
  const {
    settings,
    textureOpacity,
    update,
    setTextureOpacity,
    selectFontBody,
    selectDateFormat,
    selectWeekStart,
    isExporting,
    exportData,
    accountEmail,
    signOut,
    isSigningOut,
  } = useSettingsPage()

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={SETTINGS_TEXTS.title} icon={IconSettings} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard title={SETTINGS_TEXTS.appearance}>
          <div className="flex flex-wrap gap-2">
            {TEXTURES.map((texture) => (
              <Button
                key={texture}
                type="button"
                size="sm"
                variant={settings.texture === texture ? 'selected' : 'outline'}
                onClick={() => update({ texture })}
              >
                {TEXTURE_LABELS[texture]}
              </Button>
            ))}
          </div>

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
                onCheckedChange={(checked) =>
                  update({ glow: checked === true })
                }
                aria-labelledby="glow-label"
              />
              <span id="glow-label" className="text-caption">
                {SETTINGS_TEXTS.glow}
              </span>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title={SETTINGS_TEXTS.preferences}>
          <div className="flex flex-col gap-1.5">
            <span id="font-label" className="text-caption">
              {SETTINGS_TEXTS.bodyFont}
            </span>
            <Select value={settings.fontBody} onValueChange={selectFontBody}>
              <SelectTrigger aria-labelledby="font-label">
                <SelectValue>{FONT_LABELS[settings.fontBody]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_BODIES.map((font) => (
                  <SelectItem key={font} value={font}>
                    {FONT_LABELS[font]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="date-format-label" className="text-caption">
              {SETTINGS_TEXTS.dateFormat}
            </span>
            <Select
              value={settings.dateFormat}
              onValueChange={selectDateFormat}
            >
              <SelectTrigger aria-labelledby="date-format-label">
                <SelectValue>{settings.dateFormat}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="week-start-label" className="text-caption">
              {SETTINGS_TEXTS.weekStart}
            </span>
            <Select
              value={String(settings.weekStartsOn)}
              onValueChange={selectWeekStart}
            >
              <SelectTrigger aria-labelledby="week-start-label">
                <SelectValue>
                  {WEEK_START_LABELS[settings.weekStartsOn]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{WEEK_START_LABELS[0]}</SelectItem>
                <SelectItem value="1">{WEEK_START_LABELS[1]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard title={SETTINGS_TEXTS.data}>
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
      </SettingsCard>

      <SettingsCard title={AUTH_TEXTS.account}>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-fg">
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
      </SettingsCard>
    </div>
  )
}
