import { NEUTRAL_COLOR, resolvePaletteColor } from '@/shared/lib/palette'
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
