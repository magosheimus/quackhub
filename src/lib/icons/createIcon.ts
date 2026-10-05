import {
  createElement,
  type ComponentType,
  type ReactElement,
  type SVGProps,
} from 'react'

export type IconSize = number

export type PixelarticonSvg = ComponentType<SVGProps<SVGSVGElement>>

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: IconSize
}

export type IconComponent = (props: IconProps) => ReactElement

export function createIcon(Svg: PixelarticonSvg): IconComponent {
  function Icon({ size = 16, style, ...props }: IconProps) {
    return createElement(Svg, {
      ...props,
      width: size,
      height: size,
      style: { ...style, width: size, height: size },
    })
  }
  return Icon
}
