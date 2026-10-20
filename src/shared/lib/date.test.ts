import { describe, it, expect } from 'vitest'
import {
  daysBetween,
  formatDateTime,
  formatDateAs,
  getTimeSlots,
  parseTimeInput,
  formatDayMonth,
  formatFullDate,
  formatMonthYear,
  formatWeekdayName,
  getDateRange,
  getWeekDays,
  shiftDbDate,
  toDbDate,
} from './date'

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

describe('toDbDate', () => {
  it('formata como yyyy-MM-dd com zero à esquerda', () => {
    expect(toDbDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('shiftDbDate', () => {
  it('avança e volta dias atravessando o mês', () => {
    expect(shiftDbDate('2026-10-31', 1)).toBe('2026-11-01')
    expect(shiftDbDate('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('getWeekDays', () => {
  it('semana começando no domingo', () => {
    expect(getWeekDays('2026-10-14', 0)).toEqual([
      '2026-10-11',
      '2026-10-12',
      '2026-10-13',
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
    ])
  })

  it('semana começando na segunda, com a data num domingo', () => {
    expect(getWeekDays('2026-10-18', 1)[0]).toBe('2026-10-12')
    expect(getWeekDays('2026-10-18', 1)[6]).toBe('2026-10-18')
  })
})

describe('getDateRange', () => {
  it('lista todos os dias do intervalo, inclusive as pontas', () => {
    expect(getDateRange('2026-10-30', '2026-11-02')).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ])
  })

  it('início depois do fim devolve lista vazia', () => {
    expect(getDateRange('2026-10-05', '2026-10-01')).toEqual([])
  })
})

describe('daysBetween', () => {
  it('conta dias de calendário entre duas datas', () => {
    expect(daysBetween('2026-10-13', '2026-10-15')).toBe(2)
    expect(daysBetween('2026-10-15', '2026-10-15')).toBe(0)
    expect(daysBetween('2026-10-15', '2026-10-13')).toBe(-2)
  })

  it('atravessa troca de mês', () => {
    expect(daysBetween('2026-09-30', '2026-10-01')).toBe(1)
  })
})

describe('formatMonthYear', () => {
  it('mês por extenso com inicial maiúscula', () => {
    expect(formatMonthYear('2026-09')).toBe('Setembro de 2026')
  })
})

describe('formatDateTime', () => {
  it('mostra data e hora no horário local', () => {
    const timestamp = new Date(2026, 9, 17, 20, 52).toISOString()
    expect(formatDateTime(timestamp)).toBe('17/10/2026 · 20:52')
  })

  it('usa ? para data ausente', () => {
    expect(formatDateTime(null)).toBe('?')
  })
})

describe('formatWeekdayName', () => {
  it('dia da semana por extenso', () => {
    expect(formatWeekdayName(new Date(2026, 9, 20))).toBe('terça-feira')
  })
})

describe('formatDateAs', () => {
  it('respeita o formato escolhido', () => {
    expect(formatDateAs('2026-10-21', 'dd/MM/yyyy')).toBe('21/10/2026')
    expect(formatDateAs('2026-10-21', 'MM/dd/yyyy')).toBe('10/21/2026')
  })
})

describe('horários', () => {
  it('lista o dia de 30 em 30 minutos', () => {
    const slots = getTimeSlots()
    expect(slots).toHaveLength(48)
    expect(slots[0]).toBe('00:00')
    expect(slots[29]).toBe('14:30')
  })

  it('entende horários digitados em formatos livres', () => {
    expect(parseTimeInput('9')).toBe('09:00')
    expect(parseTimeInput('14h')).toBe('14:00')
    expect(parseTimeInput('14h30')).toBe('14:30')
    expect(parseTimeInput('14:30')).toBe('14:30')
    expect(parseTimeInput('1430')).toBe('14:30')
  })

  it('recusa horário inválido', () => {
    expect(parseTimeInput('25:00')).toBeNull()
    expect(parseTimeInput('10:75')).toBeNull()
    expect(parseTimeInput('abc')).toBeNull()
  })
})
