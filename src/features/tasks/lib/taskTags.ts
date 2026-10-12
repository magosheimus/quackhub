export type TagsByTask = Record<string, string[]>

type TaskTagRow = {
  task_id: string
  tag_name: string
}

export function groupTagsByTask(rows: TaskTagRow[]): TagsByTask {
  const tagsByTask: TagsByTask = {}
  for (const row of rows) {
    tagsByTask[row.task_id] = [...(tagsByTask[row.task_id] ?? []), row.tag_name]
  }
  return tagsByTask
}

export function collectTags(tagsByTask: TagsByTask): string[] {
  return [...new Set(Object.values(tagsByTask).flat())].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
}
