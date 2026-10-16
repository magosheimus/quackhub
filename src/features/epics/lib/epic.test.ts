import { describe, expect, it } from 'vitest'
import { makeEpic } from '@/test/factories'
import {
  buildEpicLabels,
  buildEpicOptions,
  epicChipStyle,
  findEpicLabel,
} from './epic'

describe('rótulos de épico', () => {
  it('nome e cor do tema; sem cor fica neutro', () => {
    const labels = buildEpicLabels([
      makeEpic({ id: 'e1', name: 'Física', color: 'blue' }),
      makeEpic({ id: 'e2', name: 'Química', color: null }),
    ])
    expect(labels.get('e1')).toEqual({
      name: 'Física',
      color: 'var(--palette-blue)',
    })
    expect(labels.get('e2')?.color).toBe('var(--text-muted)')
  })

  it('opções mantêm a ordem dos épicos', () => {
    const options = buildEpicOptions([
      makeEpic({ id: 'e1', name: 'A' }),
      makeEpic({ id: 'e2', name: 'B' }),
    ])
    expect(options.map((option) => option.id)).toEqual(['e1', 'e2'])
  })
})

describe('findEpicLabel', () => {
  const epics = [makeEpic({ id: 'e1', name: 'Física', color: 'blue' })]

  it('acha o rótulo do épico do card', () => {
    expect(findEpicLabel(epics, 'e1')?.name).toBe('Física')
  })

  it('card sem épico ou épico removido não tem rótulo', () => {
    expect(findEpicLabel(epics, null)).toBeNull()
    expect(findEpicLabel(epics, 'e9')).toBeNull()
  })
})

describe('epicChipStyle', () => {
  it('suaviza a cor do épico no fundo', () => {
    expect(epicChipStyle('var(--palette-blue)')).toEqual({
      backgroundColor:
        'color-mix(in oklch, var(--palette-blue) 50%, transparent)',
    })
  })
})
