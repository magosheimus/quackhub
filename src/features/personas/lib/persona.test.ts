import { describe, expect, it } from 'vitest'
import {
  findPersonaOption,
  getPersonaIconKey,
  getPersonasInTasks,
  hasPersonaGlyph,
  normalizePersonaName,
  resolvePersonaGlyph,
  toPersonaOption,
} from './persona'

describe('normalizePersonaName', () => {
  it('remove espaços nas pontas', () => {
    expect(normalizePersonaName('  Shimi loja ')).toBe('Shimi loja')
  })

  it('retorna null para nome vazio', () => {
    expect(normalizePersonaName('   ')).toBeNull()
  })
})

describe('getPersonaIconKey', () => {
  it('retorna o ícone salvo quando é válido', () => {
    expect(getPersonaIconKey({ icon: 'crown' })).toBe('crown')
  })

  it('retorna null sem ícone ou com valor desconhecido', () => {
    expect(getPersonaIconKey({ icon: null })).toBeNull()
    expect(getPersonaIconKey({ icon: 'unknown' })).toBeNull()
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

describe('opções de persona', () => {
  const options = [
    toPersonaOption({ id: 'p1', name: 'Mago Sheimus', icon: 'crown' }),
    toPersonaOption({ id: 'p2', name: 'Shimi', icon: 'unknown' }),
  ]

  it('normaliza o ícone na opção', () => {
    expect(options[1]).toEqual({ id: 'p2', name: 'Shimi', icon: null })
  })

  it('encontra a persona atribuída', () => {
    expect(findPersonaOption(options, 'p1')?.name).toBe('Mago Sheimus')
    expect(findPersonaOption(options, 'p9')).toBeNull()
    expect(findPersonaOption(options, null)).toBeNull()
  })

  it('mantém só as personas atribuídas a algum card', () => {
    const tasks = [{ assignee_id: 'p2' }, { assignee_id: null }]
    expect(getPersonasInTasks(options, tasks).map((p) => p.id)).toEqual(['p2'])
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
