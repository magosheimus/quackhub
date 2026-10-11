import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingText } from '@/components/ui/loading-text'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LOGIN_PATH } from '@/features/auth/lib/redirect'

export type RedirectState = {
  from?: string
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingText />
  }

  if (!session) {
    const state: RedirectState = { from: location.pathname + location.search }
    return <Navigate to={LOGIN_PATH} replace state={state} />
  }

  return children
}
