import { describe, expect, it } from 'vitest'
import {
  findPersona,
  getPersonasInTasks,
  hasPersonaGlyph,
  normalizePersonaName,
  resolvePersonaGlyph,
} from './persona'
import type { Persona } from '@/features/personas/model/persona'

describe('normalizePersonaName', () => {
  it('remove espaços nas pontas', () => {
    expect(normalizePersonaName('  Shimi loja ')).toBe('Shimi loja')
  })

  it('retorna null para nome vazio', () => {
    expect(normalizePersonaName('   ')).toBeNull()
  })
})

describe('resolvePersonaGlyph', () => {
  it('usa o avatar escolhido', () => {
    expect(resolvePersonaGlyph('crown', 'Shimi')).toEqual({
      kind: 'icon',
      icon: 'crown',
    })
  })

  it('sem avatar usa a inicial do nome', () => {
    expect(resolvePersonaGlyph(null, 'Shimi')).toEqual({
      kind: 'letter',
      letter: 's',
    })
  })

  it('sem avatar e sem inicial fica vazio', () => {
    expect(resolvePersonaGlyph(null, '')).toEqual({ kind: 'empty' })
  })
})

describe('personas atribuídas', () => {
  const personas: Persona[] = [
    { id: 'p1', name: 'Mago Sheimus', icon: 'crown' },
    { id: 'p2', name: 'Shimi', icon: null },
  ]

  it('encontra a persona atribuída', () => {
    expect(findPersona(personas, 'p1')?.name).toBe('Mago Sheimus')
    expect(findPersona(personas, 'p9')).toBeNull()
    expect(findPersona(personas, null)).toBeNull()
  })

  it('mantém só as personas atribuídas a algum card', () => {
    const tasks = [{ assigneeId: 'p2' }, { assigneeId: null }]
    expect(getPersonasInTasks(personas, tasks).map((p) => p.id)).toEqual(['p2'])
  })
})

describe('hasPersonaGlyph', () => {
  it('sem ícone e sem nome não tem o que mostrar', () => {
    expect(hasPersonaGlyph(null, '')).toBe(false)
  })

  it('com nome ou ícone tem', () => {
    expect(hasPersonaGlyph(null, 'Shimi')).toBe(true)
    expect(hasPersonaGlyph('crown', '')).toBe(true)
  })
})
