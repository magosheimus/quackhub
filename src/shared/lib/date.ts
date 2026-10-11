// Datas no formato do banco ('yyyy-MM-dd') para exibição
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
