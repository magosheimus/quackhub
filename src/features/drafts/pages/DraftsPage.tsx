import { IconNotes } from '@/shared/lib/icons'
import { PageTitle } from '@/components/layout/page-title'
import { DraftsCapture } from '@/features/drafts/components/DraftsCapture'
import { DraftsList } from '@/features/drafts/components/DraftsList'
import { useDraftsSections } from '@/features/drafts/hooks/useDraftsSections'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'

export function DraftsPage() {
  const { pending } = useDraftsSections()

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title={DRAFTS_TEXTS.title}
        icon={IconNotes}
        count={pending.length}
      />
      <DraftsCapture />
      <DraftsList />
    </div>
  )
}
