import { useQuery } from '@tanstack/react-query'
import { getAgendaItems } from '@/services/agenda/agenda'

export function useAgendaItems() {
  return useQuery({
    queryKey: ['agenda'],
    queryFn: getAgendaItems,
  })
}
