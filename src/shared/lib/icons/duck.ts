import { createElement } from 'react'
import type { IconProps } from './createIcon'

export const DUCK_OUTLINE =
  'M9 1h3v1h-3zM8 2h2v1h-2zM11 2h2v1h-2zM8 3h1v1h-1zM10 3h1v1h-1zM12 3h3v1h-3zM8 4h1v1h-1zM12 4h3v1h-3zM8 5h1v1h-1zM11 5h2v1h-2zM3 6h6v1h-6zM11 6h1v1h-1zM2 7h2v1h-2zM11 7h2v1h-2zM1 8h2v1h-2zM5 8h1v1h-1zM8 8h1v1h-1zM12 8h1v1h-1zM2 9h2v1h-2zM5 9h4v1h-4zM12 9h1v1h-1zM3 10h1v1h-1zM11 10h2v1h-2zM3 11h3v1h-3zM9 11h3v1h-3zM5 12h5v1h-5zM5 13h1v1h-1zM9 13h1v1h-1zM5 14h1v1h-1zM9 14h1v1h-1z'

export const DUCK_VIEW_BOX = '1 1 14 14'

export function IconDuck({ size = 16, style, ...props }: IconProps) {
  return createElement(
    'svg',
    {
      viewBox: DUCK_VIEW_BOX,
      fill: 'currentColor',
      ...props,
      stroke: 'none',
      width: size,
      height: size,
      style: { ...style, width: size, height: size },
    },
    createElement('path', { d: DUCK_OUTLINE }),
  )
}
