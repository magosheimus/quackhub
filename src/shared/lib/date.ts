// Datas no formato do banco ('yyyy-MM-dd')
const MISSING_DATE = '?'

export function formatDayMonth(date: string | null): string {
  if (!date) {
    return MISSING_DATE
  }
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

export function formatFullDate(date: string | null): string {
  if (!date) {
    return MISSING_DATE
  }
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function formatWeekdayShort(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
    .format(date)
    .toUpperCase()
}

export function toDbDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayLocal(): string {
  return toDbDate(new Date())
}

export function addDaysToToday(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDbDate(date)
}

export function parseDbDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDbDate(date: string, days: number): string {
  const shifted = parseDbDate(date)
  shifted.setDate(shifted.getDate() + days)
  return toDbDate(shifted)
}

export function getWeekDays(date: string, weekStartsOn: 0 | 1): string[] {
  const offset = (parseDbDate(date).getDay() - weekStartsOn + 7) % 7
  const start = shiftDbDate(date, -offset)
  return Array.from({ length: 7 }, (_, index) => shiftDbDate(start, index))
}

export function formatWeekdayInitials(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
    .format(parseDbDate(date))
    .replace('.', '')
    .toUpperCase()
}

export function getDateRange(start: string, end: string): string[] {
  const dates: string[] = []
  for (let date = start; date <= end; date = shiftDbDate(date, 1)) {
    dates.push(date)
  }
  return dates
}
