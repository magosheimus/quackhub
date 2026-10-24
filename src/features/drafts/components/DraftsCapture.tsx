import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCaptureDraft } from '@/features/drafts/hooks/useCaptureDraft'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { Panel } from '@/components/layout/panel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDraftCaptureProject } from '@/features/drafts/hooks/useDraftCaptureProject'

const NONE_VALUE = '__none__'

export function DraftsCapture() {
  const [content, setContent] = useState('')
  const { mutate: capture, isPending } = useCaptureDraft()
  const { projects, project, selectProject } = useDraftCaptureProject()
  const canSubmit = !isPending && content.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) {
      return
    }
    capture(
      { content: content.trim(), projectId: project?.id ?? null },
      { onSuccess: () => setContent('') },
    )
  }

  return (
    <Panel className="flex flex-col gap-2 p-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit()
          }
        }}
        placeholder={DRAFTS_TEXTS.capturePlaceholder}
        className="min-h-16 px-2 py-1.5 focus-visible:ring-0"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-caption">{DRAFTS_TEXTS.captureHint}</span>
        <div className="flex items-center gap-2">
          <Select
            value={project?.id ?? NONE_VALUE}
            onValueChange={(v) => selectProject(v === NONE_VALUE ? null : v)}
          >
            <SelectTrigger size="sm" aria-label={DRAFTS_TEXTS.captureProject}>
              <SelectValue>
                {project?.name ?? DRAFTS_TEXTS.noProject}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                {DRAFTS_TEXTS.noProject}
              </SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {COMMON_TEXTS.add}
          </Button>
        </div>
      </div>
    </Panel>
  )
}
