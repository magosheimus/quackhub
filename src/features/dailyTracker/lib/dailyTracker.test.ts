import { describe, expect, it } from 'vitest'
import type { DailyLog, Habit, HabitLog } from '@/shared/types/entities'
import { makeSprint } from '@/test/factories'

import {
  getCurrentTrackerPeriod,
  getSprintDays,
  parseGoal,
  summarizeMood,
  trackedDays,
  buildHabitFields,
  formatDuration,
  getHabitFormValues,
  getHeatIntensity,
  getHeatTone,
  getDoneStreaks,
  getHueShift,
  HUE_JITTER_DEGREES,
  getWeekdayOrder,
  isScheduledOn,
  isMissedDay,
  isBeforeHabitStart,
  splitTodayHabits,
  computeOverallRate,
  computeHabitStats,
  isGoalMet,
  isMoodLevel,
  nextHabitValue,
  parseCounterValue,
  pickHabitHighlights,
  getDayWindow,
  DAY_WINDOW_SIZE,
} from './dailyTracker'
import { getDateRange } from '@/shared/lib/date'

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    weekdays: null,
    icon: 'target',
    duration_minutes: null,
    id: 'h1',
    user_id: 'user-1',
    name: 'Academia',
    type: 'boolean',
    goal: null,
    active: true,
    created_at: '2026-10-01T00:00:00Z',
    ...overrides,
  }
}

function makeLog(date: string, value = 1, habitId = 'h1'): HabitLog {
  return {
    id: `${habitId}-${date}`,
    user_id: 'user-1',
    habit_id: habitId,
    date,
    value,
    created_at: `${date}T12:00:00Z`,
  }
}

const WEEK = [
  '2026-10-11',
  '2026-10-12',
  '2026-10-13',
  '2026-10-14',
  '2026-10-15',
  '2026-10-16',
  '2026-10-17',
]

describe('isGoalMet', () => {
  it('hábito sim/não: basta 1', () => {
    expect(isGoalMet({ type: 'boolean', goal: null }, 1)).toBe(true)
    expect(isGoalMet({ type: 'boolean', goal: null }, 0)).toBe(false)
  })

  it('contador: valor >= meta', () => {
    expect(isGoalMet({ type: 'counter', goal: 5 }, 5)).toBe(true)
    expect(isGoalMet({ type: 'counter', goal: 5 }, 3)).toBe(false)
  })
})

describe('computeHabitStats', () => {
  it('5 de 7 dias → taxa 0.71', () => {
    const logs = WEEK.slice(0, 5).map((date) => makeLog(date))
    expect(computeHabitStats(makeHabit(), logs, WEEK)).toEqual({
      daysCompleted: 5,
      totalDays: 7,
      rate: 0.71,
    })
  })

  it('contador só conta os dias em que bateu a meta', () => {
    const habit = makeHabit({ type: 'counter', goal: 5 })
    const logs = [makeLog(WEEK[0], 5), makeLog(WEEK[1], 3)]
    expect(computeHabitStats(habit, logs, WEEK).daysCompleted).toBe(1)
  })
})

describe('computeOverallRate', () => {
  it('percentual de metas batidas entre todos os hábitos e dias', () => {
    const habits = [makeHabit(), makeHabit({ id: 'h2' })]
    const logs = [makeLog(WEEK[0]), makeLog(WEEK[1]), makeLog(WEEK[0], 1, 'h2')]
    expect(computeOverallRate(habits, logs, WEEK.slice(0, 2))).toBe(75)
  })
})

describe('isMoodLevel', () => {
  it('aceita só 1 a 5', () => {
    expect(isMoodLevel(3)).toBe(true)
    expect(isMoodLevel(0)).toBe(false)
    expect(isMoodLevel('3')).toBe(false)
  })
})

describe('nextHabitValue', () => {
  it('sim/não alterna entre 0 e 1', () => {
    expect(nextHabitValue({ type: 'boolean', goal: null }, 0)).toBe(1)
    expect(nextHabitValue({ type: 'boolean', goal: null }, 1)).toBe(0)
  })

  it('contador sobe até a meta e volta a zero', () => {
    const habit = { type: 'counter' as const, goal: 3 }
    expect(nextHabitValue(habit, 2)).toBe(3)
    expect(nextHabitValue(habit, 3)).toBe(0)
  })
})

describe('parseCounterValue', () => {
  it('aceita inteiro zero ou positivo', () => {
    expect(parseCounterValue('750')).toBe(750)
    expect(parseCounterValue('0')).toBe(0)
  })

  it('recusa vazio, negativo e decimal', () => {
    expect(parseCounterValue('')).toBeNull()
    expect(parseCounterValue('-1')).toBeNull()
    expect(parseCounterValue('2.5')).toBeNull()
  })
})

describe('parseGoal', () => {
  it('meta precisa ser inteira e maior que zero', () => {
    expect(parseGoal('5')).toBe(5)
    expect(parseGoal('0')).toBeNull()
    expect(parseGoal('abc')).toBeNull()
  })
})

describe('trackedDays', () => {
  it('hábito só conta a partir do dia em que foi criado', () => {
    const habit = makeHabit({ created_at: '2026-10-14T09:00:00Z' })
    expect(trackedDays(habit, WEEK)).toEqual([
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
    ])
  })

  it('a taxa geral ignora os dias antes da criação', () => {
    const habit = makeHabit({ created_at: '2026-10-16T09:00:00Z' })
    const logs = [makeLog('2026-10-16'), makeLog('2026-10-17')]
    expect(computeOverallRate([habit], logs, WEEK)).toBe(100)
  })

  it('usa o dia local da criação, não o dia em UTC', () => {
    const lateNight = new Date(2026, 9, 5, 23, 30).toISOString()
    const habit = makeHabit({ created_at: lateNight })
    expect(
      trackedDays(habit, ['2026-10-04', '2026-10-05', '2026-10-06']),
    ).toEqual(['2026-10-05', '2026-10-06'])
  })
})

describe('summarizeMood', () => {
  function makeDailyLog(date: string, mood: number): DailyLog {
    return {
      id: date,
      user_id: 'user-1',
      date,
      mood,
      comment: null,
      created_at: `${date}T20:00:00Z`,
    }
  }

  it('conta cada nível e arredonda a média', () => {
    const summary = summarizeMood([
      makeDailyLog('2026-10-11', 4),
      makeDailyLog('2026-10-12', 5),
      makeDailyLog('2026-10-13', 2),
    ])
    expect(summary.total).toBe(3)
    expect(summary.counts).toEqual({ 1: 0, 2: 1, 3: 0, 4: 1, 5: 1 })
    expect(summary.percents).toEqual({ 1: 0, 2: 33, 3: 0, 4: 33, 5: 33 })
    expect(summary.average).toBe(4)
  })

  it('sem registros não há média', () => {
    expect(summarizeMood([]).average).toBeNull()
  })
})

describe('getCurrentTrackerPeriod', () => {
  const active = makeSprint({
    name: 'Sprint 8',
    status: 'active',
    start_date: '2026-10-04',
    end_date: '2026-10-18',
  })

  it('usa a sprint ativa quando ela cobre hoje', () => {
    expect(getCurrentTrackerPeriod([active], '2026-10-14', 0)).toEqual({
      kind: 'sprint',
      name: 'Sprint 8',
      start: '2026-10-04',
      end: '2026-10-18',
    })
  })

  it('sem sprint cobrindo hoje, usa a semana atual', () => {
    expect(getCurrentTrackerPeriod([active], '2026-10-25', 0)).toMatchObject({
      kind: 'week',
      start: '2026-10-25',
      end: '2026-10-31',
    })
  })
})

describe('getSprintDays', () => {
  it('vai do início até o fim da sprint, sem passar de hoje', () => {
    const sprint = makeSprint({
      start_date: '2026-10-10',
      end_date: '2026-10-20',
    })
    expect(getSprintDays(sprint, '2026-10-12')).toEqual([
      '2026-10-10',
      '2026-10-11',
      '2026-10-12',
    ])
  })
})

describe('isScheduledOn', () => {
  it('sem dias definidos vale para todos os dias', () => {
    expect(isScheduledOn({ weekdays: null }, '2026-10-14')).toBe(true)
  })

  it('respeita os dias escolhidos (14/10/2026 é quarta)', () => {
    expect(isScheduledOn({ weekdays: [1, 3, 5] }, '2026-10-14')).toBe(true)
    expect(isScheduledOn({ weekdays: [1, 3, 5] }, '2026-10-15')).toBe(false)
  })
})

describe('agenda nos cálculos', () => {
  it('dia fora da agenda não conta como falha', () => {
    const habit = makeHabit({ weekdays: [1, 3, 5] })
    const logs = ['2026-10-12', '2026-10-14', '2026-10-16'].map((d) =>
      makeLog(d),
    )
    expect(computeHabitStats(habit, logs, WEEK)).toEqual({
      daysCompleted: 3,
      totalDays: 3,
      rate: 1,
    })
  })
})

describe('getWeekdayOrder', () => {
  it('começa no domingo ou na segunda', () => {
    expect(getWeekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(getWeekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0])
  })
})

describe('getHeatIntensity', () => {
  it('contador: proporção da meta, no máximo 1', () => {
    expect(getHeatIntensity({ type: 'counter', goal: 4 }, 2)).toBe(0.5)
    expect(getHeatIntensity({ type: 'counter', goal: 4 }, 9)).toBe(1)
  })

  it('sim/não: tudo ou nada', () => {
    expect(getHeatIntensity({ type: 'boolean', goal: null }, 1)).toBe(1)
    expect(getHeatIntensity({ type: 'boolean', goal: null }, 0)).toBe(0)
  })
})

describe('isBeforeHabitStart', () => {
  it('dias anteriores ao dia de criação ficam fora do hábito', () => {
    const habit = makeHabit({ created_at: '2026-10-14T09:00:00Z' })
    expect(isBeforeHabitStart(habit, '2026-10-13')).toBe(true)
    expect(isBeforeHabitStart(habit, '2026-10-14')).toBe(false)
  })
})

describe('isMissedDay', () => {
  const habit = makeHabit({
    created_at: '2026-10-05T09:00:00Z',
    weekdays: [1, 3, 5],
  })
  const today = '2026-10-14'

  it('dia agendado que já passou sem registro é falta', () => {
    expect(isMissedDay(habit, '2026-10-12', today, 0)).toBe(true)
  })

  it('hoje, dias com registro, fora da agenda ou antes da criação não são falta', () => {
    expect(isMissedDay(habit, today, today, 0)).toBe(false)
    expect(isMissedDay(habit, '2026-10-12', today, 1)).toBe(false)
    expect(isMissedDay(habit, '2026-10-13', today, 0)).toBe(false)
    expect(isMissedDay(habit, '2026-10-02', today, 0)).toBe(false)
  })
})

describe('getHeatTone', () => {
  const boolean = { type: 'boolean', goal: null } as const
  const counter = { type: 'counter', goal: 4 } as const

  it('sem registro fica vazio', () => {
    expect(getHeatTone(counter, 0, 0)).toBe('empty')
  })

  it('feito escurece a cada dia seguido, até o quarto tom', () => {
    expect(getHeatTone(boolean, 1, 1)).toBe('done-1')
    expect(getHeatTone(boolean, 1, 3)).toBe('done-3')
    expect(getHeatTone(counter, 4, 9)).toBe('done-4')
  })

  it('parcial vira um de três níveis de pontilhado', () => {
    expect(getHeatTone(counter, 1, 0)).toBe('partial-1')
    expect(getHeatTone(counter, 2, 0)).toBe('partial-2')
    expect(getHeatTone(counter, 3, 0)).toBe('partial-3')
    expect(getHeatTone({ type: 'counter', goal: 10 }, 9, 0)).toBe('partial-3')
  })
})

describe('getHueShift', () => {
  const seeds = WEEK.map((date) => `h1:${date}`)

  it('o mesmo quadrado sempre recebe o mesmo desvio', () => {
    expect(getHueShift('h1:2026-10-14')).toBe(getHueShift('h1:2026-10-14'))
  })

  it('fica dentro do limite e varia entre os dias', () => {
    const shifts = seeds.map(getHueShift)
    shifts.forEach((shift) => {
      expect(Math.abs(shift)).toBeLessThanOrEqual(HUE_JITTER_DEGREES)
    })
    expect(new Set(shifts).size).toBeGreaterThan(1)
  })
})

describe('getDoneStreaks', () => {
  it('conta dias seguidos e zera na falta', () => {
    const habit = makeHabit({ created_at: '2026-10-11T09:00:00Z' })
    const logs = ['2026-10-11', '2026-10-12', '2026-10-14'].map((date) =>
      makeLog(date),
    )
    expect(getDoneStreaks(habit, logs, WEEK)).toEqual({
      '2026-10-11': 1,
      '2026-10-12': 2,
      '2026-10-14': 1,
    })
  })

  it('dia fora da agenda não quebra a sequência', () => {
    const habit = makeHabit({
      created_at: '2026-10-11T09:00:00Z',
      weekdays: [1, 3],
    })
    const logs = [makeLog('2026-10-12'), makeLog('2026-10-14')]
    expect(getDoneStreaks(habit, logs, WEEK)).toMatchObject({
      '2026-10-14': 2,
    })
  })
})

describe('splitTodayHabits', () => {
  it('separa pendentes e feitos, só com os hábitos agendados para hoje', () => {
    const habits = [
      makeHabit({ id: 'a' }),
      makeHabit({ id: 'b' }),
      makeHabit({ id: 'c', weekdays: [0] }),
    ]
    const { pending, done } = splitTodayHabits(
      habits,
      [makeLog('2026-10-14', 1, 'b')],
      '2026-10-14',
    )
    expect(pending.map((item) => item.habit.id)).toEqual(['a'])
    expect(done.map((item) => item.habit.id)).toEqual(['b'])
  })
})

describe('buildHabitFields', () => {
  const base = getHabitFormValues()

  it('todos os dias marcados vira agenda vazia (todos os dias)', () => {
    expect(buildHabitFields({ ...base, name: 'Água' })).toMatchObject({
      name: 'Água',
      goal: null,
      weekdays: null,
      duration_minutes: null,
    })
  })

  it('guarda dias escolhidos em ordem e o tempo em minutos', () => {
    expect(
      buildHabitFields({
        ...base,
        name: 'Academia',
        weekdays: [5, 1, 3],
        durationText: '60',
      }),
    ).toMatchObject({ weekdays: [1, 3, 5], duration_minutes: 60 })
  })

  it('leva o ícone escolhido', () => {
    expect(
      buildHabitFields({ ...base, name: 'Leitura', icon: 'book' }),
    ).toMatchObject({ icon: 'book' })
  })

  it('recusa sem nome, sem dias, contador sem meta e tempo inválido', () => {
    expect(buildHabitFields(base)).toBeNull()
    expect(buildHabitFields({ ...base, name: 'X', weekdays: [] })).toBeNull()
    expect(
      buildHabitFields({ ...base, name: 'X', type: 'counter', goalText: '' }),
    ).toBeNull()
    expect(
      buildHabitFields({ ...base, name: 'X', durationText: 'abc' }),
    ).toBeNull()
  })
})

describe('formatDuration', () => {
  it('minutos, horas e horas com minutos', () => {
    expect(formatDuration(30)).toBe('30 min')
    expect(formatDuration(60)).toBe('1 h')
    expect(formatDuration(90)).toBe('1 h 30 min')
  })
})

describe('pickHabitHighlights', () => {
  const days = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08']
  const reading = makeHabit({ id: 'h1', name: 'Leitura' })
  const gym = makeHabit({ id: 'h2', name: 'Academia' })
  const water = makeHabit({ id: 'h3', name: 'Água' })

  it('maior taxa é o mais constante e a menor precisa de atenção', () => {
    const logs = [
      ...days.map((date) => makeLog(date, 1, 'h1')),
      makeLog(days[0], 1, 'h2'),
      makeLog(days[0], 1, 'h3'),
      makeLog(days[1], 1, 'h3'),
    ]
    expect(pickHabitHighlights([reading, gym, water], logs, days)).toEqual({
      mostConsistent: reading,
      needsAttention: gym,
    })
  })

  it('todos empatados não apontam quem precisa de atenção', () => {
    const logs = [makeLog(days[0], 1, 'h1'), makeLog(days[0], 1, 'h2')]
    expect(pickHabitHighlights([reading, gym], logs, days)).toEqual({
      mostConsistent: reading,
      needsAttention: null,
    })
  })

  it('sem nada feito não há mais constante', () => {
    expect(pickHabitHighlights([reading, gym], [], days)).toEqual({
      mostConsistent: null,
      needsAttention: null,
    })
  })
})

describe('getDayWindow', () => {
  const longSprint = getDateRange('2026-09-01', '2026-10-20')

  it('períodos curtos aparecem inteiros', () => {
    const week = getDateRange('2026-10-01', '2026-10-21')
    expect(getDayWindow(week, '2026-10-10', 0)).toEqual({
      days: week,
      isWindowed: false,
      canGoBack: false,
      canGoForward: false,
    })
  })

  it('período longo mostra uma janela que termina 3 dias depois de hoje', () => {
    const window = getDayWindow(longSprint, '2026-10-10', 0)
    expect(window.days).toHaveLength(DAY_WINDOW_SIZE)
    expect(window.days.at(-1)).toBe('2026-10-13')
    expect(window.canGoBack).toBe(true)
    expect(window.canGoForward).toBe(true)
  })

  it('voltar anda de semana em semana e para no começo do período', () => {
    expect(getDayWindow(longSprint, '2026-10-10', 1).days.at(-1)).toBe(
      '2026-10-06',
    )
    const start = getDayWindow(longSprint, '2026-10-10', 99)
    expect(start.days[0]).toBe('2026-09-01')
    expect(start.canGoBack).toBe(false)
  })

  it('perto do fim do período a janela encosta no último dia', () => {
    const end = getDayWindow(longSprint, '2026-10-19', 0)
    expect(end.days.at(-1)).toBe('2026-10-20')
    expect(end.canGoForward).toBe(false)
  })
})
