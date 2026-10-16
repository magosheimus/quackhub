import { useState, type FormEvent } from 'react'
import {
  useCreateTaskLink,
  useDeleteTaskLink,
  useTaskLinks,
} from '@/features/tasks/hooks/links/useTaskLinks'
import {
  getLinkDomain,
  getLinkLabel,
  normalizeLinkUrl,
} from '@/features/tasks/lib/taskLinks'
import { useReorderList } from '@/shared/hooks/useReorderList'
import { queryKeys } from '@/shared/query/queryKeys'
import type { TaskLink } from '@/shared/types/entities'

export type CardLinkRow = {
  link: TaskLink
  label: string
  domain: string | null
}

function toCardLinkRow(link: TaskLink): CardLinkRow {
  return {
    link,
    label: getLinkLabel(link),
    domain: link.title ? getLinkDomain(link.url) : null,
  }
}

export function useCardLinks(taskId: string) {
  const { data: links = [] } = useTaskLinks(taskId)
  const { mutate: createLink, isPending: isCreating } =
    useCreateTaskLink(taskId)
  const { mutate: deleteLink } = useDeleteTaskLink(taskId)
  const { handleDragEnd } = useReorderList({
    table: 'task_links',
    items: links,
    queryKey: queryKeys.links.byTask(taskId),
  })
  const [urlDraft, setUrlDraft] = useState('')
  const [titleDraft, setTitleDraft] = useState('')

  const normalizedUrl = normalizeLinkUrl(urlDraft)
  const showInvalid = urlDraft.trim() !== '' && normalizedUrl === null

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!normalizedUrl) {
      return
    }
    createLink(
      {
        task_id: taskId,
        url: normalizedUrl,
        title: titleDraft.trim() || null,
      },
      {
        onSuccess: () => {
          setUrlDraft('')
          setTitleDraft('')
        },
      },
    )
  }

  return {
    rows: links.map(toCardLinkRow),
    urlDraft,
    setUrlDraft,
    titleDraft,
    setTitleDraft,
    showInvalid,
    canAdd: normalizedUrl !== null && !isCreating,
    submit,
    removeLink: deleteLink,
    handleDragEnd,
  }
}
