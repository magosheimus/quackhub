import { NEUTRAL_COLOR, resolvePaletteColor } from '@/shared/lib/palette'
import type { CSSProperties } from 'react'
import type { Epic } from '@/shared/types/entities'

export type EpicLabel = {
  name: string
  color: string
}

export type EpicLabels = Map<string, EpicLabel>

export function toEpicLabel(epic: Pick<Epic, 'name' | 'color'>): EpicLabel {
  return {
    name: epic.name,
    color: resolvePaletteColor(epic.color, NEUTRAL_COLOR),
  }
}

export function buildEpicLabels(
  epics: Pick<Epic, 'id' | 'name' | 'color'>[],
): EpicLabels {
  return new Map(epics.map((epic) => [epic.id, toEpicLabel(epic)]))
}

export type EpicOption = EpicLabel & { id: string }

export function buildEpicOptions(
  epics: Pick<Epic, 'id' | 'name' | 'color'>[],
): EpicOption[] {
  return Array.from(buildEpicLabels(epics), ([id, label]) => ({ id, ...label }))
}

export function findEpicLabel(
  epics: Pick<Epic, 'id' | 'name' | 'color'>[],
  epicId: string | null,
): EpicLabel | null {
  const epic = epicId ? epics.find((item) => item.id === epicId) : undefined
  return epic ? toEpicLabel(epic) : null
}

// Cor do épico suavizada no fundo: o texto continua legível em qualquer cartucho
export function epicChipStyle(color: string): CSSProperties {
  return {
    backgroundColor: `color-mix(in oklch, ${color} 50%, transparent)`,
  }
}
