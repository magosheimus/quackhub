import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useBulkTaskTags(taskIds: string[]) {
  return useQuery({
    queryKey: ['task-tags', 'bulk', taskIds.sort().join(',')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_tags')
        .select('task_id, tag_name')
        .in('task_id', taskIds)
      if (error) throw new Error(`Falha ao buscar tags: ${error.message}`)

      const map = new Map<string, string[]>()
      for (const row of data) {
        const existing = map.get(row.task_id) ?? []
        existing.push(row.tag_name)
        map.set(row.task_id, existing)
      }
      return map
    },
    enabled: taskIds.length > 0,
  })
}
