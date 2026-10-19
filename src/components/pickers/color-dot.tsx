import { cn } from '@/shared/lib/utils'

type ColorDotProps = {
  color: string
  className?: string
}

export function ColorDot({ color, className }: ColorDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('size-2 shrink-0 rounded-full', className)}
      style={{ backgroundColor: color }}
    />
  )
}
