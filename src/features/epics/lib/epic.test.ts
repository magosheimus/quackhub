import { describe, expect, it } from 'vitest'
import { makeEpic } from '@/test/factories'
import { buildEpicLabels, buildEpicOptions } from './epic'

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
