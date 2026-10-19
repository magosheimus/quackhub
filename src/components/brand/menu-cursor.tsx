import { IconVercelSolid } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type MenuCursorProps = {
  className?: string
}

// Seta de menu de jogo apontando para a direita (o ícone original aponta para cima)
export function MenuCursor({ className }: MenuCursorProps) {
  return (
    <IconVercelSolid
      size={12}
      aria-hidden="true"
      className={cn('shrink-0 rotate-90', className)}
    />
  )
}
