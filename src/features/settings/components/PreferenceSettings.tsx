import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DATE_FORMATS, FONT_BODIES } from '@/features/settings/lib/settings'
import {
  FONT_LABELS,
  SETTINGS_TEXTS,
  WEEK_START_LABELS,
} from '@/features/settings/constants/texts'
import { usePreferenceSettings } from '@/features/settings/hooks/usePreferenceSettings'
import { SettingsSection } from './SettingsSection'

export function PreferenceSettings() {
  const { settings, selectFontBody, selectDateFormat, selectWeekStart } =
    usePreferenceSettings()

  return (
    <SettingsSection>
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
        <Select value={settings.dateFormat} onValueChange={selectDateFormat}>
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
    </SettingsSection>
  )
}
