import { describe, expect, it } from 'vitest'
import { findDueToken, formatDue, removeDueToken } from './due'

// Sexta-feira, 16/10/2026, 10:00
const NOW = new Date(2026, 9, 16, 10, 0)
const TODAY = '2026-10-16'
const find = (title: string, weekStartsOn: 0 | 1 = 1) =>
  findDueToken(title, NOW, weekStartsOn)
const dateOf = (title: string) => find(title)?.dueDate

describe('datas relativas', () => {
  it('hoje, amanhã (com e sem acento) e depois de amanhã', () => {
    expect(dateOf('pagar @hoje')).toBe('2026-10-16')
    expect(dateOf('consulta @amanhã')).toBe('2026-10-17')
    expect(dateOf('consulta @amanha')).toBe('2026-10-17')
    expect(dateOf('ligar @depois de amanhã')).toBe('2026-10-18')
  })

  it('em N dias, semanas ou meses (também "daqui a" e "+")', () => {
    expect(dateOf('revisar @em 5 dias')).toBe('2026-10-21')
    expect(dateOf('revisar @daqui a 3 semanas')).toBe('2026-11-06')
    expect(dateOf('revisar @+2 dias')).toBe('2026-10-18')
    expect(dateOf('renovar @em 2 meses')).toBe('2026-12-16')
  })

  it('próxima semana, próximo mês e próximo ano', () => {
    expect(dateOf('revisar @semana que vem')).toBe('2026-10-19')
    expect(find('revisar @próxima semana', 0)?.dueDate).toBe('2026-10-18')
    expect(dateOf('fatura @próximo mês')).toBe('2026-11-16')
    expect(dateOf('planejar @próximo ano')).toBe('2027-01-01')
  })

  it('fim de semana, fim do mês e meio do mês', () => {
    expect(dateOf('faxina @fim de semana')).toBe('2026-10-17')
    expect(dateOf('faxina @neste fim de semana')).toBe('2026-10-17')
    expect(dateOf('viagem @próximo fim de semana')).toBe('2026-10-24')
    expect(dateOf('fechar @fim do mês')).toBe('2026-10-31')
    expect(dateOf('fechar @final do mês')).toBe('2026-10-31')
    expect(dateOf('pagar @meio do mês')).toBe('2026-10-15')
    expect(dateOf('férias @meio de janeiro')).toBe('2027-01-15')
  })
})

describe('dias da semana', () => {
  it('o próximo a ocorrer; o próprio dia é hoje', () => {
    expect(dateOf('reunião @seg')).toBe('2026-10-19')
    expect(dateOf('reunião @segunda-feira')).toBe('2026-10-19')
    expect(dateOf('feira @sáb')).toBe('2026-10-17')
    expect(dateOf('entrega @sexta')).toBe('2026-10-16')
  })

  it('"próxima" pula para a semana seguinte se o dia ainda não chegou', () => {
    expect(dateOf('feira @próximo sábado')).toBe('2026-10-24')
    expect(dateOf('reunião @próxima segunda')).toBe('2026-10-19')
    expect(dateOf('entrega @próxima sexta')).toBe('2026-10-23')
  })
})

describe('datas exatas', () => {
  it('dd/mm, com ano de 4 ou 2 dígitos e ISO', () => {
    expect(dateOf('consulta @20/10')).toBe('2026-10-20')
    expect(dateOf('consulta @20/10/2027')).toBe('2027-10-20')
    expect(dateOf('consulta @20/10/27')).toBe('2027-10-20')
    expect(dateOf('consulta @2026-12-01')).toBe('2026-12-01')
  })

  it('nome do mês: "27 jan", "27 de janeiro", com ano opcional', () => {
    expect(dateOf('prova @27 jan')).toBe('2027-01-27')
    expect(dateOf('prova @27 de janeiro')).toBe('2027-01-27')
    expect(dateOf('evento @3 de novembro de 2026')).toBe('2026-11-03')
  })

  it('"dia 27" é deste mês; se já passou, do próximo', () => {
    expect(dateOf('pagar @dia 27')).toBe('2026-10-27')
    expect(dateOf('pagar @dia 5')).toBe('2026-11-05')
  })

  it('sem ano, uma data que já passou vai para o ano seguinte', () => {
    expect(dateOf('consulta @05/01')).toBe('2027-01-05')
  })
})

describe('horário', () => {
  it('14h, 14h30, 14:00 e "às 10"', () => {
    expect(find('reunião @14h')?.dueTime).toBe('14:00')
    expect(find('reunião @14h30')?.dueTime).toBe('14:30')
    expect(find('reunião @14:00')?.dueTime).toBe('14:00')
    expect(find('reunião @hoje às 10')?.dueTime).toBe('10:00')
  })

  it('aceita sufixos depois da hora e tira junto do título', () => {
    const title = 'Sessão de psicologia @21/10 às 14:00 hs'
    const token = find(title)
    expect(token).toMatchObject({ dueDate: '2026-10-21', dueTime: '14:00' })
    expect(token && removeDueToken(title, token)).toBe('Sessão de psicologia')
    expect(find('reunião @14:00h')?.dueTime).toBe('14:00')
    expect(find('reunião @14hs')?.dueTime).toBe('14:00')
    expect(find('reunião @amanhã 14 horas')?.dueTime).toBe('14:00')
    expect(find('reunião @amanhã às 16 hrs')?.dueTime).toBe('16:00')
  })

  it('não confunde o "h" de outra palavra com sufixo', () => {
    const title = 'ligar @20/10 14:00 hoje cedo'
    expect(find(title)?.text).toBe('@20/10 14:00')
  })

  it('só horário: hoje, ou amanhã se já passou', () => {
    expect(find('reunião @14h')?.dueDate).toBe(TODAY)
    expect(find('reunião @9h')?.dueDate).toBe('2026-10-17')
  })

  it('períodos do dia: manhã 9h, tarde 12h, noite 19h', () => {
    expect(find('ligar @amanhã de manhã')).toMatchObject({
      dueDate: '2026-10-17',
      dueTime: '09:00',
    })
    expect(find('ligar @amanhã à tarde')?.dueTime).toBe('12:00')
    expect(find('ligar @hoje à noite')?.dueTime).toBe('19:00')
    expect(find('ligar @de tarde')?.dueDate).toBe(TODAY)
  })

  it('em N horas', () => {
    expect(find('remédio @em 2 horas')).toMatchObject({
      dueDate: TODAY,
      dueTime: '12:00',
    })
  })

  it('combina data e horário', () => {
    expect(find('consulta @amanhã 14h')).toMatchObject({
      dueDate: '2026-10-17',
      dueTime: '14:00',
      text: '@amanhã 14h',
    })
    expect(find('consulta @20/10 às 14:00')).toMatchObject({
      dueDate: '2026-10-20',
      dueTime: '14:00',
    })
    expect(find('jantar @sex 19h')?.dueTime).toBe('19:00')
  })
})

describe('sem data', () => {
  it('"@sem data" e "@sem prazo" removem o prazo', () => {
    expect(find('ideia @sem data')).toMatchObject({
      dueDate: null,
      dueTime: null,
      clearsDue: true,
    })
    expect(find('ideia @sem prazo')?.clearsDue).toBe(true)
  })
})

describe('o que não é prazo', () => {
  it('ignora @ que não é data nem horário', () => {
    expect(find('falar com @maria')).toBeNull()
    expect(find('sem prazo')).toBeNull()
    expect(find('ver @sexy')).toBeNull()
  })

  it('ignora data ou horário inválido', () => {
    expect(find('consulta @31/02')).toBeNull()
    expect(find('consulta @25h')).toBeNull()
  })

  it('pula um @ que não é prazo e acha o seguinte', () => {
    expect(find('com @maria @amanhã')?.text).toBe('@amanhã')
  })
})

describe('removeDueToken', () => {
  it('tira o trecho e ajusta os espaços', () => {
    const title = 'consulta @amanhã 14h com a Dra'
    const token = find(title)
    expect(token && removeDueToken(title, token)).toBe('consulta com a Dra')
  })
})

describe('formatDue', () => {
  const labels = { today: 'Hoje', tomorrow: 'Amanhã' }

  it('hoje e amanhã por nome, demais dias em dd/mm, com horário', () => {
    expect(formatDue(TODAY, '14:00:00', TODAY, labels)).toEqual({
      text: 'Hoje · 14:00',
      tone: 'today',
    })
    expect(formatDue('2026-10-17', null, TODAY, labels).text).toBe('Amanhã')
    expect(formatDue('2026-10-20', '09:30:00', TODAY, labels)).toEqual({
      text: '20/10 · 09:30',
      tone: 'upcoming',
    })
  })

  it('prazo passado fica como atrasado', () => {
    expect(formatDue('2026-10-14', null, TODAY, labels).tone).toBe('overdue')
  })
})
