import { IconVercelSolid } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type MenuCursorProps = {
  className?: string
}

export function MenuCursor({ className }: MenuCursorProps) {
  return (
    <IconVercelSolid
      size={12}
      aria-hidden="true"
      className={cn('shrink-0 rotate-90', className)}
    />
  )
}
