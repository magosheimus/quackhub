import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type EmptyMessageProps = {
  children: ReactNode
  className?: string
}

// Mensagem de lista ou seção vazia (ex.: "— nenhum card no backlog —")
export function EmptyMessage({ children, className }: EmptyMessageProps) {
  return <p className={cn('text-subtle', className)}>{children}</p>
}
