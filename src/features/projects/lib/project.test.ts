import { describe, expect, it } from 'vitest'
import {
  buildProjectLabels,
  buildProjectOptions,
  formatTaskCode,
  isStudyProject,
} from './project'
import { makeProject } from '@/test/factories'

describe('isStudyProject', () => {
  it('reconhece projeto de estudo', () => {
    expect(isStudyProject({ type: 'study' })).toBe(true)
  })

  it('recusa projeto geral e projeto ausente', () => {
    expect(isStudyProject({ type: 'general' })).toBe(false)
    expect(isStudyProject(null)).toBe(false)
    expect(isStudyProject(undefined)).toBe(false)
  })
})

describe('rótulos de projeto', () => {
  it('prefixo e cor do tema para cada projeto; sem cor válida fica neutro', () => {
    const labels = buildProjectLabels([
      makeProject({ id: 'p1', prefix: 'REV', color: 'rose' }),
      makeProject({ id: 'p2', prefix: null, color: '#e3a857' }),
    ])
    expect(labels.get('p1')).toEqual({
      prefix: 'REV',
      color: 'var(--palette-rose)',
    })
    expect(labels.get('p2')).toEqual({
      prefix: '',
      color: 'var(--text-muted)',
    })
  })

  it('opções de filtro levam nome e cor', () => {
    expect(
      buildProjectOptions([
        makeProject({ id: 'p1', name: 'Casa', color: 'sage' }),
      ]),
    ).toEqual([{ id: 'p1', name: 'Casa', color: 'var(--palette-sage)' }])
  })

  it('código do card usa o prefixo, ou # quando o projeto não tem', () => {
    expect(formatTaskCode('REV', 4)).toBe('REV-4')
    expect(formatTaskCode('', 4)).toBe('#4')
  })
})
