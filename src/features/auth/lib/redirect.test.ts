import { describe, expect, it } from 'vitest'
import { getRedirectTarget, HOME_PATH } from './redirect'

describe('getRedirectTarget', () => {
  it('volta para a página que pediu login', () => {
    expect(getRedirectTarget({ from: '/board?project=p1' })).toBe(
      '/board?project=p1',
    )
  })

  it('usa a Inbox quando não há origem', () => {
    expect(getRedirectTarget(null)).toBe(HOME_PATH)
    expect(getRedirectTarget({})).toBe(HOME_PATH)
  })

  it('ignora destinos externos', () => {
    expect(getRedirectTarget({ from: '//site-malicioso.com' })).toBe(HOME_PATH)
    expect(getRedirectTarget({ from: 'https://site.com' })).toBe(HOME_PATH)
  })
})
