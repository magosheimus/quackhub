import {
  computeHabitStats,
  computeOverallRate,
  getSprintDays,
  summarizeMood,
  trackedDays,
  type MoodLevel,
  type MoodSummary,
} from '@/features/dailyTracker/lib/dailyTracker'
import type { DailyLog, Habit, HabitLog, Sprint } from '@/shared/types/entities'

export type HabitPeriodItem = {
  habit: Habit
  daysCompleted: number
  totalDays: number
  percent: number
}

export type HabitPeriodSummary = {
  overallRate: number
  habits: HabitPeriodItem[]
  mood: MoodSummary
}

function habitsInPeriod(
  habits: Habit[],
  logs: HabitLog[],
  days: string[],
): Habit[] {
  return habits.filter(
    (habit) =>
      trackedDays(habit, days).length > 0 &&
      (habit.active ||
        logs.some(
          (log) => log.habit_id === habit.id && days.includes(log.date),
        )),
  )
}

export function summarizeHabitPeriod(
  habits: Habit[],
  logs: HabitLog[],
  dailyLogs: DailyLog[],
  days: string[],
): HabitPeriodSummary {
  const relevant = habitsInPeriod(habits, logs, days)
  return {
    overallRate: computeOverallRate(relevant, logs, days),
    habits: relevant.map((habit) => {
      const stats = computeHabitStats(habit, logs, days)
      return {
        habit,
        daysCompleted: stats.daysCompleted,
        totalDays: stats.totalDays,
        percent: Math.round(stats.rate * 100),
      }
    }),
    mood: summarizeMood(dailyLogs.filter((log) => days.includes(log.date))),
  }
}

export type SprintHabitTrendItem = {
  sprintId: string
  name: string
  overallRate: number
  averageMood: MoodLevel | null
}

export function buildSprintHabitTrend(
  sprints: Sprint[],
  habits: Habit[],
  logs: HabitLog[],
  dailyLogs: DailyLog[],
  today: string,
): SprintHabitTrendItem[] {
  return sprints
    .filter((sprint) => sprint.status !== 'planned')
    .map((sprint) => ({ sprint, days: getSprintDays(sprint, today) }))
    .filter(({ days }) => days.length > 0)
    .sort((a, b) => a.days[0].localeCompare(b.days[0]))
    .map(({ sprint, days }) => {
      const summary = summarizeHabitPeriod(habits, logs, dailyLogs, days)
      return {
        sprintId: sprint.id,
        name: sprint.name,
        overallRate: summary.overallRate,
        averageMood: summary.mood.average,
      }
    })
}

export function getEarliestSprintStart(
  sprints: Sprint[],
  today: string,
): string {
  return sprints.reduce(
    (earliest, sprint) =>
      sprint.status !== 'planned' &&
      sprint.start_date &&
      sprint.start_date < earliest
        ? sprint.start_date
        : earliest,
    today,
  )
}
