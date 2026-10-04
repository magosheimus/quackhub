import { DraftsCapture } from './DraftsCapture'
import { DraftsList } from './DraftsList'

export function DraftsView() {
  return (
    <div className="flex flex-col gap-4">
      <DraftsCapture />
      <DraftsList />
    </div>
  )
}
