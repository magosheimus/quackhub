import { describe, expect, it } from 'vitest'
import { getLinkDomain, getLinkLabel, normalizeLinkUrl } from './taskLinks'

describe('normalizeLinkUrl', () => {
  it('mantém links http(s) válidos', () => {
    expect(normalizeLinkUrl(' https://supabase.com/docs ')).toBe(
      'https://supabase.com/docs',
    )
  })

  it('completa com https quando falta o protocolo', () => {
    expect(normalizeLinkUrl('youtube.com/watch?v=1')).toBe(
      'https://youtube.com/watch?v=1',
    )
  })

  it('recusa vazio, texto solto e outros protocolos', () => {
    expect(normalizeLinkUrl('   ')).toBeNull()
    expect(normalizeLinkUrl('anotação qualquer')).toBeNull()
    expect(normalizeLinkUrl('javascript://alert(1)')).toBeNull()
    expect(normalizeLinkUrl('ftp://arquivos.com')).toBeNull()
  })
})

describe('rótulo do link', () => {
  it('extrai o domínio sem www', () => {
    expect(getLinkDomain('https://www.youtube.com/watch')).toBe('youtube.com')
  })

  it('usa o título quando existe', () => {
    expect(getLinkLabel({ url: 'https://a.com', title: 'Aula 12' })).toBe(
      'Aula 12',
    )
  })

  it('sem título mostra a URL sem protocolo', () => {
    expect(getLinkLabel({ url: 'https://a.com/docs/', title: null })).toBe(
      'a.com/docs',
    )
  })
})
