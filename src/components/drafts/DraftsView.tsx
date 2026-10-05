import { IconNotes } from '@/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { DraftsCapture } from './DraftsCapture'
import { DraftsList } from './DraftsList'
import { useDraftsItems } from '@/hooks/drafts/useDraftsItems'

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
