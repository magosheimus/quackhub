import type { MoodLevel } from '@/features/dailyTracker/lib/dailyTracker'
import type { HabitIconKey } from '@/features/dailyTracker/lib/habitAppearance'
import type { HabitType } from '@/shared/types/entities'

export const DAILY_TRACKER_TEXTS = {
  title: 'Meu dia',
  periodLabel: (sprintName: string | null, start: string, end: string) =>
    sprintName ? `${sprintName} · ${start} – ${end}` : `${start} – ${end}`,

  todayTitle: 'Hábitos de hoje',
  todayProgress: (done: number, total: number) =>
    `${done} de ${total} concluídos`,
  noHabitsToday: '— nenhum hábito agendado para hoje —',
  noHabits: '— nenhum hábito ainda: crie o primeiro em "Gerenciar hábitos" —',
  markDone: 'Marcar como feito',
  undo: 'Desfazer',
  doneToday: 'Feito hoje',
  decrease: (name: string) => `Diminuir ${name}`,
  increase: (name: string) => `Aumentar ${name}`,
  counterValue: (name: string) => `Quantidade de ${name}`,
  goalLabel: (goal: number) => `meta ${goal}`,

  heatmapTitle: (isSprint: boolean) =>
    isSprint ? 'Hábitos nesta sprint' : 'Hábitos nesta semana',
  doneColumn: 'Feitos',
  legendEmpty: 'Sem registro',
  legendOff: 'Fora da agenda',
  legendPartial: 'Parcial',
  legendDone: 'Feito',
  cellLabel: (habit: string, day: string, status: string) =>
    `${habit}, ${day}: ${status}`,
  done: 'feito',
  notDone: 'não feito',
  notScheduled: 'fora da agenda',
  progress: (value: number, goal: number) => `${value} de ${goal}`,
  habitStats: (done: number, total: number) => `${done}/${total}`,

  manageHabitsTitle: 'Gerenciar hábitos',
  habitsCount: (count: number) =>
    `${count} ${count === 1 ? 'hábito' : 'hábitos'}`,
  columnName: 'Hábito',
  columnType: 'Tipo',
  columnGoal: 'Meta',
  columnDays: 'Dias',
  columnDuration: 'Tempo',
  newHabitTitle: 'Novo hábito',
  editTitle: 'Editar hábito',
  edit: (name: string) => `Editar ${name}`,
  editLabel: 'Editar',
  delete: (name: string) => `Excluir ${name}`,
  deleteLabel: 'Excluir',
  deleteTitle: 'Excluir hábito',
  confirmDelete: (name: string) =>
    `O hábito "${name}" sai da lista e do mapa. Os registros antigos continuam na Analytics.`,
  save: 'Salvar',
  habitName: 'Nome do hábito',
  habitNamePlaceholder: 'Ex.: Academia, Água, Leitura',
  habitType: 'Tipo',
  typeBoolean: 'Feito / não feito',
  typeCounter: 'Contador com meta',
  typeLockedHint:
    'O tipo não muda depois de criado, para não misturar os registros antigos.',
  goal: 'Meta diária',
  goalDisabled: '—',
  weekdays: 'Dias da semana',
  duration: 'Tempo (min)',
  durationPlaceholder: '30',
  habitIcon: 'Ícone',
  habitColor: 'Cor',
  themeColor: 'Cor do tema',
  addHabit: 'Adicionar hábito',

  wellnessTitle: 'Como foi seu dia?',
  commentPlaceholder: 'Uma linha sobre o dia...',
  commentLabel: 'Comentário do dia',
  commentNeedsMood: 'Escolha o humor para anotar o dia.',
  summaryTitle: (isSprint: boolean) =>
    isSprint ? 'Resumo da sprint' : 'Resumo da semana',
  overallRate: (isSprint: boolean) =>
    `das metas ${isSprint ? 'da sprint' : 'da semana'} até hoje`,
  overallProgress: 'Metas cumpridas no período',
  todayLabel: 'Hoje',
  todayCount: (done: number, total: number) => `${done} de ${total}`,
  mostConsistent: 'Mais constante',
  needsAttention: 'Precisa de atenção',
  noHighlight: '—',
  moodRow: (isSprint: boolean) =>
    isSprint ? 'Humor na sprint' : 'Humor na semana',
  noMood: 'sem registro',
  moodOf: (day: string, mood: string) => `${day}: ${mood}`,
} as const

export const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const

export const WEEKDAY_NAMES = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: 'Esgotado',
  2: 'Cansado',
  3: 'Neutro',
  4: 'Bem',
  5: 'Excelente',
}

export const HABIT_TYPE_LABELS: Record<HabitType, string> = {
  boolean: DAILY_TRACKER_TEXTS.typeBoolean,
  counter: DAILY_TRACKER_TEXTS.typeCounter,
}

export const HABIT_ICON_LABELS: Record<HabitIconKey, string> = {
  target: 'Alvo',
  book: 'Livro',
  notebook: 'Caderno',
  feather: 'Pena',
  languages: 'Idiomas',
  code: 'Código',
  water: 'Água',
  mug: 'Caneca',
  tea: 'Chá',
  potion: 'Remédio',
  heart: 'Coração',
  exercise: 'Exercício',
  scale: 'Balança',
  bed: 'Cama',
  moon: 'Lua',
  sun: 'Sol',
  leaf: 'Folha',
  tree: 'Árvore',
  dog: 'Cachorro',
  music: 'Música',
  headphone: 'Fone de ouvido',
  brush: 'Pincel',
  gamepad: 'Videogame',
  coins: 'Moedas',
  home: 'Casa',
  spray: 'Limpeza',
  noSmoking: 'Sem cigarro',
  briefcase: 'Trabalho',
  pencil: 'Lápis',
  apple: 'Maçã',
  sofa: 'Sofá',
  users: 'Pessoas',
  fire: 'Fogo',
  star: 'Estrela',
}
