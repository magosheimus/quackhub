import { describe, expect, it } from 'vitest'
import { cycleItem, moveItem, toggleItem } from './array'

describe('moveItem', () => {
  it('move um item para a nova posição sem alterar a lista original', () => {
    const list = ['a', 'b', 'c', 'd']
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a', 'd'])
    expect(moveItem(list, 3, 0)).toEqual(['d', 'a', 'b', 'c'])
    expect(list).toEqual(['a', 'b', 'c', 'd'])
  })

  it('índice inexistente devolve a lista como está', () => {
    expect(moveItem(['a'], 5, 0)).toEqual(['a'])
  })
})

describe('toggleItem', () => {
  it('adiciona o item ausente e remove o presente', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b'])
  })
})

describe('cycleItem', () => {
  const items = ['off', 'subtle', 'glitch']

  it('anda para o próximo e para o anterior', () => {
    expect(cycleItem(items, 'off', 1)).toBe('subtle')
    expect(cycleItem(items, 'glitch', -1)).toBe('subtle')
  })

  it('dá a volta nas pontas', () => {
    expect(cycleItem(items, 'glitch', 1)).toBe('off')
    expect(cycleItem(items, 'off', -1)).toBe('glitch')
  })
})
