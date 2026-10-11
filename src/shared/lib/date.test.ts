import { describe, it, expect } from 'vitest'
import { formatDayMonth, formatFullDate } from './date'

describe('formatDayMonth', () => {
  it('formata como dd/MM', () => {
    expect(formatDayMonth('2026-10-07')).toBe('07/10')
  })

  it('usa ? para data ausente', () => {
    expect(formatDayMonth(null)).toBe('?')
  })
})

describe('formatFullDate', () => {
  it('formata como dd/MM/yyyy', () => {
    expect(formatFullDate('2026-10-07')).toBe('07/10/2026')
  })

  it('usa ? para data ausente', () => {
    expect(formatFullDate(null)).toBe('?')
  })
})
