export const AUTH_TEXTS = {
  subtitle: 'Acesso restrito.',
  email: 'E-mail',
  emailPlaceholder: 'voce@exemplo.com',
  password: 'Senha',
  submit: 'Entrar',
  submitting: 'Entrando...',
  divider: 'ou',
  google: 'Entrar com Google',
  account: 'Conta',
  signedInAs: (email: string) => `Sessão ativa: ${email}`,
  signOut: 'Sair',
  signingOut: 'Saindo...',
  deleteAccount: 'Excluir conta',
  deletingAccount: 'Excluindo...',
  deleteAccountTitle: 'Excluir conta',
  deleteAccountDescription:
    'Apaga a conta e todos os dados: projetos, cards, sprints, revisões e anexos.',
  deleteAccountWarning:
    'Esta ação não pode ser desfeita. Se quiser guardar uma cópia, use "Exportar dados" antes.',
  deleteAccountConfirmLabel: (email: string) =>
    `Para confirmar, digite ${email}`,
  setPasswordSubtitle: 'Escolha a senha da sua conta.',
  newPassword: 'Nova senha',
  confirmPassword: 'Confirmar senha',
  passwordHint: 'Mínimo de 8 caracteres, com letras e números.',
  savePassword: 'Salvar senha',
  savingPassword: 'Salvando...',
  backToLogin: 'Ir para o login',
} as const

export const AUTH_ERRORS = {
  invalidCredentials: 'E-mail ou senha incorretos.',
  emailNotConfirmed: 'Confirme seu e-mail antes de entrar.',
  signupDisabled: 'Cadastro fechado. Esta conta não tem acesso ao QuackHub.',
  accessDenied: 'Login cancelado.',
  rateLimited: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  generic: 'Não foi possível entrar. Tente novamente.',
  invalidLink:
    'Link inválido ou expirado. Peça um novo convite ou uma nova recuperação de senha.',
  passwordTooShort: 'A senha precisa ter pelo menos 8 caracteres.',
  passwordNeedsLetterAndDigit: 'A senha precisa ter letras e números.',
  passwordMismatch: 'As senhas não são iguais.',
  weakPassword:
    'Senha fraca. Use pelo menos 8 caracteres, com letras e números.',
  samePassword: 'A nova senha precisa ser diferente da atual.',
} as const
