import { cn } from '@/shared/lib/utils'

type LogoMarkProps = {
  size?: number
  className?: string
}

const DUCK_OUTLINE =
  'M9 1h3v1h-3zM8 2h2v1h-2zM11 2h2v1h-2zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h3v1h-3zM8 4h1v1h-1zM12 4h3v1h-3zM8 5h1v1h-1zM11 5h2v1h-2zM3 6h6v1h-6zM11 6h1v1h-1zM2 7h2v1h-2zM11 7h2v1h-2zM1 8h2v1h-2zM5 8h1v1h-1zM8 8h1v1h-1zM12 8h1v1h-1zM2 9h2v1h-2zM5 9h4v1h-4zM12 9h1v1h-1zM3 10h1v1h-1zM11 10h2v1h-2zM3 11h3v1h-3zM9 11h3v1h-3zM5 12h5v1h-5zM5 13h1v1h-1zM9 13h1v1h-1zM5 14h1v1h-1zM9 14h1v1h-1z'

export function LogoMark({ size = 28, className }: LogoMarkProps) {
  return (
    <svg
      viewBox="1 1 14 14"
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
