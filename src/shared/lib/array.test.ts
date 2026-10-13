import { describe, expect, it } from 'vitest'
import { moveItem } from './array'

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
