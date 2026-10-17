export const INBOX_TEXTS = {
  title: 'Inbox',
  urgentSection: 'Urgentes',
  srsOverdueSection: 'SRS vencido',
  dueSection: 'Prazo até hoje',
  deadlinesCounter: 'prazo até hoje',
  overdueDetail: (count: number) =>
    count === 1 ? '1 atrasado' : `${count} atrasados`,
  reviewsCounter: 'revisões',
  urgentCounter: 'urgentes',
  emptyTitle: 'Sem pendências para hoje',
  emptyDescription: 'Crie um novo card para começar.',
  welcomeTitle: 'Bem-vindo ao QuackHub',
  welcomeDescription:
    'Comece criando seu primeiro projeto: é nele que seus cards vão ficar.',
  complete: '✓ Concluir',
  reviewWithoutDate: 'revisão sem data',
  reviewToday: 'revisar hoje',
  reviewOverdue: (dayCount: string) => `revisão vencida há ${dayCount}`,
  reviewIn: (dayCount: string) => `revisar em ${dayCount}`,
  dueToday: 'vence hoje',
  dueTodayAt: (time: string) => `vence hoje às ${time}`,
  dueOverdue: (dayCount: string) => `atrasado há ${dayCount}`,
} as const
