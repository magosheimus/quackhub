export const SPRINT_ERRORS = {
  alreadyActive: 'Já existe uma Sprint ativa.',
} as const

export const SPRINTS_TEXTS = {
  noClosedSprints: '— nenhuma sprint encerrada ainda —',
  historyEmptyTitle: 'Nenhuma sprint encerrada',
  historyEmptyDescription:
    'Quando você encerrar uma sprint, ela aparece aqui com o que foi concluído.',
  goToCurrentSprint: 'Ir para a sprint atual',
  completedOf: (done: number, total: number) => `${done} de ${total}`,
  close: 'Encerrar Sprint',
  closing: 'Encerrando...',
  closeTitle: (name: string) => `Encerrar ${name}`,
  doneSection: (count: number) => `CONCLUÍDOS (${count})`,
  toReviewSection: (count: number) =>
    `A REVISAR — voltam ao Backlog automaticamente (${count})`,
  pendingSection: (count: number) =>
    `NÃO CONCLUÍDOS — decida cada um (${count})`,
  nextSprint: 'Próxima Sprint',
  noNextSprint:
    'Sem próxima Sprint criada ainda — todos vão pro Backlog por padrão.',
  newSprint: 'Nova Sprint',
  start: 'Início',
  end: 'Fim',
  goal: 'Goal (opcional)',
  goalPlaceholder: 'O que essa sprint quer alcançar...',
  defaultName: (number: number) => `Sprint ${number}`,
  noSprints: '— Nenhuma Sprint neste projeto —',
  progressLabel: 'Progresso da sprint',
  progress: (percent: number, done: number, total: number) =>
    `${percent}% concluído (${done}/${total})`,
  readyToStart: (name: string) => `${name} — pronta pra começar`,
  totalIssues: 'ISSUES TOTAL',
  completedIssues: 'ISSUES CONCLUÍDAS',
  completionRate: 'TAXA DE CONCLUSÃO',
  completionByProject: 'COMPLETION BY PROJECT',
  carryOver: 'CARRY-OVER',
  carriedToNext: (count: number) => `${count} cards → próxima Sprint`,
  carriedToBacklog: (count: number) => `${count} cards → Backlog`,
} as const
