import { describe, expect, it } from 'vitest'
import { describeActivity, type ActivityLookups } from './activityLog'

const lookups: ActivityLookups = {
  sprints: [{ id: 's1', name: 'Sprint 1' }],
  epics: [{ id: 'e1', name: 'FASE 2' }],
  projects: [
    { id: 'p1', name: 'QuackHub' },
    { id: 'p2', name: 'Home' },
  ],
}

function describe_(
  event_type: Parameters<typeof describeActivity>[0]['event_type'],
  old_value: string | null,
  new_value: string | null,
) {
  return describeActivity({ event_type, old_value, new_value }, lookups)
}

describe('describeActivity', () => {
  it('prioridade usa o rótulo do card', () => {
    expect(describe_('priority_change', 'medium', 'high')).toEqual({
      label: 'Prioridade',
      change: 'MÉDIA → ALTA',
    })
  })

  it('urgente vira texto legível', () => {
    expect(describe_('flag_change', 'false', 'true').change).toBe(
      'Não urgente → Urgente',
    )
  })

  it('épico e projeto mostram o nome, e vazio vira "Sem épico"', () => {
    expect(describe_('epic_change', 'e1', null).change).toBe(
      'FASE 2 → Sem épico',
    )
    expect(describe_('project_change', 'p1', 'p2').change).toBe(
      'QuackHub → Home',
    )
  })

  it('sprint vazia é Backlog, e item excluído aparece como removido', () => {
    expect(describe_('sprint_change', null, 's1').change).toBe(
      'Backlog → Sprint 1',
    )
    expect(describe_('epic_change', 'e9', 'e1').change).toBe(
      '(removido) → FASE 2',
    )
  })
})
