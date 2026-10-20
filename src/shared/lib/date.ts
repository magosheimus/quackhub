// Datas no formato do banco ('yyyy-MM-dd')
const MISSING_DATE = '?'

// Formato escolhido nas Configurações; todas as datas exibidas seguem ele
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy'

export const DEFAULT_DATE_FORMAT: DateFormat = 'dd/MM/yyyy'

// '21/10' ou '10/21'
export function formatDayMonth(
  date: string | null,
  format: DateFormat = DEFAULT_DATE_FORMAT,
): string {
  if (!date) {
    return MISSING_DATE
  }
  const [, month, day] = date.split('-')
  return format === 'MM/dd/yyyy' ? `${month}/${day}` : `${day}/${month}`
}

// '21/10/2026' ou '10/21/2026'
export function formatFullDate(
  date: string | null,
  format: DateFormat = DEFAULT_DATE_FORMAT,
): string {
  if (!date) {
    return MISSING_DATE
  }
  const [year, month, day] = date.split('-')
  return format === 'MM/dd/yyyy'
    ? `${month}/${day}/${year}`
    : `${day}/${month}/${year}`
}

// Data de um timestamp (ex.: criado/atualizado), no dia local
export function formatTimestampDate(
  timestamp: string | null,
  format: DateFormat = DEFAULT_DATE_FORMAT,
): string {
  if (!timestamp) {
    return MISSING_DATE
  }
  return formatFullDate(toDbDate(new Date(timestamp)), format)
}

// 'terça-feira'
export function formatWeekdayName(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date)
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

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (parseDbDate(to).getTime() - parseDbDate(from).getTime()) / 86_400_000,
  )
}

// '2026-09' → 'Setembro de 2026'
export function formatMonthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// Timestamp do banco no horário local: '17/10/2026 · 20:52'
export function formatDateTime(
  timestamp: string | null,
  format: DateFormat = DEFAULT_DATE_FORMAT,
): string {
  if (!timestamp) {
    return MISSING_DATE
  }
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${formatFullDate(toDbDate(date), format)} · ${hours}:${minutes}`
}

const TIME_SLOT_MINUTES = 30

// Horários do dia de 30 em 30 minutos: '00:00', '00:30', ... '23:30'
export function getTimeSlots(): string[] {
  const slots: string[] = []
  for (let minutes = 0; minutes < 24 * 60; minutes += TIME_SLOT_MINUTES) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0')
    const minute = String(minutes % 60).padStart(2, '0')
    slots.push(`${hour}:${minute}`)
  }
  return slots
}

// Horário digitado em formatos livres ('9', '14h', '14h30', '1430', '9:5')
// para 'HH:mm'; null se não for um horário válido
export function parseTimeInput(text: string): string | null {
  const match = text
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?:[:h]?(\d{1,2})?)?$/)
  if (!match) {
    return null
  }
  const hour = Number(match[1])
  const minute = Number(match[2] ?? 0)
  if (hour > 23 || minute > 59) {
    return null
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
