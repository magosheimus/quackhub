import {
  createElement,
  type ComponentType,
  type ReactElement,
  type SVGProps,
} from 'react'
import { cn } from '@/shared/lib/utils'

export const ICON_CLASS = 'icon-shadow'

export type IconSize = number

export type PixelarticonSvg = ComponentType<SVGProps<SVGSVGElement>>

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: IconSize
}

export type IconComponent = (props: IconProps) => ReactElement

export function createIcon(Svg: PixelarticonSvg): IconComponent {
  function Icon({ size = 16, style, className, ...props }: IconProps) {
    return createElement(Svg, {
      ...props,
      className: cn(ICON_CLASS, className),
      width: size,
      height: size,
      style: { ...style, width: size, height: size },
    })
  }
  return Icon
}
