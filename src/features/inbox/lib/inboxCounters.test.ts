import { describe, expect, it } from 'vitest'
import { buildInboxCounters } from './inboxCounters'

describe('buildInboxCounters', () => {
  it('contadores zerados ficam apagados', () => {
    const counters = buildInboxCounters({
      dueToday: 0,
      srsOverdue: 0,
      urgent: 0,
    })
    expect(counters.map((c) => c.tone)).toEqual(['muted', 'muted', 'muted'])
  })

  it('urgentes acima de zero ganham destaque de perigo', () => {
    const counters = buildInboxCounters({
      dueToday: 2,
      srsOverdue: 1,
      urgent: 3,
    })
    expect(counters.map((c) => [c.key, c.value, c.tone])).toEqual([
      ['tasks', 2, 'default'],
      ['reviews', 1, 'default'],
      ['urgent', 3, 'danger'],
    ])
  })
})
