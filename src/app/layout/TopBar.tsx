import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/brand/logo-mark'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { IconMenu } from '@/shared/lib/icons'
import { APP_TEXTS } from '@/app/constants/texts'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { DailyNav } from './DailyNav'

type TopBarProps = {
  isMobile: boolean
  onOpenMenu: () => void
}

export function TopBar({ isMobile, onOpenMenu }: TopBarProps) {
  return (
    <header className="app-chrome flex h-14 shrink-0 items-stretch gap-6 border-b-2 border-(--chrome-edge) bg-surface px-4">
      {isMobile && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onOpenMenu}
          aria-label={APP_TEXTS.openMenu}
          className="self-center"
        >
          <IconMenu size={20} aria-hidden="true" />
        </Button>
      )}
      <div className="flex shrink-0 items-center gap-3 font-heading text-3xl text-accent">
        {isMobile && <LogoMark />}
        <span>{COMMON_TEXTS.brand}</span>
      </div>
      {!isMobile && <DailyNav orientation="horizontal" />}
      <div className="ml-auto flex min-w-0 items-center gap-3">
        <div className="w-full min-w-0 sm:w-64">
          <GlobalSearch />
        </div>
        {!isMobile && (
          <CardCreateModal triggerClassName="neon-hover h-10 shrink-0 text-sm" />
        )}
      </div>
    </header>
  )
}
