import { IconNotes } from '@/shared/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { DraftsCapture } from '@/features/drafts/components/DraftsCapture'
import { DraftsList } from '@/features/drafts/components/DraftsList'
import { useDraftsItems } from '@/features/drafts/hooks/useDraftsItems'

export function DraftsView() {
  const { data: items } = useDraftsItems()

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Rascunhos"
        icon={IconNotes}
        count={items?.length ?? 0}
      />
      <DraftsCapture />
      <DraftsList />
    </div>
  )
}
