import { useState } from 'react'
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
import { ClearCacheButton } from './ClearCacheButton'
import {
  loadSettings,
  saveSettings,
  applySettings,
  type Settings,
} from '@/lib/settings'
import {
  exportAllData,
  downloadSnapshotAsJson,
} from '@/services/settings/exportData'

const CARTUCHO_OPTIONS: {
  value: Settings['cartucho']
  label: string
  screen: string
  accent: string
}[] = [
  { value: 'sage', label: 'Sage', screen: '#c8cba4', accent: '#204f43' },
  { value: 'amber', label: 'Amber', screen: '#e0b878', accent: '#7a3b12' },
  { value: 'slate', label: 'Slate', screen: '#d8e0e4', accent: '#2c5a8a' },
  { value: 'earth', label: 'Earth', screen: '#f1dca7', accent: '#646d34' },
  {
    value: 'sage-dark',
    label: 'Sage Dark',
    screen: '#2e4632',
    accent: '#c9a24b',
  },
  {
    value: 'amber-dark',
    label: 'Amber Dark',
    screen: '#1d0d02',
    accent: '#b5651d',
  },
]

const FONT_OPTIONS: { value: Settings['fontBody']; label: string }[] = [
  { value: 'jetbrains', label: 'JetBrains Mono' },
  { value: 'ibm-plex', label: 'IBM Plex Mono' },
]

export function SettingsView() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [isExporting, setIsExporting] = useState(false)

  function update(partial: Partial<Settings>) {
    const next = saveSettings(partial)
    setSettings(next)
    applySettings(next)
  }

  async function handleExport() {
    setIsExporting(true)
    try {
      const snapshot = await exportAllData()
      downloadSnapshotAsJson(snapshot)
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : 'Falha ao exportar dados',
      )
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-heading text-xl text-[--text-primary]">
          Cartucho
        </span>
        <div className="flex flex-wrap gap-2">
          {CARTUCHO_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ cartucho: option.value })}
              className="w-20 flex flex-col items-center gap-1 p-2 bg-(--bg-surface)"
            >
              <div className="h-8 w-12" style={{ background: option.screen }} />

              <span className="text-xs text-[--text-muted]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-heading text-xl text-[--text-primary]">
          Textura
        </span>
        <Button
          type="button"
          variant={settings.texture === 'none' ? 'selected' : 'outline'}
          size="sm"
          className="w-fit"
          onClick={() => update({ texture: 'none' })}
        >
          Nenhuma
        </Button>

        <div className="flex items-center gap-2 border-t border-border pt-2">
          <Button
            type="button"
            variant={settings.texture === 'grid' ? 'selected' : 'outline'}
            size="sm"
            onClick={() => update({ texture: 'grid' })}
          >
            Grade
          </Button>
          <Slider
            value={[settings.gridOpacity]}
            onValueChange={(v) =>
              update({ gridOpacity: Array.isArray(v) ? v[0] : v })
            }
            className="w-32"
          />
          <span className="w-10 text-xs text-[--text-muted]">
            {settings.gridOpacity}%
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-2">
          <Button
            type="button"
            variant={settings.texture === 'dots' ? 'selected' : 'outline'}
            size="sm"
            onClick={() => update({ texture: 'dots' })}
          >
            Pontos
          </Button>
          <Slider
            value={[settings.dotsOpacity]}
            onValueChange={(v) =>
              update({ dotsOpacity: Array.isArray(v) ? v[0] : v })
            }
            className="w-32"
          />
          <span className="w-10 text-xs text-[--text-muted]">
            {settings.dotsOpacity}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={settings.scanlines}
            onCheckedChange={(checked) =>
              update({ scanlines: checked === true })
            }
            aria-labelledby="scanlines-label"
          />
          <span id="scanlines-label" className="text-xs text-[--text-muted]">
            Scanlines
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={settings.glow}
            onCheckedChange={(checked) => update({ glow: checked === true })}
            aria-labelledby="glow-label"
          />
          <span id="glow-label" className="text-xs text-[--text-muted]">
            Glow
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span id="font-label" className="text-xs text-[--text-muted]">
          Fonte do corpo
        </span>
        <Select
          value={settings.fontBody}
          onValueChange={(v) => update({ fontBody: v as Settings['fontBody'] })}
        >
          <SelectTrigger aria-labelledby="font-label">
            <SelectValue>
              {FONT_OPTIONS.find((o) => o.value === settings.fontBody)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span id="date-format-label" className="text-xs text-[--text-muted]">
          Formato de data
        </span>
        <Select
          value={settings.dateFormat}
          onValueChange={(v) =>
            update({ dateFormat: v as Settings['dateFormat'] })
          }
        >
          <SelectTrigger aria-labelledby="date-format-label">
            <SelectValue>{settings.dateFormat}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
            <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span id="week-start-label" className="text-xs text-[--text-muted]">
          Primeiro dia da semana
        </span>
        <Select
          value={String(settings.weekStartsOn)}
          onValueChange={(v) => update({ weekStartsOn: Number(v) as 0 | 1 })}
        >
          <SelectTrigger aria-labelledby="week-start-label">
            <SelectValue>
              {settings.weekStartsOn === 0 ? 'Domingo' : 'Segunda'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Domingo</SelectItem>
            <SelectItem value="1">Segunda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exportando...' : 'Exportar dados (.json)'}
        </Button>
        <ClearCacheButton />
      </div>
    </div>
  )
}
