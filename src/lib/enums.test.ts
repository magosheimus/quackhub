import { describe, it, expect } from 'vitest'
import { isProjectType, isTaskPriority, isTaskStatus } from './enums'

describe('enum guards', () => {
  it('aceita valores do enum', () => {
    expect(isTaskStatus('to_study')).toBe(true)
    expect(isTaskPriority('high')).toBe(true)
    expect(isProjectType('study')).toBe(true)
  })

  it('rejeita valores fora do enum, nulos e não-strings', () => {
    expect(isTaskStatus('agendado')).toBe(false)
    expect(isTaskPriority('alta')).toBe(false)
    expect(isProjectType(null)).toBe(false)
    expect(isProjectType(undefined)).toBe(false)
    expect(isTaskStatus(42)).toBe(false)
  })
})
