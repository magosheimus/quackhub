import { describe, expect, it } from 'vitest'
import { collectTags, groupTagsByTask } from './taskTags'

describe('groupTagsByTask', () => {
  it('agrupa as tags por card', () => {
    expect(
      groupTagsByTask([
        { task_id: 't1', tag_name: 'GO' },
        { task_id: 't1', tag_name: 'Pediatria' },
        { task_id: 't2', tag_name: 'GO' },
      ]),
    ).toEqual({ t1: ['GO', 'Pediatria'], t2: ['GO'] })
  })

  it('o resultado sobrevive ao cache salvo como JSON', () => {
    const tagsByTask = groupTagsByTask([{ task_id: 't1', tag_name: 'GO' }])
    expect(JSON.parse(JSON.stringify(tagsByTask))).toEqual(tagsByTask)
  })
})

describe('collectTags', () => {
  it('lista as tags sem repetir, em ordem alfabética', () => {
    expect(
      collectTags({ t1: ['Pediatria', 'GO'], t2: ['GO', 'Cirurgia'] }),
    ).toEqual(['Cirurgia', 'GO', 'Pediatria'])
  })
})
