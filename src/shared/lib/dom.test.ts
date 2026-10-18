import { describe, expect, it } from 'vitest'
import { isEditableTarget } from './dom'

describe('isEditableTarget', () => {
  it('reconhece campos de texto e seletores', () => {
    expect(isEditableTarget(document.createElement('input'))).toBe(true)
    expect(isEditableTarget(document.createElement('textarea'))).toBe(true)
    expect(isEditableTarget(document.createElement('select'))).toBe(true)
  })

  it('ignora o que não é campo de texto', () => {
    expect(isEditableTarget(document.createElement('button'))).toBe(false)
    expect(isEditableTarget(document.createElement('div'))).toBe(false)
    expect(isEditableTarget(null)).toBe(false)
  })
})
