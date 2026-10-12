import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/ui/logo-mark'
import { IconMenu } from '@/shared/lib/icons'
import { APP_TEXTS } from '@/app/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type MobileTopBarProps = {
  onOpenMenu: () => void
}

export function MobileTopBar({ onOpenMenu }: MobileTopBarProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b-2 border-border-strong bg-surface px-4 py-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenMenu}
        aria-label={APP_TEXTS.openMenu}
      >
        <IconMenu size={20} aria-hidden="true" />
      </Button>
      <div className="flex items-center gap-2 font-heading text-2xl text-accent">
        <LogoMark size={28} />
        <span>{COMMON_TEXTS.brand}</span>
      </div>
    </header>
  )
}
