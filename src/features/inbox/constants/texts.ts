export const INBOX_TEXTS = {
  title: 'Inbox',
  urgentSection: 'Urgentes',
  srsOverdueSection: 'SRS vencido',
  dueTodaySection: 'Prazo hoje',
  tasksCounter: 'tarefas',
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
} as const
