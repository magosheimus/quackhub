import { useQuery } from '@tanstack/react-query'
import {
  getAllHabits,
  getHabits,
} from '@/features/dailyTracker/api/dailyTracker'
import { queryKeys } from '@/shared/query/queryKeys'

export function useHabits() {
  return useQuery({
    queryKey: queryKeys.dailyTracker.habits,
    queryFn: getHabits,
  })
}

export function useAllHabits() {
  return useQuery({
    queryKey: queryKeys.dailyTracker.allHabits,
    queryFn: getAllHabits,
  })
}
