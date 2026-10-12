import { describe, expect, it, vi } from 'vitest'
import { getSettings, subscribeSettings, updateSettings } from './settingsStore'

describe('settingsStore', () => {
  it('atualiza, aplica no documento e avisa os inscritos', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeSettings(listener)

    updateSettings({ cartucho: 'amber-dark', glow: true })

    expect(getSettings().cartucho).toBe('amber-dark')
    expect(document.documentElement.classList.contains('glow-on')).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
})
