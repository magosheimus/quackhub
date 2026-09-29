import { InboxCapture } from './InboxCapture'
import { InboxList } from './InboxList'

export function InboxView() {
  return (
    <div className="flex flex-col gap-4">
      <InboxCapture />
      <InboxList />
    </div>
  )
}
