import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

// Cartão com borda e fundo de card. Padding padrão p-4 — para outro,
// passar p-* no className (o cn substitui).
export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-md border border-border bg-card p-4', className)}
      {...props}
    />
  )
}
