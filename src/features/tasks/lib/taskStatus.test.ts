import { describe, it, expect } from 'vitest'
import {
  getInitialStatusForType,
  getStatusLabel,
  getStatusOptions,
} from './taskStatus'

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

describe('getStatusOptions', () => {
  it('projeto de estudo usa as situações de estudo, sem agendado', () => {
    expect(getStatusOptions('study')).toEqual([
      'to_study',
      'studying',
      'to_review',
      'blocked',
      'done',
    ])
  })

  it('projeto geral ou desconhecido usa as situações gerais', () => {
    expect(getStatusOptions('general')).toEqual([
      'todo',
      'doing',
      'blocked',
      'done',
    ])
    expect(getStatusOptions(null)).toEqual(getStatusOptions('general'))
  })
})
