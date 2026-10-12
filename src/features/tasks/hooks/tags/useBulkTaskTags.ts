import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabase'
import { queryKeys } from '@/shared/query/queryKeys'
import { groupTagsByTask } from '@/features/tasks/lib/taskTags'

export function useBulkTaskTags(taskIds: string[]) {
  return useQuery({
    queryKey: queryKeys.taskTags.bulk(taskIds),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_tags')
        .select('task_id, tag_name')
        .in('task_id', taskIds)
      if (error) throw new Error(`Falha ao buscar tags: ${error.message}`)

      return groupTagsByTask(data)
    },
    enabled: taskIds.length > 0,
  })
}
