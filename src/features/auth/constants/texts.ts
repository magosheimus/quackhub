export const AUTH_TEXTS = {
  title: 'Entrar',
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
} as const

export const AUTH_ERRORS = {
  invalidCredentials: 'E-mail ou senha incorretos.',
  emailNotConfirmed: 'Confirme seu e-mail antes de entrar.',
  signupDisabled: 'Cadastro fechado. Esta conta não tem acesso ao QuackHub.',
  accessDenied: 'Login cancelado.',
  rateLimited: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  generic: 'Não foi possível entrar. Tente novamente.',
} as const
