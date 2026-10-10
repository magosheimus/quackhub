import { describe, it, expect } from 'vitest'
import { getInitialStatusForType, getStatusLabel } from './taskStatus'

describe('getStatusLabel', () => {
  it('traduz status conhecidos', () => {
    expect(getStatusLabel('to_review')).toBe('A REVISAR')
    expect(getStatusLabel('done')).toBe('FINALIZADO')
  })

  it('devolve o próprio valor quando não é um status', () => {
    expect(getStatusLabel('agendado')).toBe('agendado')
  })

  it('devolve string vazia para nulo', () => {
    expect(getStatusLabel(null)).toBe('')
    expect(getStatusLabel(undefined)).toBe('')
  })
})

describe('getInitialStatusForType', () => {
  it('usa to_study para projetos de estudo e todo para gerais', () => {
    expect(getInitialStatusForType('study')).toBe('to_study')
    expect(getInitialStatusForType('general')).toBe('todo')
  })
})
