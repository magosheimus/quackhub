import { useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabase'
import { clearUserLocalData } from '@/shared/lib/localData'
import { AuthContext, type AuthState } from '@/features/auth/hooks/authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [state, setState] = useState<AuthState>({
    session: null,
    isLoading: true,
  })

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearUserLocalData(queryClient)
      }
      setState({ session, isLoading: false })
    })
    return () => data.subscription.unsubscribe()
  }, [queryClient])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
