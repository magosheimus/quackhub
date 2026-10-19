import { describe, expect, it } from 'vitest'
import { readSettingsTab } from './settingsTab'

describe('readSettingsTab', () => {
  it('lê a aba da URL', () => {
    expect(readSettingsTab(new URLSearchParams('tab=personas'))).toBe(
      'personas',
    )
  })

  it('sem aba ou com aba desconhecida, abre Aparência', () => {
    expect(readSettingsTab(new URLSearchParams())).toBe('appearance')
    expect(readSettingsTab(new URLSearchParams('tab=xyz'))).toBe('appearance')
  })
})
