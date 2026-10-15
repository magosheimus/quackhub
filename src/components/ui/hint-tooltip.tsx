import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type HintTooltipProps = {
  text: string
  children: ReactNode
}

export function HintTooltip({ text, children }: HintTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex w-fit items-center" />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
