import { createElement } from 'react'
import { cn } from '@/shared/lib/utils'
import { ICON_CLASS, type IconComponent, type IconProps } from './createIcon'

// Converte um desenho em linhas de texto ('#' = pixel aceso) num path de retângulos
export function pixelRowsToPath(rows: readonly string[]): string {
  return rows
    .flatMap((row, y) =>
      [...row.matchAll(/#+/g)].map(
        (run) => `M${run.index} ${y}h${run[0].length}v1h-${run[0].length}z`,
      ),
    )
    .join('')
}

// Ícone desenhado na própria grade: nítido quando exibido no tamanho da grade (ou múltiplo)
export function createPixelIcon(rows: readonly string[]): IconComponent {
  const gridSize = rows.length
  const path = pixelRowsToPath(rows)

  function PixelIcon({
    size = gridSize,
    style,
    className,
    ...props
  }: IconProps) {
    return createElement(
      'svg',
      {
        viewBox: `0 0 ${gridSize} ${gridSize}`,
        fill: 'currentColor',
        shapeRendering: 'crispEdges',
        ...props,
        className: cn(ICON_CLASS, className),
        width: size,
        height: size,
        style: { ...style, width: size, height: size },
      },
      createElement('path', { d: path }),
    )
  }
  return PixelIcon
}
