import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('mantém o papel tipográfico junto de uma cor', () => {
    expect(cn('text-caption', 'text-fg')).toBe('text-caption text-fg')
    expect(cn('text-heading-2', 'text-accent')).toBe(
      'text-heading-2 text-accent',
    )
  })

  it('papel tipográfico substitui outro tamanho', () => {
    expect(cn('text-sm', 'text-body-sm')).toBe('text-body-sm')
  })
})
