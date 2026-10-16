import { describe, expect, it } from 'vitest'
import { isSettingsShortcut, shouldLeaveSettings } from './shortcut'

describe('isSettingsShortcut', () => {
  it('reconhece Ctrl + , e Cmd + ,', () => {
    expect(
      isSettingsShortcut({ key: ',', ctrlKey: true, metaKey: false }),
    ).toBe(true)
    expect(
      isSettingsShortcut({ key: ',', ctrlKey: false, metaKey: true }),
    ).toBe(true)
  })

  it('ignora a vírgula sozinha e outras teclas', () => {
    expect(
      isSettingsShortcut({ key: ',', ctrlKey: false, metaKey: false }),
    ).toBe(false)
    expect(
      isSettingsShortcut({ key: 'k', ctrlKey: true, metaKey: false }),
    ).toBe(false)
  })
})

describe('shouldLeaveSettings', () => {
  const idle = { isTyping: false, hasOpenOverlay: false }
  const escape = { key: 'Escape', defaultPrevented: false }

  it('sai com Esc quando nada mais está usando a tecla', () => {
    expect(shouldLeaveSettings(escape, idle)).toBe(true)
  })

  it('não sai digitando, com diálogo aberto ou se o Esc já foi tratado', () => {
    expect(shouldLeaveSettings(escape, { ...idle, isTyping: true })).toBe(false)
    expect(shouldLeaveSettings(escape, { ...idle, hasOpenOverlay: true })).toBe(
      false,
    )
    expect(
      shouldLeaveSettings({ ...escape, defaultPrevented: true }, idle),
    ).toBe(false)
  })

  it('ignora outras teclas', () => {
    expect(shouldLeaveSettings({ ...escape, key: 'Enter' }, idle)).toBe(false)
  })
})
