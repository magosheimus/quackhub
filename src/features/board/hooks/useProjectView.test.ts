import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { useProjectView } from './useProjectView'

describe('useProjectView', () => {
  beforeEach(() => localStorage.clear())

  it('começa em Andamento e lembra a última visão escolhida', () => {
    const { result } = renderHook(() => useProjectView())
    expect(result.current.view).toBe('progress')

    act(() => result.current.selectView('epics'))
    expect(localStorage.getItem(STORAGE_KEYS.projectView)).toBe('epics')
    expect(renderHook(() => useProjectView()).result.current.view).toBe('epics')
  })

  it('valor inválido salvo volta para Andamento', () => {
    localStorage.setItem(STORAGE_KEYS.projectView, 'kanban')
    expect(renderHook(() => useProjectView()).result.current.view).toBe(
      'progress',
    )
  })
})
