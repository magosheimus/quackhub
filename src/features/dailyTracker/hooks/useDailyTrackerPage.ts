import { useState } from 'react'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useHabits } from '@/features/dailyTracker/hooks/useHabits'
import {
  useHabitLogs,
  useLogHabit,
} from '@/features/dailyTracker/hooks/useHabitLogs'
import {
  useDailyLogs,
  useLogMood,
} from '@/features/dailyTracker/hooks/useDailyLogs'
import {
  computeHabitStats,
  computeOverallRate,
  formatDuration,
  getCurrentTrackerPeriod,
  getDayWindow,
  getHeatTone,
  getDoneStreaks,
  getHueShift,
  isMissedDay,
  isBeforeHabitStart,
  type HeatTone,
  getLogValue,
  getWeekdayOrder,
  isGoalMet,
  isMoodLevel,
  isScheduledOn,
  nextHabitValue,
  parseCounterValue,
  pickHabitHighlights,
  splitTodayHabits,
  type MoodLevel,
  type TodayHabit,
} from '@/features/dailyTracker/lib/dailyTracker'
import {
  DAILY_TRACKER_TEXTS,
  MOOD_LABELS,
} from '@/features/dailyTracker/constants/texts'
import {
  formatDayMonth,
  formatWeekdayInitials,
  getDateRange,
  todayLocal,
} from '@/shared/lib/date'
import { hasLoadError, retryFailedQueries } from '@/shared/query/queryState'
import type { Habit } from '@/shared/types/entities'

export type HeatDay = {
  date: string
  weekday: string
  dayNumber: string
  isToday: boolean
}

export type HeatCell = {
  date: string
  value: number
  tone: HeatTone
  hueShift: number
  isMet: boolean
  isScheduled: boolean
  isBeforeStart: boolean
  isFuture: boolean
  isMissed: boolean
  label: string
}

export type MoodDay = {
  date: string
  level: MoodLevel | null
  label: string
}

export type DayWindowNav = {
  isWindowed: boolean
  rangeLabel: string
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

export type HeatRow = {
  habit: Habit
  cells: HeatCell[]
  daysCompleted: number
  totalDays: number
}

export type TodayHabitItem = TodayHabit & {
  meta: string | null
}

function describeHabitMeta(habit: Habit): string | null {
  const parts = [
    habit.goal !== null ? DAILY_TRACKER_TEXTS.goalLabel(habit.goal) : null,
    habit.duration_minutes ? formatDuration(habit.duration_minutes) : null,
  ].filter((part): part is string => part !== null)
  return parts.length > 0 ? parts.join(' · ') : null
}

function toTodayItem(item: TodayHabit): TodayHabitItem {
  return { ...item, meta: describeHabitMeta(item.habit) }
}

function describeCell(
  habit: Habit,
  value: number,
  isScheduled: boolean,
  isBeforeStart: boolean,
) {
  if (isBeforeStart) {
    return DAILY_TRACKER_TEXTS.beforeHabitStart
  }
  if (!isScheduled) {
    return DAILY_TRACKER_TEXTS.notScheduled
  }
  if (habit.type === 'counter') {
    return DAILY_TRACKER_TEXTS.progress(value, habit.goal ?? 1)
  }
  return isGoalMet(habit, value)
    ? DAILY_TRACKER_TEXTS.done
    : DAILY_TRACKER_TEXTS.notDone
}

export function useDailyTrackerPage() {
  const { settings } = useSettings()
  const today = todayLocal()

  const sprintsQuery = useSprints()
  const period = getCurrentTrackerPeriod(
    sprintsQuery.data ?? [],
    today,
    settings.weekStartsOn,
  )
  const days = getDateRange(period.start, period.end)
  const [windowStepsBack, setWindowStepsBack] = useState(0)
  const dayWindow = getDayWindow(days, today, windowStepsBack)
  const visibleDays = dayWindow.days
  const dayWindowNav: DayWindowNav = {
    isWindowed: dayWindow.isWindowed,
    rangeLabel: DAILY_TRACKER_TEXTS.visibleRange(
      formatDayMonth(visibleDays[0] ?? today),
      formatDayMonth(visibleDays[visibleDays.length - 1] ?? today),
    ),
    canGoBack: dayWindow.canGoBack,
    canGoForward: dayWindow.canGoForward,
    goBack: () => setWindowStepsBack((steps) => steps + 1),
    goForward: () => setWindowStepsBack((steps) => Math.max(steps - 1, 0)),
  }

  const habitsQuery = useHabits()
  const logsQuery = useHabitLogs(period.start, period.end)
  const dailyLogsQuery = useDailyLogs(period.start, period.end)
  const { mutate: logHabit } = useLogHabit(period.start, period.end)
  const { mutate: logMood } = useLogMood()

  const habits = habitsQuery.data ?? []
  const logs = logsQuery.data ?? []
  const dailyLogs = dailyLogsQuery.data ?? []
  const elapsedDays = days.filter((date) => date <= today)
  const todayLog = dailyLogs.find((log) => log.date === today)
  const todayMood = isMoodLevel(todayLog?.mood) ? todayLog.mood : null
  const { pending, done } = splitTodayHabits(habits, logs, today)
  const todayTotal = pending.length + done.length

  const heatDays: HeatDay[] = visibleDays.map((date) => ({
    date,
    weekday: formatWeekdayInitials(date),
    dayNumber: date.slice(8),
    isToday: date === today,
  }))

  const heatRows: HeatRow[] = habits.map((habit) => {
    const stats = computeHabitStats(habit, logs, elapsedDays)
    const streaks = getDoneStreaks(habit, logs, days)
    return {
      habit,
      daysCompleted: stats.daysCompleted,
      totalDays: stats.totalDays,
      cells: visibleDays.map((date) => {
        const value = getLogValue(logs, habit.id, date)
        const isScheduled = isScheduledOn(habit, date)
        const isBeforeStart = isBeforeHabitStart(habit, date)
        return {
          date,
          value,
          tone: getHeatTone(habit, value, streaks[date] ?? 0),
          hueShift: getHueShift(`${habit.id}:${date}`),
          isMet: isGoalMet(habit, value),
          isScheduled,
          isBeforeStart,
          isFuture: date > today,
          isMissed: isMissedDay(habit, date, today, value),
          label: DAILY_TRACKER_TEXTS.cellLabel(
            habit.name,
            formatDayMonth(date),
            describeCell(habit, value, isScheduled, isBeforeStart),
          ),
        }
      }),
    }
  })

  const moodDays: MoodDay[] = visibleDays.map((date) => {
    const log = dailyLogs.find((dailyLog) => dailyLog.date === date)
    const level = isMoodLevel(log?.mood) ? log.mood : null
    return {
      date,
      level,
      label: DAILY_TRACKER_TEXTS.moodOf(
        formatDayMonth(date),
        level ? MOOD_LABELS[level] : DAILY_TRACKER_TEXTS.noMood,
        log?.comment ?? null,
      ),
    }
  })

  function setValue(habit: Habit, date: string, value: number) {
    if (value === getLogValue(logs, habit.id, date)) {
      return
    }
    logHabit({ habitId: habit.id, date, value })
  }

  function setTodayValue(habit: Habit, value: number) {
    setValue(habit, today, Math.max(value, 0))
  }

  function commitTodayValue(habit: Habit, text: string) {
    const value = parseCounterValue(text)
    if (value !== null) {
      setValue(habit, today, value)
    }
  }

  function toggleToday(habit: Habit) {
    setValue(
      habit,
      today,
      nextHabitValue(habit, getLogValue(logs, habit.id, today)),
    )
  }

  function saveMood(mood: MoodLevel) {
    logMood({ date: today, mood, comment: todayLog?.comment ?? null })
  }

  function saveComment(text: string) {
    const comment = text.trim() || null
    if (!todayMood || comment === (todayLog?.comment ?? null)) {
      return
    }
    logMood({ date: today, mood: todayMood, comment })
  }

  const queries = [sprintsQuery, habitsQuery, logsQuery, dailyLogsQuery]

  return {
    isLoading: habitsQuery.isLoading || sprintsQuery.isLoading,
    hasError: hasLoadError(...queries),
    retry: () => retryFailedQueries(...queries),
    habits,
    weekdayOrder: getWeekdayOrder(settings.weekStartsOn),
    periodLabel: DAILY_TRACKER_TEXTS.periodLabel(
      period.kind === 'sprint' ? period.name : null,
      formatDayMonth(period.start),
      formatDayMonth(period.end),
    ),
    isSprintPeriod: period.kind === 'sprint',
    hasHabits: habits.length > 0,
    habitsCount: DAILY_TRACKER_TEXTS.habitsCount(habits.length),
    pendingToday: pending.map(toTodayItem),
    doneToday: done.map(toTodayItem),
    todayProgress:
      todayTotal > 0
        ? DAILY_TRACKER_TEXTS.todayProgress(done.length, todayTotal)
        : undefined,
    setTodayValue,
    commitTodayValue,
    toggleToday,
    heatDays,
    heatRows,
    dayWindow: dayWindowNav,
    todayMood,
    todayComment: todayLog?.comment ?? '',
    saveMood,
    saveComment,
    overallRate: computeOverallRate(habits, logs, elapsedDays),
    todayCount: DAILY_TRACKER_TEXTS.todayCount(done.length, todayTotal),
    highlights: pickHabitHighlights(habits, logs, elapsedDays),
    moodHistoryLabel: DAILY_TRACKER_TEXTS.moodRow(period.kind === 'sprint'),
    moodDays,
  }
}
