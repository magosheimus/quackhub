import { IconSettings } from '@/lib/icons'
import { useState, type ReactNode } from 'react'
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
import { PageTitle } from '@/components/ui/page-title'

const TEXTURE_OPTIONS: { value: Settings['texture']; label: string }[] = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'grid', label: 'Grade' },
  { value: 'dots', label: 'Pontos' },
]

const FONT_OPTIONS: { value: Settings['fontBody']; label: string }[] = [
  { value: 'jetbrains', label: 'JetBrains Mono' },
  { value: 'ibm-plex', label: 'IBM Plex Mono' },
]

function SettingsCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-(--bg-card) p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-(--text-primary)">
        {title}
      </span>
      {children}
    </div>
  )
}

export function SettingsView() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [isExporting, setIsExporting] = useState(false)

  const opacity =
    settings.texture === 'dots' ? settings.dotsOpacity : settings.gridOpacity

  function update(partial: Partial<Settings>) {
    const next = saveSettings(partial)
    setSettings(next)
    applySettings(next)
  }

  function handleOpacityChange(value: number) {
    update(
      settings.texture === 'dots'
        ? { dotsOpacity: value }
        : { gridOpacity: value },
    )
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
    <div className="flex flex-col gap-6">
      <PageTitle title="Configurações" icon={IconSettings} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard title="Aparência">
          <div className="flex flex-wrap gap-2">
            {TEXTURE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={
                  settings.texture === option.value ? 'selected' : 'outline'
                }
                onClick={() => update({ texture: option.value })}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {settings.texture !== 'none' && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-(--text-muted)">Intensidade</span>
              <Slider
                value={[opacity]}
                onValueChange={(v) =>
                  handleOpacityChange(Array.isArray(v) ? v[0] : v)
                }
                className="flex-1"
              />
              <span className="w-10 text-xs text-(--text-muted)">
                {opacity}%
              </span>
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
              <span
                id="scanlines-label"
                className="text-xs text-[--text-muted]"
              >
                Scanlines
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
              <span id="glow-label" className="text-xs text-[--text-muted]">
                Glow
              </span>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Preferências">
          <div className="flex flex-col gap-1.5">
            <span id="font-label" className="text-xs text-[--text-muted]">
              Fonte do corpo
            </span>
            <Select
              value={settings.fontBody}
              onValueChange={(v) =>
                update({ fontBody: v as Settings['fontBody'] })
              }
            >
              <SelectTrigger aria-labelledby="font-label">
                <SelectValue>
                  {
                    FONT_OPTIONS.find((o) => o.value === settings.fontBody)
                      ?.label
                  }
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
            <span
              id="date-format-label"
              className="text-xs text-[--text-muted]"
            >
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
              onValueChange={(v) =>
                update({ weekStartsOn: Number(v) as 0 | 1 })
              }
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
        </SettingsCard>
      </div>

      <SettingsCard title="Dados">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-(--text-primary)">
              Exportar dados
            </span>
            <span className="text-xs text-(--text-muted)">
              Baixa um .json com todas as suas informações.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-sm text-(--text-primary)">Limpar cache</span>
            <span className="text-xs text-(--text-muted)">
              Remove os dados salvos no navegador e recarrega a página.
            </span>
          </div>
          <ClearCacheButton />
        </div>
      </SettingsCard>
    </div>
  )
}
