import { describe, expect, it } from 'vitest'
import { buildProjectMove } from './projectMove'

describe('buildProjectMove', () => {
  it('troca o projeto e tira o épico, que era do projeto antigo', () => {
    expect(
      buildProjectMove({ status: 'doing' }, { id: 'p2', type: 'general' }),
    ).toEqual({ project_id: 'p2', epic_id: null, status: 'doing' })
  })

  it('status que não existe no novo tipo volta ao inicial', () => {
    expect(
      buildProjectMove({ status: 'doing' }, { id: 'p2', type: 'study' }).status,
    ).toBe('to_study')
    expect(
      buildProjectMove({ status: 'studying' }, { id: 'p2', type: 'general' })
        .status,
    ).toBe('todo')
  })

  it('status comum aos dois tipos é mantido', () => {
    expect(
      buildProjectMove({ status: 'blocked' }, { id: 'p2', type: 'study' })
        .status,
    ).toBe('blocked')
  })
})
