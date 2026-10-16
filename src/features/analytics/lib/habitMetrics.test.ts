import { describe, expect, it } from 'vitest'
import type { DailyLog, Habit, HabitLog } from '@/shared/types/entities'
import { makeHabit as makeBaseHabit, makeSprint } from '@/test/factories'
import {
  buildSprintHabitTrend,
  getEarliestSprintStart,
  summarizeHabitPeriod,
} from './habitMetrics'

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return makeBaseHabit({ created_at: '2026-09-01T00:00:00Z', ...overrides })
}

function makeLog(date: string, habitId = 'h1', value = 1): HabitLog {
  return {
    id: `${habitId}-${date}`,
    user_id: 'user-1',
    habit_id: habitId,
    date,
    value,
    created_at: `${date}T12:00:00Z`,
  }
}

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

const DAYS = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']

describe('summarizeHabitPeriod', () => {
  it('calcula a taxa por hábito, a geral e o humor do período', () => {
    const summary = summarizeHabitPeriod(
      [makeHabit()],
      [makeLog('2026-10-01'), makeLog('2026-10-02'), makeLog('2026-10-03')],
      [makeDailyLog('2026-10-01', 4), makeDailyLog('2026-09-20', 1)],
      DAYS,
    )
    expect(summary.overallRate).toBe(75)
    expect(summary.habits[0]).toMatchObject({
      daysCompleted: 3,
      totalDays: 4,
      percent: 75,
    })
    expect(summary.mood.total).toBe(1)
  })

  it('hábito arquivado só entra se teve registro no período', () => {
    const archived = makeHabit({ id: 'h2', active: false })
    const summary = summarizeHabitPeriod([makeHabit(), archived], [], [], DAYS)
    expect(summary.habits.map((item) => item.habit.id)).toEqual(['h1'])
  })
})

describe('buildSprintHabitTrend', () => {
  it('uma linha por sprint, da mais antiga para a mais nova', () => {
    const sprints = [
      makeSprint({
        id: 's2',
        name: 'Sprint 2',
        status: 'active',
        start_date: '2026-10-03',
        end_date: '2026-10-10',
      }),
      makeSprint({
        id: 's1',
        name: 'Sprint 1',
        status: 'closed',
        start_date: '2026-10-01',
        end_date: '2026-10-02',
      }),
    ]
    const trend = buildSprintHabitTrend(
      sprints,
      [makeHabit()],
      [makeLog('2026-10-01'), makeLog('2026-10-02')],
      [],
      '2026-10-04',
    )
    expect(trend.map((item) => [item.name, item.overallRate])).toEqual([
      ['Sprint 1', 100],
      ['Sprint 2', 0],
    ])
  })
})

describe('getEarliestSprintStart', () => {
  it('menor data de início entre as sprints iniciadas', () => {
    const sprints = [
      makeSprint({ status: 'closed', start_date: '2026-09-01' }),
      makeSprint({ status: 'planned', start_date: '2026-08-01' }),
    ]
    expect(getEarliestSprintStart(sprints, '2026-10-12')).toBe('2026-09-01')
  })
})
