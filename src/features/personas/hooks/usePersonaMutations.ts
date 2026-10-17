import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPersona,
  deletePersona,
  updatePersona,
} from '@/features/personas/api/personas'
import {
  invalidatePersonaQueries,
  invalidateTaskQueries,
} from '@/shared/query/queryInvalidation'
import type { PersonaUpdate } from '@/features/personas/model/persona'

export function useCreatePersona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      invalidatePersonaQueries(queryClient)
    },
  })
}

export function useUpdatePersona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PersonaUpdate }) =>
      updatePersona(id, data),
    onSuccess: () => {
      invalidatePersonaQueries(queryClient)
    },
  })
}

export function useDeletePersona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePersona,
    onSuccess: () => {
      invalidatePersonaQueries(queryClient)
      invalidateTaskQueries(queryClient)
    },
  })
}
