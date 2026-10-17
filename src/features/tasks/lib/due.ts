import {
  daysBetween,
  parseDbDate,
  shiftDbDate,
  toDbDate,
} from '@/shared/lib/date'

// Baseada na sintaxe do Todoist, mas "semana/mês/ano que vem" somam o período a partir de hoje

export type DueToken = {
  dueDate: string | null
  dueTime: string | null
  clearsDue: boolean
  start: number
  end: number
  text: string
}

type Context = {
  now: Date
  today: string
  weekStartsOn: 0 | 1
}

type DateRule = {
  pattern: RegExp
  resolve: (match: RegExpExecArray, ctx: Context) => string | null
}

const WEEKDAY_NAMES: [string, number][] = [
  ['domingo', 0],
  ['dom', 0],
  ['segunda-feira', 1],
  ['segunda', 1],
  ['seg', 1],
  ['terca-feira', 2],
  ['terca', 2],
  ['ter', 2],
  ['quarta-feira', 3],
  ['quarta', 3],
  ['qua', 3],
  ['quinta-feira', 4],
  ['quinta', 4],
  ['qui', 4],
  ['sexta-feira', 5],
  ['sexta', 5],
  ['sex', 5],
  ['sabado', 6],
  ['sab', 6],
]

const MONTH_NAMES: [string, number][] = [
  ['janeiro', 1],
  ['jan', 1],
  ['fevereiro', 2],
  ['fev', 2],
  ['marco', 3],
  ['mar', 3],
  ['abril', 4],
  ['abr', 4],
  ['maio', 5],
  ['mai', 5],
  ['junho', 6],
  ['jun', 6],
  ['julho', 7],
  ['jul', 7],
  ['agosto', 8],
  ['ago', 8],
  ['setembro', 9],
  ['set', 9],
  ['outubro', 10],
  ['out', 10],
  ['novembro', 11],
  ['nov', 11],
  ['dezembro', 12],
  ['dez', 12],
]

const WEEKDAY = `(${WEEKDAY_NAMES.map(([name]) => name).join('|')})`
const MONTH = `(${MONTH_NAMES.map(([name]) => name).join('|')})`

const weekdayIndex = (name: string) =>
  WEEKDAY_NAMES.find(([key]) => key === name)?.[1] ?? 0
const monthIndex = (name: string) =>
  MONTH_NAMES.find(([key]) => key === name)?.[1] ?? 1

const sticky = (source: string) => new RegExp(source, 'y')

function buildDate(year: number, month: number, day: number): string | null {
  const date = new Date(year, month - 1, day)
  const isValid = date.getMonth() === month - 1 && date.getDate() === day
  return isValid ? toDbDate(date) : null
}

function lastDayOfMonth(year: number, month: number): string {
  return toDbDate(new Date(year, month, 0))
}

function addMonths(today: string, months: number): string {
  const date = parseDbDate(today)
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return toDbDate(target)
}

// Dia/mês sem ano: se já passou neste ano, vai para o próximo
function nextOccurrence(
  today: string,
  month: number,
  day: number,
): string | null {
  const year = parseDbDate(today).getFullYear()
  const thisYear = buildDate(year, month, day)
  return thisYear && thisYear < today
    ? buildDate(year + 1, month, day)
    : thisYear
}

function daysUntilWeekday(today: string, target: number): number {
  return (target - parseDbDate(today).getDay() + 7) % 7
}

function weekPosition(weekday: number, weekStartsOn: 0 | 1): number {
  return (weekday - weekStartsOn + 7) % 7
}

function toYear(text: string | undefined, fallback: number): number {
  if (!text) {
    return fallback
  }
  const year = Number(text)
  return text.length === 2 ? 2000 + year : year
}

// Ordem importa: frases mais específicas antes das mais curtas
const DATE_RULES: DateRule[] = [
  {
    pattern: sticky('sem (?:data|prazo)'),
    resolve: () => null,
  },
  {
    pattern: sticky('depois de amanha'),
    resolve: (_, { today }) => shiftDbDate(today, 2),
  },
  {
    pattern: sticky('(hoje|amanha)'),
    resolve: (m, { today }) => shiftDbDate(today, m[1] === 'amanha' ? 1 : 0),
  },
  {
    pattern: sticky('(?:proxima semana|semana (?:que|q) vem)'),
    resolve: (_, { today }) => shiftDbDate(today, 7),
  },
  {
    pattern: sticky('(?:proximo mes|mes (?:que|q) vem)'),
    resolve: (_, { today }) => addMonths(today, 1),
  },
  {
    pattern: sticky('(?:proximo ano|ano (?:que|q) vem)'),
    resolve: (_, { today }) => addMonths(today, 12),
  },
  {
    pattern: sticky('(proximo )?fim de semana|(?:neste|este) fim de semana'),
    resolve: (m, { today }) =>
      shiftDbDate(today, daysUntilWeekday(today, 6) + (m[1] ? 7 : 0)),
  },
  {
    pattern: sticky('(?:fim|final) do mes'),
    resolve: (_, { today }) => {
      const date = parseDbDate(today)
      return lastDayOfMonth(date.getFullYear(), date.getMonth() + 1)
    },
  },
  {
    pattern: sticky(`meio de ${MONTH}`),
    resolve: (m, { today }) =>
      nextOccurrence(today, monthIndex(m[1] ?? ''), 15),
  },
  {
    pattern: sticky('meio do mes'),
    resolve: (_, { today }) => {
      const date = parseDbDate(today)
      return buildDate(date.getFullYear(), date.getMonth() + 1, 15)
    },
  },
  {
    pattern: sticky(
      '(?:em|daqui a|\\+)\\s*(\\d{1,3})\\s*(dias?|semanas?|meses|mes)',
    ),
    resolve: (m, { today }) => {
      const amount = Number(m[1])
      const unit = m[2] ?? ''
      if (unit.startsWith('mes')) {
        return addMonths(today, amount)
      }
      return shiftDbDate(today, unit.startsWith('semana') ? amount * 7 : amount)
    },
  },
  {
    // "próxima sexta": a segunda sexta a ocorrer (ou a próxima, se a desta semana já passou)
    pattern: sticky(`prox(?:ima|imo) ${WEEKDAY}`),
    resolve: (m, { today, weekStartsOn }) => {
      const target = weekdayIndex(m[1] ?? '')
      const current = parseDbDate(today).getDay()
      const days = daysUntilWeekday(today, target) || 7
      const notYetThisWeek =
        weekPosition(target, weekStartsOn) > weekPosition(current, weekStartsOn)
      return shiftDbDate(today, notYetThisWeek ? days + 7 : days)
    },
  },
  {
    pattern: sticky(`dia (\\d{1,2})`),
    resolve: (m, { today }) => {
      const date = parseDbDate(today)
      const day = Number(m[1])
      const thisMonth = buildDate(date.getFullYear(), date.getMonth() + 1, day)
      if (thisMonth && thisMonth >= today) {
        return thisMonth
      }
      const next = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      return buildDate(next.getFullYear(), next.getMonth() + 1, day)
    },
  },
  {
    pattern: sticky(`(\\d{1,2})(?: de)? ${MONTH}(?:(?: de)? (\\d{4}))?`),
    resolve: (m, { today }) => {
      const day = Number(m[1])
      const month = monthIndex(m[2] ?? '')
      return m[3]
        ? buildDate(Number(m[3]), month, day)
        : nextOccurrence(today, month, day)
    },
  },
  {
    pattern: sticky('(\\d{4})-(\\d{1,2})-(\\d{1,2})'),
    resolve: (m) => buildDate(Number(m[1]), Number(m[2]), Number(m[3])),
  },
  {
    pattern: sticky('(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{4}|\\d{2}))?'),
    resolve: (m, { today }) => {
      const day = Number(m[1])
      const month = Number(m[2])
      return m[3]
        ? buildDate(toYear(m[3], 0), month, day)
        : nextOccurrence(today, month, day)
    },
  },
  {
    pattern: sticky(WEEKDAY),
    resolve: (m, { today }) =>
      shiftDbDate(today, daysUntilWeekday(today, weekdayIndex(m[1] ?? ''))),
  },
]

const DAY_PERIODS: [RegExp, string][] = [
  [sticky('(?:de |pela )?manha'), '09:00'],
  [sticky('(?:de |a |pela )?tarde'), '12:00'],
  [sticky('(?:de |a )?noite'), '19:00'],
]

// Sufixos que costumam vir depois da hora: "14:00 hs", "14:00h", "14hs", "14 horas"
const HOUR_SUFFIX = '(?:\\s?(?:horas|hrs|hs|h)(?![a-z]))?'
const CLOCK = sticky(
  `(?:as )?(\\d{1,2})(?::(\\d{2})${HOUR_SUFFIX}|h(\\d{2})?(?:rs|s)?)`,
)
const CLOCK_WORD = sticky('(?:as )?(\\d{1,2})\\s?(?:horas|hrs|hs)(?![a-z])')
const CLOCK_AFTER_AS = sticky(`as (\\d{1,2})${HOUR_SUFFIX}(?![\\d:h/])`)
const IN_HOURS = sticky('(?:em|daqui a|\\+)\\s*(\\d{1,2})\\s*(?:horas?|h)\\b')
const TOKEN_END = sticky('$|[\\s,.;:!?)]')

// Minúsculas e sem acento, letra por letra: as posições batem com o texto original
function normalize(text: string): string {
  return Array.from(text, (char) =>
    char.length === 1 ? (char.normalize('NFD')[0] ?? char).toLowerCase() : char,
  ).join('')
}

function matchAt(pattern: RegExp, text: string, index: number) {
  pattern.lastIndex = index
  return pattern.exec(text)
}

function toTime(hour: number, minute: number): string | null {
  if (hour > 23 || minute > 59) {
    return null
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

type TimeMatch = { time: string | null; length: number }

function matchTime(text: string, index: number): TimeMatch | null {
  for (const [pattern, time] of DAY_PERIODS) {
    const match = matchAt(pattern, text, index)
    if (match) {
      return { time, length: match[0].length }
    }
  }
  const clock = matchAt(CLOCK, text, index)
  if (clock) {
    const minute = clock[2] ?? clock[3] ?? '0'
    return {
      time: toTime(Number(clock[1]), Number(minute)),
      length: clock[0].length,
    }
  }
  const word = matchAt(CLOCK_WORD, text, index)
  if (word) {
    return { time: toTime(Number(word[1]), 0), length: word[0].length }
  }
  const afterAs = matchAt(CLOCK_AFTER_AS, text, index)
  if (afterAs) {
    return { time: toTime(Number(afterAs[1]), 0), length: afterAs[0].length }
  }
  return null
}

function nowTime(now: Date): string {
  return toTime(now.getHours(), now.getMinutes()) ?? '00:00'
}

type Parsed = Omit<DueToken, 'start' | 'text'>

function parseAt(text: string, index: number, ctx: Context): Parsed | null {
  const inHours = matchAt(IN_HOURS, text, index)
  if (inHours) {
    const later = new Date(ctx.now.getTime() + Number(inHours[1]) * 3_600_000)
    return {
      dueDate: toDbDate(later),
      dueTime: nowTime(later),
      clearsDue: false,
      end: index + inHours[0].length,
    }
  }

  for (const rule of DATE_RULES) {
    const match = matchAt(rule.pattern, text, index)
    if (!match) {
      continue
    }
    const clearsDue = rule === DATE_RULES[0]
    const dueDate = rule.resolve(match, ctx)
    if (!dueDate && !clearsDue) {
      return null
    }
    let end = index + match[0].length
    let dueTime: string | null = null
    const space = matchAt(sticky('\\s+'), text, end)
    const time =
      !clearsDue && space ? matchTime(text, end + space[0].length) : null
    if (time?.time && space) {
      dueTime = time.time
      end += space[0].length + time.length
    }
    return { dueDate, dueTime, clearsDue, end }
  }

  const time = matchTime(text, index)
  if (!time?.time) {
    return null
  }
  // Só horário: hoje, ou amanhã se o horário já passou (como no Todoist)
  const isPast = time.time <= nowTime(ctx.now)
  return {
    dueDate: shiftDbDate(ctx.today, isPast ? 1 : 0),
    dueTime: time.time,
    clearsDue: false,
    end: index + time.length,
  }
}

// Acha o primeiro "@..." do título que seja uma data, um horário ou "sem data"
export function findDueToken(
  title: string,
  now: Date,
  weekStartsOn: 0 | 1,
): DueToken | null {
  const text = normalize(title)
  const ctx: Context = { now, today: toDbDate(now), weekStartsOn }
  let at = text.indexOf('@')

  while (at !== -1) {
    const parsed = parseAt(text, at + 1, ctx)
    if (parsed && matchAt(TOKEN_END, text, parsed.end)) {
      return { ...parsed, start: at, text: title.slice(at, parsed.end) }
    }
    at = text.indexOf('@', at + 1)
  }
  return null
}

export function removeDueToken(title: string, token: DueToken): string {
  return `${title.slice(0, token.start)} ${title.slice(token.end)}`
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export type DueTone = 'overdue' | 'today' | 'upcoming'

export type DueLabel = {
  text: string
  tone: DueTone
}

export function formatDueTime(time: string | null): string | null {
  return time ? time.slice(0, 5) : null
}

// "Hoje · 14:00", "Amanhã", "20/10 · 09:30"
export function formatDue(
  dueDate: string,
  dueTime: string | null,
  today: string,
  labels: { today: string; tomorrow: string },
): DueLabel {
  const days = daysBetween(today, dueDate)
  const [, month, day] = dueDate.split('-')
  const dateText =
    days === 0 ? labels.today : days === 1 ? labels.tomorrow : `${day}/${month}`
  const time = formatDueTime(dueTime)
  return {
    text: time ? `${dateText} · ${time}` : dateText,
    tone: days < 0 ? 'overdue' : days === 0 ? 'today' : 'upcoming',
  }
}
