import { useMutation } from '@tanstack/react-query'
import {
  signInWithGoogle,
  signInWithPassword,
  signOut,
} from '@/features/auth/api/auth'

type Credentials = {
  email: string
  password: string
}

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: Credentials) =>
      signInWithPassword(email, password),
  })
}

export function useSignInWithGoogle() {
  return useMutation({ mutationFn: signInWithGoogle })
}

export function useSignOut() {
  return useMutation({ mutationFn: signOut })
}
