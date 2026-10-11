import { afterEach, describe, expect, it } from 'vitest'
import { dismissToast, getToasts, showErrorToast } from './toast'

describe('showErrorToast', () => {
  afterEach(() => {
    getToasts().forEach((toast) => dismissToast(toast.id))
  })

  it('não repete uma mensagem que já está na tela', () => {
    showErrorToast('Falhou')
    showErrorToast('Falhou')
    showErrorToast('Outro erro')

    expect(getToasts().map((toast) => toast.message)).toEqual([
      'Falhou',
      'Outro erro',
    ])
  })
})
