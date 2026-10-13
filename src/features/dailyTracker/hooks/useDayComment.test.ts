import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDayComment } from './useDayComment'

describe('useDayComment', () => {
  it('comentário salvo aparece como texto estático', () => {
    const { result } = renderHook(() => useDayComment('Dia bom', vi.fn()))
    expect(result.current.isStatic).toBe(true)
  })

  it('vira campo editável ao focar e volta ao enviar, salvando o rascunho', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useDayComment('Dia bom', onSave))

    act(() => result.current.startEditing())
    expect(result.current.isStatic).toBe(false)

    act(() => result.current.setDraft('Dia ótimo'))
    act(() => result.current.submit())
    expect(onSave).toHaveBeenCalledWith('Dia ótimo')
    expect(result.current.isStatic).toBe(true)
  })

  it('sem comentário continua como campo com botão de enviar', () => {
    const { result } = renderHook(() => useDayComment('', vi.fn()))
    expect(result.current.isStatic).toBe(false)
  })
})
