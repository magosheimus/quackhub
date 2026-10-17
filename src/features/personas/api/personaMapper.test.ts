import { describe, expect, it } from 'vitest'
import { toPersona, toPersonaInsert, toPersonaUpdate } from './personaMapper'

const row = {
  id: 'p1',
  name: 'Mago Sheimus',
  icon: 'crown',
  user_id: 'u1',
  created_at: '2026-10-15T12:00:00Z',
}

describe('toPersona', () => {
  it('mantém o ícone válido e descarta os campos do banco', () => {
    expect(toPersona(row)).toEqual({
      id: 'p1',
      name: 'Mago Sheimus',
      icon: 'crown',
    })
  })

  it('troca ícone desconhecido ou vazio por null', () => {
    expect(toPersona({ ...row, icon: 'unknown' }).icon).toBeNull()
    expect(toPersona({ ...row, icon: null }).icon).toBeNull()
  })
})

describe('toPersonaInsert', () => {
  it('envia só nome e ícone', () => {
    expect(toPersonaInsert({ name: 'Shimi', icon: null })).toEqual({
      name: 'Shimi',
      icon: null,
    })
  })
})

describe('toPersonaUpdate', () => {
  it('deixa de fora o que não mudou', () => {
    expect(toPersonaUpdate({ name: 'Shimi' })).toEqual({
      name: 'Shimi',
      icon: undefined,
    })
  })
})
