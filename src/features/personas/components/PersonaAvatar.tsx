import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import type { PersonaIconOption } from '@/features/personas/lib/persona'
import { cn } from '@/shared/lib/utils'

const AVATAR_SIZES = {
  sm: { box: 'size-8', icon: 16 },
  lg: { box: 'aspect-square w-1/5 max-w-28', icon: 56 },
} as const

type PersonaAvatarProps = {
  icon: PersonaIconOption
  name: string
  size: keyof typeof AVATAR_SIZES
}

export function PersonaAvatar({ icon, name, size }: PersonaAvatarProps) {
  const { box, icon: iconSize } = AVATAR_SIZES[size]
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-(--control-radius) border border-(--control-border) bg-(--control-bg) text-fg',
        box,
      )}
    >
      <PersonaIcon icon={icon} name={name} size={iconSize} />
    </span>
  )
}
