import { describe, expect, it } from 'vitest'
import { isStudyProject } from './project'

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
