import type { MouseEvent, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import type { IconComponent } from '@/shared/lib/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { navLinkClass } from './navLinkClass'

type NavItemProps = {
  to: string
  icon: IconComponent
  label: string
  badge?: ReactNode
  end?: boolean
  hint?: string
  hintSide?: 'right' | 'bottom'
  isCompact?: boolean
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function NavItem({
  to,
  icon: Icon,
  label,
  badge,
  end,
  hint,
  hintSide = 'right',
  isCompact = false,
  onClick,
}: NavItemProps) {
  const link = (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      aria-label={isCompact ? label : undefined}
      className={(state) =>
        cn(navLinkClass(state), isCompact && 'justify-center px-0')
      }
    >
      <Icon size={isCompact ? 24 : 16} aria-hidden="true" />
      {!isCompact && label}
      {!isCompact && badge}
    </NavLink>
  )
  const tooltip = isCompact ? label : hint
  if (!tooltip) {
    return link
  }
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side={hintSide}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
