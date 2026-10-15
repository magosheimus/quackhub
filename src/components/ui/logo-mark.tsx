import { cn } from '@/shared/lib/utils'
import { DUCK_OUTLINE, DUCK_VIEW_BOX } from '@/shared/lib/icons/duck'

type LogoMarkProps = {
  size?: number
  className?: string
}

export function LogoMark({ size = 28, className }: LogoMarkProps) {
  return (
    <svg
      viewBox={DUCK_VIEW_BOX}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={cn('logo-mark', className)}
    >
      <path d={DUCK_OUTLINE} />
    </svg>
  )
}
