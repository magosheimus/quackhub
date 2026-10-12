type PrivacySection = {
  title: string
  paragraphs: readonly string[]
}

export const PRIVACY_CONTACT_EMAIL = 'itssheimus@gmail.com'

export const PRIVACY_TEXTS = {
  title: 'Política de privacidade',
  linkLabel: 'Política de privacidade',
  updatedAt: 'Atualizada em 11/10/2026',
  back: 'Voltar',
} as const

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    title: 'Dados coletados',
    paragraphs: [
      'Conta: seu e-mail. Se entrar com Google, também o nome e a foto do perfil enviados pelo Google.',
      'Conteúdo: projetos, épicos, cards, sprints, revisões, rascunhos e anexos que você cria.',
    ],
  },
  {
    title: 'Como os dados são usados',
    paragraphs: [
      'Somente para o funcionamento do QuackHub. Não há anúncios, venda de dados nem ferramentas de rastreamento ou analytics de terceiros.',
    ],
  },
  {
    title: 'Onde os dados ficam',
    paragraphs: [
      'No Supabase, em servidores em São Paulo (sa-east-1). Cada conta só acessa os próprios dados, e os anexos ficam em armazenamento privado.',
      'O site é hospedado na Cloudflare, que registra dados técnicos de acesso (como endereço IP) para segurança e entrega do site.',
    ],
  },
  {
    title: 'Armazenamento no navegador',
    paragraphs: [
      'O app usa o armazenamento local do navegador para a sessão de login, as preferências de aparência, o cache dos dados e a fila de rascunhos offline. Não são usados cookies de rastreamento.',
    ],
  },
  {
    title: 'Seus direitos',
    paragraphs: [
      'Pela Lei Geral de Proteção de Dados (LGPD), você pode acessar, corrigir e excluir seus dados.',
      'Exportar: Configurações → Exportar dados. Corrigir: edite direto no app. Excluir: Configurações → Excluir conta, que apaga a conta e todo o conteúdo de forma definitiva.',
    ],
  },
  {
    title: 'Contato',
    paragraphs: [
      `Dúvidas ou pedidos sobre seus dados: ${PRIVACY_CONTACT_EMAIL}.`,
    ],
  },
]
