import { useSettings } from '@/features/settings/hooks/useSettings'
import { getWeekdayOrder } from '@/features/dailyTracker/lib/dailyTracker'

export function useWeekdayOrder(): number[] {
  const { settings } = useSettings()
  return getWeekdayOrder(settings.weekStartsOn)
}
