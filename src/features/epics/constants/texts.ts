export const EPICS_TEXTS = {
  title: 'Épicos',
  empty: '— nenhum épico ainda —',
  projectLabel: 'Projeto do épico',
  colorLabel: 'Cor do épico',
  namePlaceholder: 'Nome do novo épico',
  selectProject: 'Selecione o projeto',
  noEpic: 'Sem épico',
  selectEpic: 'Selecionar épico',
  newEpic: '+ Novo épico',
  confirmDelete: (name: string) =>
    `Excluir o épico "${name}"? Os cards vinculados ficam sem épico.`,
  rename: (name: string) => `Renomear épico ${name}`,
  delete: (name: string) => `Excluir épico ${name}`,
} as const
