import type {
  DailyLog,
  Habit,
  HabitLog,
  HabitType,
  NewHabit,
  Sprint,
} from '@/shared/types/entities'
import {
  getDateRange,
  getWeekDays,
  parseDbDate,
  toDbDate,
} from '@/shared/lib/date'
import {
  getHabitColor,
  getHabitIconKey,
  type HabitIconKey,
} from '@/features/dailyTracker/lib/habitAppearance'
import type { PaletteColor } from '@/shared/lib/palette'

export const MOOD_LEVELS = [1, 2, 3, 4, 5] as const
export type MoodLevel = (typeof MOOD_LEVELS)[number]

export function isMoodLevel(value: unknown): value is MoodLevel {
  return MOOD_LEVELS.some((level) => level === value)
}

type HabitGoal = Pick<Habit, 'type' | 'goal'>

export function isGoalMet(habit: HabitGoal, value: number): boolean {
  if (habit.type === 'boolean') {
    return value >= 1
  }
  return value >= (habit.goal ?? 1)
}

export function getLogValue(
  logs: HabitLog[],
  habitId: string,
  date: string,
): number {
  return (
    logs.find((log) => log.habit_id === habitId && log.date === date)?.value ??
    0
  )
}

export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const

export function isScheduledOn(
  habit: Pick<Habit, 'weekdays'>,
  date: string,
): boolean {
  if (!habit.weekdays || habit.weekdays.length === 0) {
    return true
  }
  return habit.weekdays.includes(parseDbDate(date).getDay())
}

export function trackedDays(habit: Habit, days: string[]): string[] {
  const createdOn = toDbDate(new Date(habit.created_at))
  return days.filter((date) => date >= createdOn && isScheduledOn(habit, date))
}

export function getWeekdayOrder(weekStartsOn: 0 | 1): number[] {
  return ALL_WEEKDAYS.map((_, index) => (index + weekStartsOn) % 7)
}

export function getHeatIntensity(habit: HabitGoal, value: number): number {
  if (value <= 0) {
    return 0
  }
  if (habit.type === 'boolean') {
    return 1
  }
  return Math.min(value / (habit.goal ?? 1), 1)
}

export type TodayHabit = {
  habit: Habit
  value: number
  isMet: boolean
}

export function splitTodayHabits(
  habits: Habit[],
  logs: HabitLog[],
  today: string,
): { pending: TodayHabit[]; done: TodayHabit[] } {
  const todayHabits = habits
    .filter((habit) => isScheduledOn(habit, today))
    .map((habit) => {
      const value = getLogValue(logs, habit.id, today)
      return { habit, value, isMet: isGoalMet(habit, value) }
    })
  return {
    pending: todayHabits.filter((item) => !item.isMet),
    done: todayHabits.filter((item) => item.isMet),
  }
}

export type HabitStats = {
  daysCompleted: number
  totalDays: number
  rate: number
}

export function computeHabitStats(
  habit: Habit,
  logs: HabitLog[],
  days: string[],
): HabitStats {
  const countedDays = trackedDays(habit, days)
  const daysCompleted = countedDays.filter((date) =>
    isGoalMet(habit, getLogValue(logs, habit.id, date)),
  ).length
  const rate =
    countedDays.length === 0
      ? 0
      : Math.round((daysCompleted / countedDays.length) * 100) / 100
  return { daysCompleted, totalDays: countedDays.length, rate }
}

export function computeOverallRate(
  habits: Habit[],
  logs: HabitLog[],
  days: string[],
): number {
  const totals = habits.map((habit) => computeHabitStats(habit, logs, days))
  const slots = totals.reduce((sum, stats) => sum + stats.totalDays, 0)
  if (slots === 0) {
    return 0
  }
  const met = totals.reduce((sum, stats) => sum + stats.daysCompleted, 0)
  return Math.round((met / slots) * 100)
}

export type HabitHighlights = {
  mostConsistent: Habit | null
  needsAttention: Habit | null
}

export function pickHabitHighlights(
  habits: Habit[],
  logs: HabitLog[],
  days: string[],
): HabitHighlights {
  const ranked = habits
    .map((habit) => ({ habit, stats: computeHabitStats(habit, logs, days) }))
    .filter((item) => item.stats.totalDays > 0)
    .sort(
      (a, b) =>
        b.stats.rate - a.stats.rate ||
        b.stats.daysCompleted - a.stats.daysCompleted,
    )
  const best = ranked.at(0)
  const worst = ranked.at(-1)
  if (!best || !worst) {
    return { mostConsistent: null, needsAttention: null }
  }
  return {
    mostConsistent: best.stats.rate > 0 ? best.habit : null,
    needsAttention: worst.stats.rate < best.stats.rate ? worst.habit : null,
  }
}

export type MoodSummary = {
  average: MoodLevel | null
  counts: Record<MoodLevel, number>
  percents: Record<MoodLevel, number>
  total: number
}

export function summarizeMood(dailyLogs: DailyLog[]): MoodSummary {
  const counts: Record<MoodLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let sum = 0
  for (const log of dailyLogs) {
    if (isMoodLevel(log.mood)) {
      counts[log.mood] += 1
      sum += log.mood
    }
  }
  const total = MOOD_LEVELS.reduce((count, level) => count + counts[level], 0)
  const rounded = total === 0 ? null : Math.round(sum / total)
  const percentOf = (level: MoodLevel) =>
    total === 0 ? 0 : Math.round((counts[level] / total) * 100)
  return {
    average: isMoodLevel(rounded) ? rounded : null,
    counts,
    percents: {
      1: percentOf(1),
      2: percentOf(2),
      3: percentOf(3),
      4: percentOf(4),
      5: percentOf(5),
    },
    total,
  }
}

export function nextHabitValue(habit: HabitGoal, current: number): number {
  if (habit.type === 'boolean') {
    return current >= 1 ? 0 : 1
  }
  return current >= (habit.goal ?? 1) ? 0 : current + 1
}

export type HabitFormValues = {
  name: string
  type: HabitType
  goalText: string
  weekdays: number[]
  durationText: string
  icon: HabitIconKey
  color: PaletteColor | null
}

export type HabitFields = Pick<
  NewHabit,
  'name' | 'type' | 'goal' | 'weekdays' | 'duration_minutes' | 'icon' | 'color'
>

export function buildHabitFields(values: HabitFormValues): HabitFields | null {
  const name = values.name.trim()
  if (!name || values.weekdays.length === 0) {
    return null
  }
  const goal = values.type === 'counter' ? parseGoal(values.goalText) : null
  if (values.type === 'counter' && goal === null) {
    return null
  }
  const durationMinutes =
    values.durationText.trim() === '' ? null : parseGoal(values.durationText)
  if (values.durationText.trim() !== '' && durationMinutes === null) {
    return null
  }
  const weekdays =
    values.weekdays.length === ALL_WEEKDAYS.length
      ? null
      : [...values.weekdays].sort((a, b) => a - b)
  return {
    name,
    type: values.type,
    goal,
    weekdays,
    duration_minutes: durationMinutes,
    icon: values.icon,
    color: values.color,
  }
}

export function getHabitFormValues(habit?: Habit): HabitFormValues {
  return {
    name: habit?.name ?? '',
    type: habit?.type ?? 'boolean',
    goalText: habit?.goal ? String(habit.goal) : '',
    weekdays: habit?.weekdays?.length ? habit.weekdays : [...ALL_WEEKDAYS],
    durationText: habit?.duration_minutes ? String(habit.duration_minutes) : '',
    icon: getHabitIconKey(habit),
    color: getHabitColor(habit),
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) {
    return `${rest} min`
  }
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

export function parseCounterValue(text: string): number | null {
  const value = Number(text)
  return text.trim() !== '' && Number.isInteger(value) && value >= 0
    ? value
    : null
}

export function parseGoal(text: string): number | null {
  const goal = parseCounterValue(text)
  return goal !== null && goal >= 1 ? goal : null
}

const MAX_FULL_PERIOD_DAYS = 21
export const DAY_WINDOW_SIZE = 14
const DAY_WINDOW_STEP = 7
const DAYS_AFTER_TODAY = 3

export type DayWindow = {
  days: string[]
  isWindowed: boolean
  canGoBack: boolean
  canGoForward: boolean
}

function clampIndex(index: number, min: number, max: number): number {
  return Math.min(Math.max(index, min), max)
}

export function getDayWindow(
  days: string[],
  today: string,
  stepsBack: number,
): DayWindow {
  if (days.length <= MAX_FULL_PERIOD_DAYS) {
    return { days, isWindowed: false, canGoBack: false, canGoForward: false }
  }
  const lastIndex = days.length - 1
  const firstEnd = DAY_WINDOW_SIZE - 1
  const todayIndex = days.filter((date) => date <= today).length - 1
  const defaultEnd = clampIndex(
    todayIndex + DAYS_AFTER_TODAY,
    firstEnd,
    lastIndex,
  )
  const end = clampIndex(
    defaultEnd - stepsBack * DAY_WINDOW_STEP,
    firstEnd,
    lastIndex,
  )
  return {
    days: days.slice(end - firstEnd, end + 1),
    isWindowed: true,
    canGoBack: end > firstEnd,
    canGoForward: end < lastIndex,
  }
}

export type TrackerPeriod = {
  kind: 'sprint' | 'week'
  name: string
  start: string
  end: string
}

export function getCurrentTrackerPeriod(
  sprints: Sprint[],
  today: string,
  weekStartsOn: 0 | 1,
): TrackerPeriod {
  const current = sprints.find(
    (sprint) =>
      sprint.status === 'active' &&
      sprint.start_date !== null &&
      sprint.end_date !== null &&
      sprint.start_date <= today &&
      today <= sprint.end_date,
  )
  if (current?.start_date && current.end_date) {
    return {
      kind: 'sprint',
      name: current.name,
      start: current.start_date,
      end: current.end_date,
    }
  }
  const week = getWeekDays(today, weekStartsOn)
  return {
    kind: 'week',
    name: '',
    start: week[0],
    end: week[week.length - 1],
  }
}

export function getSprintDays(sprint: Sprint, today: string): string[] {
  if (!sprint.start_date || !sprint.end_date) {
    return []
  }
  const end = sprint.end_date < today ? sprint.end_date : today
  return getDateRange(sprint.start_date, end)
}
